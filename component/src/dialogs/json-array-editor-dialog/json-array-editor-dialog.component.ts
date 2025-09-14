import { Component, Inject } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

import { TokenAttributeType } from '../../models/token-attribute-type';
import { TokenAttribute } from '../../models/token-attribute';

export interface JsonArrayEditorDialogData {
  items: TokenAttribute[] | null;
  title?: string;
}

@Component({
  selector: 'app-json-array-editor-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NgForOf,
    MatDialogTitle, MatDialogContent, MatDialogActions,
    MatFormField, MatLabel, MatInput, MatSelect, MatOption,
    MatButton, MatIconButton, MatIcon, MatTabGroup, MatTab
  ],
  templateUrl: './json-array-editor-dialog.component.html',
  styleUrls: ['./json-array-editor-dialog.component.scss']
})
export class JsonArrayEditorDialogComponent {
  public tabIndex = 0;
  items: TokenAttribute[] = [];
  addName = '';
  addType: TokenAttributeType = TokenAttributeType.TEXT;
  TokenAttributeType = TokenAttributeType;

  testRows: Array<{ [key: string]: string }> = [];

  readonly typeSelections = [
    { value: TokenAttributeType.TEXT, viewValue: 'Text' },
    { value: TokenAttributeType.BOOLEAN, viewValue: 'Boolean' },
    { value: TokenAttributeType.NUMBER, viewValue: 'Number' },
    { value: TokenAttributeType.STRING_ARRAY, viewValue: 'STRING Array' },
    { value: TokenAttributeType.IMAGE, viewValue: 'Image' },
    { value: TokenAttributeType.BARCODE, viewValue: 'Barcode' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: JsonArrayEditorDialogData,
    private dialogRef: MatDialogRef<JsonArrayEditorDialogComponent, TokenAttribute[]>
  ) {
    const incoming = Array.isArray(data?.items) ? data.items : [];
    this.items = incoming.map(it => {
      const t = new TokenAttribute(it.name, it.value, it.type);
      t.valueArray = it.valueArray ? [...it.valueArray] : [];
      return t;
    });
    this.rebuildTestRows();
  }

  trackByIndex = (i: number) => i;

  /* ===== Tokens Tab ===== */
  canAdd(): boolean {
    return !(this.addName?.trim() && this.addType !== undefined);
  }

  addItem(): void {
    const name = (this.addName || '').trim();
    if (!name) return;

    const token = new TokenAttribute(name, '', this.addType);
    token.valueArray = [];
    this.items.push(token);

    this.addName = '';
    this.addType = TokenAttributeType.TEXT;
    this.rebuildTestRows();
  }

  removeItem(item: TokenAttribute): void {
    this.items = this.items.filter(t => t !== item);
    this.rebuildTestRows();
  }

  /* ===== Test Tab ===== */
  addTestRow(): void {
    this.items.forEach(t => {
      t.valueArray = t.valueArray ?? [];
      t.valueArray.push('');
    });
    this.rebuildTestRows();
  }

  removeTestRow(index: number): void {
    this.items.forEach(t => t.valueArray?.splice(index, 1));
    this.rebuildTestRows();
  }

  updateTestValue(token: TokenAttribute, rowIndex: number, value: string): void {
    if (!token.valueArray) token.valueArray = [];
    token.valueArray[rowIndex] = value;
    // ← removed rebuildTestRows() here to prevent cursor jumping
  }

  rebuildTestRows(): void {
    const rowCount = this.items.reduce((max, t) => Math.max(max, t.valueArray?.length ?? 0), 0);
    this.testRows = [];
    for (let i = 0; i < rowCount; i++) {
      const row: { [key: string]: string } = {};
      this.items.forEach(t => {
        row[t.name] = t.valueArray?.[i] ?? '';
      });
      this.testRows.push(row);
    }
  }

  /* ===== Dialog actions ===== */
  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    this.items.forEach(t => {
      t.value = JSON.stringify(t.valueArray ?? []);
    });
    this.dialogRef.close(this.items);
  }
}
