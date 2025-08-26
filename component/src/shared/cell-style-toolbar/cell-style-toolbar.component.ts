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

export type BorderPreset =
  | 'none'
  | 'outside'
  | 'all'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

export interface CellStylePatch {
  /** Foreground (text) color; parent decides how to apply to content */
  color?: string;

  /** Fill & borders (matches your CellAttrs naming) */
  backgroundColor?: string;
  borderColor?: string;
  borderTop?: number;     // px
  borderRight?: number;   // px
  borderBottom?: number;  // px
  borderLeft?: number;    // px
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
    MatMenuModule, MatTooltipModule, MatDividerModule
  ]
})
export class CellStyleToolbarComponent {
  /** Excel-like palette (tweak to your theme) */
  palette: string[] = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f4f6', '#ffffff',
    '#ef4444', '#f59e0b', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f97316'
  ];

  weightOptions: number[] = [0, 1, 2, 3, 4, 6, 8];

  /** persistent toolbar state */
  @Input() fillColor: string = '#ffffff';
  @Input() fontColor: string = '#111827';
  @Input() borderColor: string = '#94a3b8';
  @Input() borderWeight: number = 1;

  /** which preset is currently selected (drives the toolbar icon) */
  selectedPreset: BorderPreset = 'outside';

  /** emits granular patches for immediate preview on current selection */
  @Output() styleChange = new EventEmitter<CellStylePatch>();

  /**
   * emits preset intent so parent can handle multi-cell logic if needed
   */
  @Output() borderPresetChange = new EventEmitter<{ preset: BorderPreset; weight: number; color: string }>();

  // --- derived icon for current preset ---
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

  // --- color/weight setters ---
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
    // emit color-only so parent can keep existing side widths if needed
    this.styleChange.emit({ borderColor: this.borderColor });
  }

  setBorderWeight(w: number) {
    this.borderWeight = w;
    // preview with current preset & color
    const patch = this.presetToPatch(this.selectedPreset, w);
    patch.borderColor = this.borderColor;
    this.styleChange.emit(patch);
  }

  // --- choose preset from menu (updates icon + emits) ---
  choosePreset(preset: BorderPreset) {
    this.selectedPreset = preset;
    this.applyPreset(preset);
  }

  // --- presets (reduced set) ---
  private applyPreset(preset: BorderPreset) {
    const weight = this.borderWeight;

    // parent can apply selection-aware logic using this event
    this.borderPresetChange.emit({ preset, weight, color: this.borderColor });

    // single-cell visual feedback immediately
    const patch = this.presetToPatch(preset, weight);
    patch.borderColor = this.borderColor;
    this.styleChange.emit(patch);
  }

  // maps preset → side widths (px) for single-cell preview
  private presetToPatch(preset: BorderPreset, w: number): CellStylePatch {
    const z = 0;
    switch (preset) {
      case 'none':     return { borderTop: z, borderRight: z, borderBottom: z, borderLeft: z };
      case 'outside':  return { borderTop: w, borderRight: w, borderBottom: w, borderLeft: w };
      case 'all':      return { borderTop: w, borderRight: w, borderBottom: w, borderLeft: w };
      case 'top':      return { borderTop: w };
      case 'right':    return { borderRight: w };
      case 'bottom':   return { borderBottom: w };
      case 'left':     return { borderLeft: w };
      default:         return {};
    }
  }

  /**
   * Opens a temporary native color picker appended to <body>.
   * Avoids Material menu flicker/close issues and works consistently across browsers.
   */
  openColorPicker(kind: 'fill' | 'font' | 'border'): void {
    const current =
      kind === 'fill'   ? this.fillColor   :
      kind === 'font'   ? this.fontColor   :
                          this.borderColor;

    const input = document.createElement('input');
    input.type = 'color';
    input.value = this.normalizeHex(current) ?? '#000000';

    // Make it invisible but clickable
    Object.assign(input.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '1px',
      height: '1px',
      opacity: '0',
      pointerEvents: 'none',
      zIndex: '2147483647',
    });

    document.body.appendChild(input);

    const cleanup = () => {
      try { document.body.removeChild(input); } catch {}
    };

    const apply = (val: string) => {
      if (kind === 'fill')   this.setFill(val);
      if (kind === 'font')   this.setFont(val);
      if (kind === 'border') this.setBorderColor(val);
    };

    input.addEventListener('input', () => apply(input.value));
    input.addEventListener('change', () => { apply(input.value); cleanup(); });
    input.addEventListener('blur', cleanup);

    // Must occur inside the same user gesture (button click)
    input.click();
  }

  private normalizeHex(v?: string): string | null {
    if (!v) return null;
    const s = v.trim();
    if (/^#[0-9a-f]{6}$/i.test(s)) return s;
    if (/^#[0-9a-f]{3}$/i.test(s)) {
      const r = s[1], g = s[2], b = s[3];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return null;
  }
}
