import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {CellAttrs} from "../../models/interfaces";
import {ColorPickerOverlayComponent} from "../../shared/color-picker/color-picker-overlay.component";
import {NgIf} from "@angular/common";



@Component({
  selector: 'app-cell-attributes-dialog',
  templateUrl: './cell-attributes-dialog.component.html',
  imports: [
    MatFormField,
    MatDialogTitle,
    MatLabel,
    MatInput,
    FormsModule,
    MatDialogActions,
    MatButton,
    ColorPickerOverlayComponent,
    NgIf,
  ],
  styleUrls: ['./cell-attributes-dialog.component.scss']
})
export class CellAttributesDialogComponent {
  showBorderPicker = false;
  showBgPicker = false;

  constructor(
      public dialogRef: MatDialogRef<CellAttributesDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: CellAttrs
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
