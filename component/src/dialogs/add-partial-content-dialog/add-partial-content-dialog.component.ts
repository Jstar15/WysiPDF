import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions
} from '@angular/material/dialog';
import {MatFormField, MatLabel, MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {Grid} from "../../models/interfaces";
import {NgForOf, NgIf} from "@angular/common";

export interface AddPartialContentDialogData {
  partials: Grid[];
}

export interface AddPartialContentDialogResult {
  selectedPartial: Grid;
}

@Component({
  selector: 'app-add-partial-content-dialog',
  templateUrl: './add-partial-content-dialog.component.html',
  styleUrls: ['./add-partial-content-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption,
    MatDialogActions,
    MatButton,
    NgForOf,
    NgIf
  ]
})
export class AddPartialContentDialogComponent {
  selectedPartialId: string | null = null;

  constructor(
      public dialogRef: MatDialogRef<AddPartialContentDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: AddPartialContentDialogData
  ) {
    if (data.partials.length > 0) {
      this.selectedPartialId = data.partials[0].id;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const selected = this.data.partials.find(p => p.id === this.selectedPartialId);
    if (selected) {
      this.dialogRef.close({ selectedPartial: selected } as AddPartialContentDialogResult);
    }
  }
}
