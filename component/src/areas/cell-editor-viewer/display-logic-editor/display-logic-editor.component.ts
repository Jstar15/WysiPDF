import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import {TokenAttributeTypeEnum} from "../../../models/TokenAttributeTypeEnum";
import {TokenAttribute} from "../../../models/TokenAttribute";
import {DisplayCondition, DisplayLogicGroup} from "../../../models/display-logic.models";
import {Cell} from "../../../models/interfaces";
import {DisplayLogicService} from "../../../utils/display-logic.service"; // kept for template styling if used


@Component({
  standalone: true,
  selector: 'app-display-logic-editor',
  templateUrl: './display-logic-editor.component.html',
  styleUrls: ['./display-logic-editor.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatDialogModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule
  ],
})
export class DisplayLogicEditorComponent implements OnInit, OnChanges {
  /** Inputs */
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];

  /** Output */
  @Output() public change = new EventEmitter<Cell>();

  form!: FormGroup;
  conditionOutcomes: boolean[] = [];
  overallPass = false;
  displayTokenAttrs: TokenAttribute[] = [];

  constructor(
    private fb: FormBuilder,
    private evaluator: DisplayLogicService
  ) {}

  // ───────────────────────────────────────────────────────────────
  // Lifecycle
  // ───────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.hydrate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cell'] || changes['tokenAttrs']) {
      this.hydrate();
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Hydration
  // ───────────────────────────────────────────────────────────────
  private hydrate(): void {
    // Build display tokens from incoming tokenAttrs (use TEXT for evaluation)
    this.displayTokenAttrs = (this.tokenAttrs || []).map(
      t => new TokenAttribute(t.name, (t as any).value ?? '', TokenAttributeTypeEnum.TEXT)
    );

    const initial: DisplayLogicGroup | undefined = this.cell?.displayLogic;

    // Build form
    this.form = this.fb.group({
      chainType: this.fb.control(initial?.chainType || 'AND'),
      conditions: this.fb.array([]),
    });

    if (initial?.conditions?.length) {
      initial.conditions.forEach(cond => this.addCondition(cond));
    } else {
      this.addCondition();
    }

    // Re-run test on edits
    this.form.valueChanges.subscribe(() => this.runTest());

    // Initial evaluation
    this.runTest();
  }

  // ───────────────────────────────────────────────────────────────
  // Form helpers
  // ───────────────────────────────────────────────────────────────
  get conditions(): FormArray {
    return this.form.get('conditions') as FormArray;
  }

  trackByIndex(index: number): number { return index; }

  private makeConditionGroup(initial?: Partial<DisplayCondition>) {
    const group = this.fb.group({
      tokenName: [initial?.tokenName || ''],
      operator:  [initial?.operator  || 'EQUALS'],
      value:     [initial?.value     || ''],
    });

    group.get('operator')?.valueChanges.subscribe((op) => {
      if (op === 'NOT_NULL' || op === 'IS_EMPTY') {
        group.get('value')?.setValue('');
      }
      this.runTest();
    });

    group.valueChanges.subscribe(() => this.runTest());

    return group;
  }

  addCondition(initial?: Partial<DisplayCondition>) {
    this.conditions.push(this.makeConditionGroup(initial));
  }

  removeCondition(index: number): void {
    this.conditions.removeAt(index);
    this.runTest();
  }

  // ───────────────────────────────────────────────────────────────
  // Evaluation
  // ───────────────────────────────────────────────────────────────
  runTest(): void {
    const logic: DisplayLogicGroup = this.form.value as DisplayLogicGroup;

    this.conditionOutcomes = (logic.conditions || []).map((cond: DisplayCondition) =>
      this.evaluator.evaluate(this.displayTokenAttrs, {
        chainType: 'AND',
        conditions: [cond],
      })
    );

    this.overallPass = this.evaluator.evaluate(this.displayTokenAttrs, logic);
  }

  // ───────────────────────────────────────────────────────────────
  // Actions (component style)
  // ───────────────────────────────────────────────────────────────
  /** Emit updated Cell with displayLogic from the form */
  save(): void {
    if (!this.form.valid) return;
    const nextLogic = this.form.value as DisplayLogicGroup;
    const nextCell: Cell = { ...this.cell, displayLogic: nextLogic };
    this.cell = nextCell;
    this.change.emit(nextCell);
  }

  /** Optional: keep no-op for templates that still call cancel() */
  cancel(): void {
    // No-op in component mode; leave state unchanged.
  }

  /** Update token name used for testing/evaluation only */
  updateTokenName(index: number, newName: string) {
    const existing = this.displayTokenAttrs[index];
    if (!existing) return;
    existing.name = newName;
    this.runTest();
  }

  /** Update token value used for testing/evaluation only */
  updateTokenValue(index: number, newValue: string) {
    if (!this.displayTokenAttrs[index]) return;
    this.displayTokenAttrs[index].value = newValue;
    this.runTest();
  }
}
