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

import { TokenAttributeType } from '../../../models/TokenAttributeType';
import { TokenAttribute } from '../../../models/TokenAttribute';
import { DisplayCondition, DisplayLogicGroup } from '../../../models/display-logic.models';
import { DisplayLogicUtility } from '../../../utils/display-logic.utility';

type ChainType = 'AND' | 'OR';
type Operator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER'
  | 'LESS'
  | 'CONTAINS'
  | 'NOT_NULL'
  | 'IS_EMPTY';

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
  @Input() public displayLogicGroup: DisplayLogicGroup | null = null;
  @Input() public tokenAttrs: TokenAttribute[] = [];

  /** Output: emits DisplayLogicGroup or null (no rules) on user change */
  @Output() public displayLogicChange = new EventEmitter<DisplayLogicGroup | null>();

  form!: FormGroup;
  conditionOutcomes: boolean[] = [];
  overallPass = false;
  displayTokenAttrs: TokenAttribute[] = [];

  // guards to avoid circular resets
  private isHydrating = false;
  private lastIncomingJson = ''; // last value received via @Input (JSON)
  private lastEmittedJson = '';  // last value we emitted (JSON)

  constructor(
    private fb: FormBuilder,
    private evaluator: DisplayLogicUtility
  ) {}

  // ───────────────────────────────────────────────────────────────
  // Lifecycle
  // ───────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      this.buildForm();
      return;
    }

    // tokens changed => refresh evaluation only
    if (changes['tokenAttrs'] && !changes['displayLogicGroup']) {
      this.refreshTokensOnly();
    }

    // external logic changed => patch (no rebuild, no wipe)
    if (changes['displayLogicGroup']) {
      const incoming = this.normalizeOrNull(this.displayLogicGroup);
      const incomingJson = JSON.stringify(incoming);

      // If this is exactly what we just emitted, ignore to prevent echo loop
      if (incomingJson === this.lastEmittedJson) {
        this.lastIncomingJson = incomingJson;
        return;
      }

      // Skip if logically identical to current form state
      const current = this.toDisplayLogicOrNull();
      if (this.sameLogic(incoming, current)) {
        this.lastIncomingJson = incomingJson;
        return;
      }

      this.lastIncomingJson = incomingJson;
      this.patchFromLogic(incoming);
    }
  }

  // ───────────────────────────────────────────────────────────────
  // Build / Patch
  // ───────────────────────────────────────────────────────────────
  private buildForm(): void {
    // tokens used for evaluation
    this.displayTokenAttrs = (this.tokenAttrs || []).map(
      t => new TokenAttribute(t.name, (t as any).value ?? '', TokenAttributeType.TEXT)
    );

    const initial = this.normalizeOrNull(this.displayLogicGroup);
    this.lastIncomingJson = JSON.stringify(initial);

    this.isHydrating = true;
    this.form = this.fb.group({
      chainType: this.fb.control<ChainType>((initial?.chainType ?? 'AND') as ChainType),
      conditions: this.fb.array([]),
    });

    // seed the array to the exact initial length (can be zero)
    const initialConds = initial?.conditions ?? [];
    initialConds.forEach(cond => this.conditions.push(this.makeConditionGroup(cond)));
    this.isHydrating = false;

    // evaluate + emit on user edits
    this.form.valueChanges.subscribe(() => {
      if (this.isHydrating) return;

      const logic = this.toDisplayLogicOrNull();
      const json = JSON.stringify(logic);

      // avoid churn/echo
      if (json === this.lastIncomingJson || json === this.lastEmittedJson) {
        this.runTest(logic);
        return;
      }

      this.lastEmittedJson = json;
      this.runTest(logic);
      this.displayLogicChange.emit(logic);
    });

    this.runTest(initial); // initial evaluation (no emit)
  }

  /** Patch existing form to match incoming logic (no rebuild) */
  private patchFromLogic(logic: DisplayLogicGroup | null): void {
    this.isHydrating = true;

    // chainType (default AND when null)
    const desiredChain = (logic?.chainType ?? 'AND') as ChainType;
    if (this.form.get('chainType')?.value !== desiredChain) {
      this.form.get('chainType')?.setValue(desiredChain, { emitEvent: false });
    }

    // ensure array length EXACT (allow zero)
    const arr = this.conditions;
    const want = logic?.conditions?.length ?? 0;
    while (arr.length < want) arr.push(this.makeConditionGroup(), { emitEvent: false } as any);
    while (arr.length > want) arr.removeAt(arr.length - 1, { emitEvent: false });

    // set values (only if changed)
    (logic?.conditions ?? []).forEach((c, i) => {
      const g = arr.at(i) as FormGroup;
      if (g.get('tokenName')?.value !== (c.tokenName ?? '')) {
        g.get('tokenName')?.setValue(c.tokenName ?? '', { emitEvent: false });
      }
      if (g.get('operator')?.value !== (c.operator ?? 'EQUALS')) {
        g.get('operator')?.setValue((c.operator ?? 'EQUALS') as Operator, { emitEvent: false });
      }
      const wantVal = c.operator === 'NOT_NULL' || c.operator === 'IS_EMPTY' ? '' : (c.value ?? '');
      if (g.get('value')?.value !== wantVal) {
        g.get('value')?.setValue(wantVal, { emitEvent: false });
      }
    });

    this.isHydrating = false;
    this.runTest(logic); // re-evaluate; no emit
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
      operator:  [((initial?.operator as Operator) || 'EQUALS') as Operator],
      value:     [initial?.value ?? ''],
    });

    // clear value for unary ops (muted)
    group.get('operator')?.valueChanges.subscribe((op) => {
      if (this.isHydrating) return;
      if (op === 'NOT_NULL' || op === 'IS_EMPTY') {
        const ctrl = group.get('value');
        if (ctrl?.value) {
          this.isHydrating = true;
          ctrl.setValue('', { emitEvent: false });
          this.isHydrating = false;
        }
      }
      this.runTest();
    });

    // local re-eval; parent emit handled by form.valueChanges
    group.valueChanges.subscribe(() => {
      if (this.isHydrating) return;
      this.runTest();
    });

    return group;
  }

  addCondition(initial?: Partial<DisplayCondition>) {
    this.isHydrating = true;
    this.conditions.push(this.makeConditionGroup(initial));
    this.isHydrating = false;
    // emit happens after user edits
  }

  removeCondition(index: number): void {
    this.isHydrating = true;
    this.conditions.removeAt(index); // <-- delete the requested index, not the last
    // DO NOT add a blank row anymore; allow zero rows
    this.isHydrating = false;

    const logic = this.toDisplayLogicOrNull();
    this.runTest(logic);
    this.lastEmittedJson = JSON.stringify(logic);
    this.displayLogicChange.emit(logic); // emits null when no rules remain
  }

  // ───────────────────────────────────────────────────────────────
  // Evaluation
  // ───────────────────────────────────────────────────────────────
  public runTest(logic?: DisplayLogicGroup | null): void {
    const l = logic ?? this.toDisplayLogicOrNull();

    if (!l || !l.conditions.length) {
      // No rules => visible by default; no per-condition outcomes
      this.conditionOutcomes = [];
      this.overallPass = true;
      return;
    }

    this.conditionOutcomes = l.conditions.map((cond: DisplayCondition) =>
      this.evaluator.evaluate(this.displayTokenAttrs, {
        chainType: 'AND',
        conditions: [cond],
      })
    );

    this.overallPass = this.evaluator.evaluate(this.displayTokenAttrs, l);
  }

  private refreshTokensOnly(): void {
    this.displayTokenAttrs = (this.tokenAttrs || []).map(
      t => new TokenAttribute(t.name, (t as any).value ?? '', TokenAttributeType.TEXT)
    );
    this.runTest();
  }

  // ───────────────────────────────────────────────────────────────
  // Test tab helpers (local only)
  // ───────────────────────────────────────────────────────────────
  public updateTokenName(index: number, newName: string): void {
    const row = this.displayTokenAttrs[index];
    if (!row) return;
    row.name = newName;
    const src = this.tokenAttrs.find(t => t.name === newName);
    if (src && src.value != null) row.value = String(src.value);
    this.runTest();
  }

  public updateTokenValue(index: number, newValue: string): void {
    const row = this.displayTokenAttrs[index];
    if (!row) return;
    row.value = newValue;
    this.runTest();
  }

  // ───────────────────────────────────────────────────────────────
  // Mapping & utils
  // ───────────────────────────────────────────────────────────────
  /** Map the current form state to a proper DisplayLogicGroup, or null if there are no rules. */
  private toDisplayLogicOrNull(): DisplayLogicGroup | null {
    const raw = this.form?.getRawValue() as {
      chainType: ChainType | string;
      conditions: Array<{ tokenName?: string; operator?: Operator | string; value?: string }>;
    };

    const conds = (raw?.conditions ?? []);
    if (!conds.length) return null; // ← emit null when there are no rules

    const chainType: ChainType = (raw?.chainType === 'OR' ? 'OR' : 'AND');

    const conditions: DisplayCondition[] = conds.map((c) => {
      const operator = (c?.operator as Operator) ?? 'EQUALS';
      const isUnary = operator === 'NOT_NULL' || operator === 'IS_EMPTY';
      const base: DisplayCondition = {
        tokenName: c?.tokenName ?? '',
        operator
      } as DisplayCondition;
      if (!isUnary) (base as any).value = c?.value ?? '';
      return base;
    });

    return { chainType, conditions };
  }

  /** Normalize incoming object, or return null when there are no rules. */
  private normalizeOrNull(l?: DisplayLogicGroup | null): DisplayLogicGroup | null {
    if (!l || !Array.isArray(l.conditions) || l.conditions.length === 0) return null;
    const chainType: ChainType = (l.chainType === 'OR') ? 'OR' : 'AND';
    const conditions: DisplayCondition[] = l.conditions.map((c) => {
      const operator = (c?.operator as Operator) ?? 'EQUALS';
      const isUnary = operator === 'NOT_NULL' || operator === 'IS_EMPTY';
      const base: DisplayCondition = {
        tokenName: c?.tokenName ?? '',
        operator
      } as DisplayCondition;
      if (!isUnary) (base as any).value = (c as any)?.value ?? '';
      return base;
    });
    return { chainType, conditions };
  }

  private sameLogic(a?: DisplayLogicGroup | null, b?: DisplayLogicGroup | null): boolean {
    return JSON.stringify(this.normalizeOrNull(a)) === JSON.stringify(this.normalizeOrNull(b));
  }
}
