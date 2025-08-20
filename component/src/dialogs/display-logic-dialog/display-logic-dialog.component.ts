import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

import {
  DisplayCondition,
  DisplayLogicGroup,
} from '../../models/display-logic.models';
import { DisplayLogicService } from '../../services/display-logic.service';
import { TokenAttribute } from '../../models/TokenAttribute';
import { TokenAttributeTypeEnum } from '../../models/TokenAttributeTypeEnum';
import {MatTabsModule} from "@angular/material/tabs";

export interface VisibilityConfigDialogData {
  tokenAttrs: { name: string; value?: string }[]; // allow passing current actual values
  initialConfig?: DisplayLogicGroup;
}

@Component({
  standalone: true,
  templateUrl: './display-logic-dialog.component.html',
  styleUrls: ['./display-logic-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatDialogActions,
    MatDialogModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    MatTabsModule
  ],
})
export class DisplayLogicDialogComponent implements OnInit {
  form!: FormGroup;
  conditionOutcomes: boolean[] = [];
  overallPass: boolean = false;
  displayTokenAttrs: TokenAttribute[] = [];

  constructor(
    public dialogRef: MatDialogRef<
      DisplayLogicDialogComponent,
      DisplayLogicGroup
    >,
    @Inject(MAT_DIALOG_DATA) public data: VisibilityConfigDialogData,
    private fb: FormBuilder,
    private evaluator: DisplayLogicService
  ) {}

  ngOnInit(): void {
    this.displayTokenAttrs = (this.data.tokenAttrs || []).map(
      (t) => new TokenAttribute(t.name, t.value ?? '', TokenAttributeTypeEnum.TEXT)
    );

    this.form = this.fb.group({
      chainType: this.fb.control(this.data.initialConfig?.chainType || 'AND'),
      conditions: this.fb.array([]),
    });

    if (this.data.initialConfig?.conditions?.length) {
      this.data.initialConfig.conditions.forEach((cond) =>
        this.addCondition(cond)
      );
    } else {
      this.addCondition();
    }

    this.form.valueChanges.subscribe(() => {
      this.runTest();
    });

    this.runTest();
  }

  get conditions(): FormArray {
    return this.form.get('conditions') as FormArray;
  }

  trackByIndex(_: number, __: any) {
    return _;
  }

  private makeConditionGroup(initial?: Partial<DisplayCondition>) {
    const group = this.fb.group({
      tokenName: [initial?.tokenName || ''],
      operator: [initial?.operator || 'EQUALS'],
      value: [initial?.value || ''],
    });

    group.get('operator')?.valueChanges.subscribe((op) => {
      if (op === 'NOT_NULL' || op === 'IS_EMPTY') {
        group.get('value')?.setValue('');
      }
      this.runTest();
    });

    group.valueChanges.subscribe(() => {
      this.runTest();
    });

    return group;
  }

  addCondition(initial?: Partial<DisplayCondition>) {
    this.conditions.push(this.makeConditionGroup(initial));
  }

  removeCondition(index: number): void {
    this.conditions.removeAt(index);
    this.runTest();
  }

  runTest(): void {
    const logic: DisplayLogicGroup = this.form.value;
    this.conditionOutcomes = (logic.conditions || []).map((cond: DisplayCondition) => {
      return this.evaluator.evaluate(this.displayTokenAttrs, {
        chainType: 'AND',
        conditions: [cond],
      });
    });
    this.overallPass = this.evaluator.evaluate(this.displayTokenAttrs, logic);
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as DisplayLogicGroup);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  /** Called when the token name dropdown changes for the test token */
  updateTokenName(index: number, newName: string) {
    const existing = this.displayTokenAttrs[index];
    existing.name = newName;
    // Optionally reset value if you want: existing.value = '';
    this.runTest();
  }

  /** Called when the test token's value input changes */
  updateTokenValue(index: number, newValue: string) {
    this.displayTokenAttrs[index].value = newValue;
    this.runTest();
  }

}
