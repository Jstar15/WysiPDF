import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { JsonTokenParserService } from '../../services/json-token-parser.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TokenAttribute } from '../../models/TokenAttribute';
import { TokenAttributeTypeEnum } from '../../models/display-logic.models';

@Component({
  selector: 'app-token-editor-dialog',
  templateUrl: './token-editor-dialog.component.html',
  styleUrls: ['./token-editor-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatButton,
    MatFormField,
    MatSelect,
    MatLabel,
    FormsModule,
    NgForOf,
    MatInput,
    MatOption,
    MatTabGroup,
    MatTab,
    MatDialogActions,
    NgIf,
    MatIcon,
    MatIconButton
  ],
})
export class TokenEditorDialogComponent {
  tabIndex = 0;

  name = '';
  value = '';
  selectedType: TokenAttributeTypeEnum = TokenAttributeTypeEnum.TEXT;

  // strictly map to your enum values
  typeSelections: Array<{ value: TokenAttributeTypeEnum; viewValue: string }> = [
    { value: TokenAttributeTypeEnum.TEXT,         viewValue: 'Text' },
    { value: TokenAttributeTypeEnum.BOOLEAN,      viewValue: 'Boolean' },
    { value: TokenAttributeTypeEnum.NUMBER,       viewValue: 'Number' },
    { value: TokenAttributeTypeEnum.JSON_ARRAY,   viewValue: 'JSON Array' },
    { value: TokenAttributeTypeEnum.STRING_ARRAY, viewValue: 'String Array' },
    { value: TokenAttributeTypeEnum.OBJECT,       viewValue: 'Object' },
  ];

  attributes: TokenAttribute[] = [];
  dataSource = new MatTableDataSource<TokenAttribute>(this.attributes);

  displayedColumns: string[] = ['name', 'type', 'value', 'delete'];

  jsonText = '';
  isJsonValid = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TokenEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { attributes: TokenAttribute[] },
    private tokenParser: JsonTokenParserService
  ) {
    if (data?.attributes?.length) {
      this.attributes = [...data.attributes];
      this.dataSource.data = this.attributes;
    }
  }

  canAdd(): boolean {
    return !(this.name.trim() && this.value.trim() && this.selectedType);
  }

  addAttribute(): void {
    const newAttr: TokenAttribute = {
      name: this.name.trim(),
      value: this.value.trim(),
      type: this.selectedType,
    };
    this.attributes = [...this.attributes, newAttr];
    this.dataSource.data = this.attributes;

    // reset inputs
    this.name = '';
    this.value = '';
    this.selectedType = TokenAttributeTypeEnum.TEXT;
  }

  removeAttribute(attr: TokenAttribute): void {
    this.attributes = this.attributes.filter(a => !(a.name === attr.name && a.type === attr.type && a.value === attr.value));
    this.dataSource.data = this.attributes;
  }

  onSave(): void {
    this.dialogRef.close(this.attributes);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  validateJson(): void {
    try {
      JSON.parse(this.jsonText);
      this.isJsonValid = true;
      this.error = null;
    } catch {
      this.isJsonValid = false;
    }
  }

  clearJson(): void {
    this.jsonText = '';
    this.isJsonValid = true;
    this.error = null;
  }

  injectJson(): void {
    try {
      const parsedAttrs: TokenAttribute[] = this.tokenParser.parse(this.jsonText);
      // ensure parsed values align with your interface
      this.attributes = parsedAttrs.map(a => ({
        name: a.name?.trim() ?? '',
        value: String(a.value ?? ''),
        type: a.type as TokenAttributeTypeEnum,
      }));
      this.dataSource.data = this.attributes;
      this.tabIndex = 0; // back to Tokens tab
      this.error = null;
    } catch (err: any) {
      this.error = err?.message || 'Failed to parse JSON.';
    }
  }
}
