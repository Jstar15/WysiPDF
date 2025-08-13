import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import {ColorPickerOverlayComponent} from "../../shared/color-picker/color-picker-overlay.component";
import {NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {PageAttrs} from "../../models/interfaces";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-page-attributes-dialog',
  standalone: true,
  templateUrl: './page-attributes-dialog.component.html',
  imports: [
    MatFormField,
    MatLabel,
    ColorPickerOverlayComponent,
    NgIf,
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatInput,
    MatDialogActions,
    MatButton,
    MatSelect,
    MatOption,
    NgForOf
  ],
  styleUrls: ['./page-attributes-dialog.component.scss']
})
export class PageAttributesDialogComponent {
  showBgPicker = false;

  availableFonts: string[] = [
      'Raleway',
      'Roboto',
      'Nunito',
      'Cormorant',
      'OpenSans'
  ];

  constructor(
      public dialogRef: MatDialogRef<PageAttributesDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: PageAttrs
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }

}
