import { Component, Inject } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';

export interface StringArrayEditorDialogData {
  items: string[] | null;
  title?: string;
}

@Component({
  selector: 'app-string-array-editor-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NgForOf,
    MatDialogTitle, MatDialogContent, MatDialogActions,
    MatFormField, MatLabel, MatInput,
    MatButton, MatIconButton, MatIcon
  ],
  templateUrl: './string-array-editor-dialog.component.html',
  styleUrls: ['./string-array-editor-dialog.component.scss']
})
export class StringArrayEditorDialogComponent {
  items: string[] = [];
  newValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<StringArrayEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StringArrayEditorDialogData
  ) {
    this.items = data.items ? [...data.items] : [];
  }

  addItem(): void {
    const trimmed = this.newValue.trim();
    if (trimmed) {
      this.items.push(trimmed);
      this.newValue = '';
    }
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  onSave(): void {
    this.dialogRef.close(this.items);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
