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
import { CellAttrs } from '../../../../models/page';
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

  public setFill(color: string): void {
    this.brush.fillColor = color ?? 'transparent';
    const cell = this.ensureCell();
    cell.backgroundColor = this.brush.fillColor;
    this.cellAttributesChange.emit(cell);
  }

  public setBorderColor(color: string): void {
    this.brush.borderColor = color ?? '#94a3b8';
    const cell = this.ensureCell();
    cell.borderColor = this.brush.borderColor;
    this.cellAttributesChange.emit(cell);
  }


  public get borderBrushColor(): string {
    return this.brush.borderColor;
  }
  public get fillBrushColor(): string {
    return this.brush.fillColor;
  }

  private ensureCell(): CellAttrs {
    if (!this.cellAttributes) this.cellAttributes = {};
    return this.cellAttributes;
  }

  public applyPadding(v: { top: number; right: number; bottom: number; left: number }): void {
    const cell: CellAttrs = this.ensureCell();

    const clamp = (n: unknown): number => {
      const num: number = typeof n === 'number' ? n : Number(n);
      if (!Number.isFinite(num)) return 0;
      return Math.max(0, Math.round(num));
    };

    cell.paddingTop = clamp(v?.top);
    cell.paddingRight = clamp(v?.right);
    cell.paddingBottom = clamp(v?.bottom);
    cell.paddingLeft = clamp(v?.left);

    this.cellAttributesChange.emit(cell);
  }

  public applyBorder(v: { top: number; right: number; bottom: number; left: number }): void {
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
