import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material (standalone)
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatMenuModule }    from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Your color picker
import { ColorPickerComponent } from '../color-picker/color-picker.component';

export type BorderPreset =
  | 'none'
  | 'outside'
  | 'all'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

export interface CellStylePatch {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderTop?: number;
  borderRight?: number;
  borderBottom?: number;
  borderLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
}

@Component({
  selector: 'app-cell-style-toolbar',
  standalone: true,
  templateUrl: './cell-style-toolbar.component.html',
  styleUrls: ['./cell-style-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatTooltipModule, MatDividerModule,
    MatFormFieldModule, MatInputModule,
    ColorPickerComponent
  ]
})
export class CellStyleToolbarComponent {
  palette: string[] = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f4f6', '#ffffff',
    '#ef4444', '#f59e0b', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f97316'
  ];

  weightOptions: number[] = [0, 1, 2, 3, 4, 6, 8];

  /** persistent toolbar state */
  @Input() fillColor: string = '#ffffff';
  @Input() fontColor: string = '#111827';
  @Input() borderColor: string = '#94a3b8';

  /** legacy weight label stays (we’ll keep it in sync) */
  @Input() borderWeight: number = 1;

  /** per-side padding */
  @Input() paddingTop: number = 0;
  @Input() paddingRight: number = 0;
  @Input() paddingBottom: number = 0;
  @Input() paddingLeft: number = 0;

  /** per-side borders */
  @Input() borderTop: number = 0;
  @Input() borderRight: number = 0;
  @Input() borderBottom: number = 0;
  @Input() borderLeft: number = 0;

  /** which preset is currently selected (kept for compatibility) */
  selectedPreset: BorderPreset = 'outside';

  /** emits granular patches for immediate preview on current selection */
  @Output() styleChange = new EventEmitter<CellStylePatch>();

  /** compatibility: still exposed (e.g. your parent is bound to it) */
  @Output() borderPresetChange = new EventEmitter<{ preset: BorderPreset; weight: number; color: string }>();

  // --- derived icon for current preset (unchanged) ---
  get currentBorderIcon(): string {
    switch (this.selectedPreset) {
      case 'none':   return 'border_clear';
      case 'top':    return 'border_top';
      case 'right':  return 'border_right';
      case 'bottom': return 'border_bottom';
      case 'left':   return 'border_left';
      case 'outside':return 'border_outer';
      case 'all':    return 'border_all';
      default:       return 'border_outer';
    }
  }

  // --- color setters ---
  setFill(c: string) {
    this.fillColor = c || '';
    this.styleChange.emit({ backgroundColor: this.fillColor });
  }
  setFont(c: string) {
    this.fontColor = c || '';
    this.styleChange.emit({ color: this.fontColor });
  }
  setBorderColor(c: string) {
    this.borderColor = c || '';
    this.styleChange.emit({ borderColor: this.borderColor });
  }

  // --- uniform border weight quick-set (kept) ---
  setBorderWeight(w: number) {
    this.borderWeight = w;
    // uniformly apply to all sides
    this.borderTop = this.borderRight = this.borderBottom = this.borderLeft = w;
    this.emitBorderPatch();
  }

  // --- presets (kept; remapped to per-side control) ---
  choosePreset(preset: BorderPreset) {
    this.selectedPreset = preset;
    const w = this.borderWeight;
    switch (preset) {
      case 'none':   this.borderTop = this.borderRight = this.borderBottom = this.borderLeft = 0; break;
      case 'all':
      case 'outside':
        this.borderTop = this.borderRight = this.borderBottom = this.borderLeft = w; break;
      case 'top':    this.resetBorders(); this.borderTop = w; break;
      case 'right':  this.resetBorders(); this.borderRight = w; break;
      case 'bottom': this.resetBorders(); this.borderBottom = w; break;
      case 'left':   this.resetBorders(); this.borderLeft = w; break;
    }
    // notify parent (compat)
    this.borderPresetChange.emit({ preset, weight: w, color: this.borderColor });
    this.emitBorderPatch();
  }
  private resetBorders() {
    this.borderTop = this.borderRight = this.borderBottom = this.borderLeft = 0;
  }

  // --- cross input handlers ---
  onPaddingInput(side: 'Top'|'Right'|'Bottom'|'Left', v: number|string) {
    (this as any)[`padding${side}`] = this.coerce(v);
    this.styleChange.emit({
      paddingTop: this.paddingTop,
      paddingRight: this.paddingRight,
      paddingBottom: this.paddingBottom,
      paddingLeft: this.paddingLeft,
    });
  }
  onBorderInput(side: 'Top'|'Right'|'Bottom'|'Left', v: number|string) {
    (this as any)[`border${side}`] = this.coerce(v);
    // keep the legacy label roughly in sync (average)
    this.borderWeight = Math.round((this.borderTop + this.borderRight + this.borderBottom + this.borderLeft) / 4);
    this.emitBorderPatch();
  }

  private emitBorderPatch() {
    this.styleChange.emit({
      borderTop: this.borderTop,
      borderRight: this.borderRight,
      borderBottom: this.borderBottom,
      borderLeft: this.borderLeft,
      borderColor: this.borderColor
    });
  }

  private coerce(v: number|string): number {
    if (typeof v === 'number') return Math.max(0, Math.round(v));
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }
  
}
