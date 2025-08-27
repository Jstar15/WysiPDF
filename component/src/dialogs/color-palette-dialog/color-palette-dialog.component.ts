import {
  Component,
  Inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatTooltipModule }    from '@angular/material/tooltip';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ColorPaletteGenerator } from '../../utils/color-palette.generator';
import {ColorSwatchPickerComponent} from "../../shared/color-swatch-picker/color-swatch-picker.component";

// NEW: overlay picker import

/** Dialog takes/returns just string[]; we wrap input under this token type for clarity */
export type ColorPaletteDialogData = string[];

type ColorControl = FormControl<string>;

@Component({
  selector: 'app-color-palette-dialog',
  standalone: true,
  templateUrl: './color-palette-dialog.component.html',
  styleUrls: ['./color-palette-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DragDropModule,
  ],
})
export class ColorPaletteDialogComponent implements OnInit {
  /** Regex: #RGB, #RRGGBB, or #RRGGBBAA */
  private static readonly HEX_PATTERN: RegExp =
    /^#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

  public readonly form: FormGroup<{ colors: FormArray<ColorControl> }>;
  public readonly colorsArray: FormArray<ColorControl>;

  /** For simple conditional UI (e.g., no colors yet) */
  public readonly hasColors = computed(() => this.colorsArray.length > 0);

  // NEW: which row’s picker is open (-1 none)
  public activePickerIndex: number = -1;

  constructor(
    public dialogRef: MatDialogRef<ColorPaletteDialogComponent, string[]>,
    @Inject(MAT_DIALOG_DATA) public data: ColorPaletteDialogData,
    private readonly fb: FormBuilder
  ) {
    this.colorsArray = this.fb.array<ColorControl>([]);
    this.form = this.fb.group({
      colors: this.colorsArray,
    });
  }

  public ngOnInit(): void {
    const initial = Array.isArray(this.data) ? this.data : [];
    if (initial.length === 0) {
      this.addColor('#000000');
    } else {
      for (const c of initial) {
        this.addColor(c);
      }
    }
  }

  // ──────────────────────────────────────────────
  // Actions
  // ──────────────────────────────────────────────

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    if (this.form.invalid || this.colorsArray.length === 0) return;
    const result = this.colorsArray.controls
      .map(c => this.normalizeHex(c.value ?? ''))
      .filter(v => v.length > 0);
    this.dialogRef.close(result);
  }

  public addColor(initial: string = '#000000'): void {
    const value = this.normalizeHex(initial);
    const ctrl = this.fb.control<string>(value, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(ColorPaletteDialogComponent.HEX_PATTERN),
      ],
    });
    this.colorsArray.push(ctrl);
  }

  public removeColor(index: number): void {
    if (index >= 0 && index < this.colorsArray.length) {
      this.colorsArray.removeAt(index);
      this.colorsArray.markAsDirty();
    }
  }

  public drop(event: CdkDragDrop<ColorControl[]>): void {
    moveItemInArray(this.colorsArray.controls, event.previousIndex, event.currentIndex);
    this.colorsArray.markAsDirty();
  }

  public trackByIndex(index: number): number {
    return index;
  }

  /** On blur, auto-fix user input: add '#' if missing, uppercase, etc. */
  public autoFix(index: number): void {
    const ctrl = this.colorsArray.at(index);
    const fixed = this.normalizeHex(ctrl.value ?? '');
    ctrl.setValue(fixed, { emitEvent: false });
    ctrl.updateValueAndValidity();
  }

  // NEW: open/close & apply from picker
  public openPicker(index: number): void {
    this.activePickerIndex = index === this.activePickerIndex ? -1 : index;
  }

  public applyPickedColor(index: number, hex: string): void {
    const ctrl = this.colorsArray.at(index);
    ctrl.setValue(this.normalizeHex(hex), { emitEvent: true });
    ctrl.markAsDirty();
    this.activePickerIndex = -1;
  }

  // ──────────────────────────────────────────────
  // UI helpers
  // ──────────────────────────────────────────────

  public swatch(color: string): string {
    return this.isHex(color) ? color : 'transparent';
  }

  public contrast(color: string): string {
    if (!this.isHex(color)) return '#000';
    const hex = this.toSixOrEight(color).slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  }

  public isInvalid(ctrl: ColorControl): boolean {
    return ctrl.touched && ctrl.invalid;
  }

  // ──────────────────────────────────────────────
  // Utils
  // ──────────────────────────────────────────────

  private normalizeHex(value: string): string {
    if (!value) return '';
    let v = value.trim();
    if (v[0] !== '#') v = `#${v}`;
    return v.toUpperCase();
  }

  private isHex(value: string): boolean {
    return ColorPaletteDialogComponent.HEX_PATTERN.test(value);
  }

  private toSixOrEight(value: string): string {
    if (!this.isHex(value)) return value;
    const v = value.toUpperCase();
    if (/^#[A-F0-9]{3}$/.test(v)) {
      const r = v[1], g = v[2], b = v[3];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return v; // already 6 or 8
  }

  /** Replace all existing colors with the given list */
  private replaceAll(hexes: string[]): void {
    while (this.colorsArray.length) this.colorsArray.removeAt(0);
    for (const h of hexes) this.addColor(h);
    this.form.markAsDirty();
  }

  /** UI handler: generate 20-color palette and replace the list */
  public generatePalette(): void {
    const palette = ColorPaletteGenerator.generate(20);
    this.replaceAll(palette);
  }


}
