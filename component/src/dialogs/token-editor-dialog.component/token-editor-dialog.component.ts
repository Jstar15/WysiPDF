import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { TokenAttribute } from '../../models/TokenAttribute';
import { JsonTokenParserService } from '../../services/json-token-parser.service';
import {MatButton, MatIconButton} from "@angular/material/button";
import { NgForOf, NgIf } from "@angular/common";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { TokenAttributeTypeEnum } from "../../models/display-logic.models";
import {MatDivider} from "@angular/material/divider";

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
    MatTable,
    MatOption,
    MatTabGroup,
    MatTab,
    MatDialogActions,
    NgIf,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIcon,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatDivider,
    MatIconButton
  ],
})
export class TokenEditorDialogComponent {
  tabIndex = 0;

  name = '';
  value = '';
  selectedType: TokenAttributeTypeEnum | 'TEXT' = 'TEXT';

  typeSelections = [
    { value: 'TEXT', viewValue: 'Text' },
    { value: 'BOOLEAN', viewValue: 'Boolean' },
    { value: 'NUMBER', viewValue: 'Number' },
    { value: 'DATE', viewValue: 'Date' },
    { value: 'IMAGE', viewValue: 'Image' }
  ];

  attributes: TokenAttribute[] = [];
  dataSource = new MatTableDataSource<TokenAttribute>(this.attributes);

  // Added "value" column so values are always editable in the table
  displayedColumns: string[] = ['name', 'type', 'value', 'delete'];

  jsonText = '';
  isJsonValid = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TokenEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { attributes: TokenAttribute[] },
    private tokenParser: JsonTokenParserService
  ) {
    if (data?.attributes) {
      this.attributes = [...data.attributes];
      this.dataSource.data = this.attributes;
    }
  }

  canAdd(): boolean {
    return !(this.name.trim() && this.selectedType && this.value.trim());
  }

  addAttribute(): void {
    const newAttr: TokenAttribute = new TokenAttribute(
      this.name.trim(),
      this.value.trim(),
      this.selectedType as TokenAttributeTypeEnum
    );
    this.attributes.push(newAttr);
    this.dataSource.data = [...this.attributes];
    this.name = '';
    this.value = '';
  }

  removeAttribute(attr: TokenAttribute): void {
    this.attributes = this.attributes.filter(a => a !== attr);
    this.dataSource.data = [...this.attributes];
  }

  // Called when inline value edited; kept for parity/refresh if needed later
  onValueEdit(): void {
    // MatTable binds by reference, so nothing required; keep hook for future.
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
    } catch {
      this.isJsonValid = false;
    }
  }

  clearJson(): void {
    this.jsonText = '';
    this.isJsonValid = true;
  }

  injectJson(): void {
    try {
      const parsedAttrs: TokenAttribute[] = this.tokenParser.parse(this.jsonText);
      this.attributes = parsedAttrs;
      this.dataSource.data = [...this.attributes];
      this.tabIndex = 0; // switch to Tokens tab
      this.error = null;
    } catch (err: any) {
      this.error = err?.message || 'Failed to parse JSON.';
    }
  }
}
