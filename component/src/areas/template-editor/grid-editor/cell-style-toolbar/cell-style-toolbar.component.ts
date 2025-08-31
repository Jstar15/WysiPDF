import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CellAttrs } from '../../../../models/interfaces';
import {ColorSwatchPickerComponent} from "../../../../shared/color-swatch-picker/color-swatch-picker.component";
import {SpacingPickerComponent} from "../../../../shared/spacing-picker/spacing-picker.component";

export type BorderPreset =
  | 'none'
  | 'outside'
  | 'all'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

@Component({
  selector: 'app-cell-style-toolbar',
  standalone: true,
  templateUrl: './cell-style-toolbar.component.html',
  styleUrls: ['./cell-style-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatTooltipModule, MatDividerModule,
    MatFormFieldModule, MatInputModule,
    ColorSwatchPickerComponent, SpacingPickerComponent
  ],
})
export class CellStyleToolbarComponent {
  @Input() cellAttributes: CellAttrs | undefined;
  @Input() colorPalettes: string[] | undefined;
  @Output() cellAttributesChange = new EventEmitter<CellAttrs>();

  /** Persistent brush (Excel-like painter) */
  private brush: {
    preset: BorderPreset;
    weight: number;
    borderColor: string;
    fillColor: string;
  } = {
    preset: 'outside',
    weight: 1,
    borderColor: '#000000',
    fillColor: 'transparent'
  };


  public weightOptions: number[] = [0, 1, 2, 3, 4, 6, 8];

  /* ================= Fill ================= */
  public setFill(color: string): void {
    this.brush.fillColor = color ?? 'transparent';
    const cell = this.ensureCell();
    cell.backgroundColor = this.brush.fillColor;
    this.cellAttributesChange.emit(cell);
  }

  /* ================= Border color ================= */
  public setBorderColor(color: string): void {
    this.brush.borderColor = color ?? '#94a3b8';
    const cell = this.ensureCell();
    cell.borderColor = this.brush.borderColor;
    this.cellAttributesChange.emit(cell);
  }

  /* ================= Weight ================= */
  public setPresetWeight(w: number): void {
    this.brush.weight = this.coerce(w);
    // don’t apply immediately, only sets brush
  }

  /* ================= Apply border preset only ================= */
  public applyBorder(): void {
    const cell = this.ensureCell();
    const w = this.brush.weight;

    switch (this.brush.preset) {
      case 'none':
        cell.borderTop = cell.borderRight = cell.borderBottom = cell.borderLeft = 0;
        break;
      case 'top':    cell.borderTop    = w; break;
      case 'right':  cell.borderRight  = w; break;
      case 'bottom': cell.borderBottom = w; break;
      case 'left':   cell.borderLeft   = w; break;
      case 'outside':
      case 'all':
        cell.borderTop = cell.borderRight = cell.borderBottom = cell.borderLeft = w;
        break;
    }

    cell.borderColor = this.brush.borderColor; // apply border color
    // ⛔ do not touch fill here anymore
    this.cellAttributesChange.emit(cell);
  }

  /* ================= User explicitly changes preset ================= */
  public choosePreset(preset: BorderPreset): void {
    this.brush.preset = preset; // update brush
    this.applyBorder();
  }

  /* ================= Bindings ================= */
  public get selectedPreset(): BorderPreset {
    return this.brush.preset;
  }
  public ensureWeight(): number {
    // old: return this.brush.weight || 1;
    return Number.isFinite(this.brush.weight) ? this.brush.weight : 1;
  }
  public get borderBrushColor(): string {
    return this.brush.borderColor;
  }
  public get fillBrushColor(): string {
    return this.brush.fillColor;
  }

  /* ================= Helpers ================= */
  private ensureCell(): CellAttrs {
    if (!this.cellAttributes) this.cellAttributes = {};
    return this.cellAttributes;
  }
  private coerce(v: number | string): number {
    if (typeof v === 'number') return Math.max(0, Math.round(v));
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  public applyPadding(v: { top: number; right: number; bottom: number; left: number }): void {
    const cell = this.ensureCell();

    const clamp = (n: unknown): number => {
      const num = typeof n === 'number' ? n : Number(n);
      if (!Number.isFinite(num)) return 0;
      return Math.max(0, Math.round(num));
    };

    cell.paddingTop = clamp(v?.top);
    cell.paddingRight = clamp(v?.right);
    cell.paddingBottom = clamp(v?.bottom);
    cell.paddingLeft = clamp(v?.left);


    this.cellAttributesChange.emit(cell);
  }

  public applyBorder2(v: { top: number; right: number; bottom: number; left: number }): void {
    this.setBorderColor(this.borderBrushColor);
    const cell = this.ensureCell();

    const clamp = (n: unknown): number => {
      const num = typeof n === 'number' ? n : Number(n);
      if (!Number.isFinite(num)) return 0;
      return Math.max(0, Math.round(num));
    };

    cell.borderTop = clamp(v?.top);
    cell.borderRight = clamp(v?.right);
    cell.borderBottom = clamp(v?.bottom);
    cell.borderLeft = clamp(v?.left);

    this.cellAttributesChange.emit(cell);
  }
}
