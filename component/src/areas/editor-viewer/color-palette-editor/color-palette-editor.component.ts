import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel, MatError } from '@angular/material/input';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialogContent } from '@angular/material/dialog';
import { ColorPaletteGeneratorUtility } from '../../../utils/color-palette-generator.utility';
import { Subscription } from 'rxjs';

type ColorControl = FormControl<string>;

@Component({
  selector: 'app-color-palette-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatIcon,
    MatTooltip,
    MatDialogContent,
    CdkDrag,
    CdkDragHandle,
    CdkDropList
  ],
  templateUrl: './color-palette-editor.component.html',
  styleUrls: ['./color-palette-editor.component.scss']
})
export class ColorPaletteEditorComponent implements OnInit, OnDestroy, OnChanges {
  /** Single input: the working list of hex colors. */
  @Input() public colorPalettes?: string[];

  /** Single output: emits normalized, valid hex list whenever it changes. */
  @Output() public colorPalettesChange = new EventEmitter<string[]>();

  /** #RGB, #RRGGBB, or #RRGGBBAA */
  private static readonly HEX_PATTERN: RegExp =
    /^#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

  public readonly form: FormGroup<{ colors: FormArray<ColorControl> }>;
  public readonly colorsArray: FormArray<ColorControl>;

  private sub?: Subscription;

  constructor(private readonly fb: FormBuilder) {
    this.colorsArray = this.fb.array<ColorControl>([]);
    this.form = this.fb.group({
      colors: this.colorsArray
    });
  }

  public ngOnInit(): void {
    const initial = this.resolveInitialColors();
    if (initial.length === 0) {
      this.addColor('#000000');
    } else {
      for (const c of initial) this.addColor(c);
    }

    this.sub = this.form.valueChanges.subscribe(() => this.emitCurrent());
    this.emitCurrent(); // initial emit
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('colorPalettes' in changes && !changes['colorPalettes'].firstChange) {
      const nextList = this.resolveInitialColors();
      if (!this.arraysEqual(nextList, this.getCurrentValues())) {
        this.replaceAll(nextList);
      }
    }
  }

  public ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ─────────────────────────── Actions ───────────────────────────

  public addColor(initial: string = '#000000'): void {
    const value = this.normalizeHex(initial);
    const ctrl = this.fb.control<string>(value, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(ColorPaletteEditorComponent.HEX_PATTERN)
      ]
    });
    this.colorsArray.push(ctrl);
    this.emitCurrent();
  }

  public removeColor(index: number): void {
    if (index >= 0 && index < this.colorsArray.length) {
      this.colorsArray.removeAt(index);
      this.colorsArray.markAsDirty();
      this.emitCurrent();
    }
  }

  public drop(event: CdkDragDrop<ColorControl[]>): void {
    moveItemInArray(this.colorsArray.controls, event.previousIndex, event.currentIndex);
    this.colorsArray.markAsDirty();
    this.emitCurrent();
  }

  public trackByIndex(index: number): number {
    return index;
  }

  /** On blur, auto-fix user input: add '#' if missing, uppercase, etc. */
  public autoFix(index: number): void {
    const ctrl = this.colorsArray.at(index);
    const fixed = this.normalizeHex(ctrl.value ?? '');
    ctrl.setValue(fixed, { emitEvent: true }); // triggers emitCurrent via subscription
    ctrl.updateValueAndValidity();
  }

  /** Generate a 20-color palette and replace the list */
  public generatePalette(): void {
    const palette = ColorPaletteGeneratorUtility.generate(20);
    this.replaceAll(palette);
  }

  // ─────────────────────────── UI helpers ───────────────────────────

  public get hasColors(): boolean {
    return this.colorsArray.length > 0;
  }

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

  // ─────────────────────────── Internal ───────────────────────────

  private resolveInitialColors(): string[] {
    return Array.isArray(this.colorPalettes) ? this.colorPalettes : [];
  }

  private emitCurrent(): void {
    const list = this.getCurrentValues();
    this.colorPalettesChange.emit(list);
  }

  private getCurrentValues(): string[] {
    return this.colorsArray.controls
      .map(c => this.normalizeHex(c.value ?? ''))
      .filter(v => this.isHex(v));
  }

  private normalizeHex(value: string): string {
    if (!value) return '';
    let v = value.trim();
    if (v[0] !== '#') v = `#${v}`;
    return v.toUpperCase();
  }

  private isHex(value: string): boolean {
    return ColorPaletteEditorComponent.HEX_PATTERN.test(value);
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

  /** Replace all existing colors with the given list (single emit). */
  private replaceAll(hexes: string[]): void {
    while (this.colorsArray.length) this.colorsArray.removeAt(0);

    for (const raw of hexes) {
      const value = this.normalizeHex(raw);
      const ctrl = this.fb.control<string>(value, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(ColorPaletteEditorComponent.HEX_PATTERN)
        ]
      });
      this.colorsArray.push(ctrl, { emitEvent: false });
    }

    this.form.markAsDirty();
    this.emitCurrent();
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
