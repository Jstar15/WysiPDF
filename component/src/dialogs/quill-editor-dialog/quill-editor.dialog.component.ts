import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogTitle} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { QuillWrapperComponent } from '../../shared/quill-wrapper/quill-wrapper.component';
import { TokenAttribute } from '../../models/TokenAttribute';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButton} from "@angular/material/button";

@Component({
  standalone: true,
  imports: [CommonModule, QuillWrapperComponent, MatButton, MatDialogActions, MatDialogTitle],
  templateUrl: './quill-editor.dialog.component.html',
  styleUrls: ['./quill-editor.dialog.component.scss']
})
export class QuillEditorDialogComponent {
  html: string;
  attributeArray: TokenAttribute[];

  constructor(
      private dialogRef: MatDialogRef<QuillEditorDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { html: string; attributes: TokenAttribute[] }
  ) {
    this.html = data.html;
    this.attributeArray = data.attributes;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.html);
  }
}
