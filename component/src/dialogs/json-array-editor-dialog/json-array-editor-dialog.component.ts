import { Component, Inject } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
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
  MatDialogActions,
} from '@angular/material/dialog';

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
    MatButton, MatIconButton, MatIcon,
  ],
  templateUrl: './json-array-editor-dialog.component.html',
})
export class JsonArrayEditorDialogComponent {
  items: TokenAttribute[] = [];
  addName = '';
  addValue = '';
  addType: TokenAttributeType = TokenAttributeType.TEXT;
  TokenAttributeType = TokenAttributeType;

  // keep the same display list as parent
  readonly typeSelections: Array<{ value: TokenAttributeType; viewValue: string }> = [
    { value: TokenAttributeType.TEXT,         viewValue: 'Text' },
    { value: TokenAttributeType.BOOLEAN,      viewValue: 'Boolean' },
    { value: TokenAttributeType.NUMBER,       viewValue: 'Number' },
    { value: TokenAttributeType.STRING_ARRAY, viewValue: 'STRING Array' },
    { value: TokenAttributeType.OBJECT,       viewValue: 'Object' },
    { value: TokenAttributeType.IMAGE,        viewValue: 'Image' },
    { value: TokenAttributeType.BARCODE,      viewValue: 'Barcode' }
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: JsonArrayEditorDialogData,
    private dialogRef: MatDialogRef<JsonArrayEditorDialogComponent, TokenAttribute[]>
  ) {
    // Use a defensive clone so cancel won’t mutate caller state
    const incoming = Array.isArray(data?.items) ? data.items : [];
    this.items = incoming.map(it => new TokenAttribute(it.name, it.value, it.type));
  }

  canAdd(): boolean {
    return !(this.addName?.trim() && this.addType !== undefined);
  }

  addItem(): void {
    const name = (this.addName || '').trim();
    const val  = (this.addValue ?? '').toString();
    const type = this.addType;

    if (!name) return;

    const child = new TokenAttribute(name, val, type);
    // ensure nested holder exists if you later want deep nesting
    child.tokenAttributes = child.tokenAttributes ?? undefined;

    this.items = [...this.items, child];

    // reset add row
    this.addName = '';
    this.addValue = '';
    this.addType = TokenAttributeType.TEXT;
  }

  removeItem(item: TokenAttribute): void {
    this.items = this.items.filter(a => a !== item);
  }

  onCancel(): void {
    this.dialogRef.close(null); // caller can treat null as "no change"
  }

  onSave(): void {
    this.dialogRef.close(this.items);
  }

  trackByIndex = (i: number) => i;
}
