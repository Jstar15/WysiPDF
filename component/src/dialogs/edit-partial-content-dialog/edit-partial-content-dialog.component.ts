import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatOption, MatSelect } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgForOf} from "@angular/common";

export interface EditPartialContentData {
  name: string;
  tokenOptions?: string[];
  selectedToken: string;
}

@Component({
  selector: 'app-edit-partial-content-dialog',
  templateUrl: './edit-partial-content-dialog.component.html',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatInput,
    NgForOf
  ],
  styleUrls: ['./edit-partial-content-dialog.component.scss']
})
export class EditPartialContentDialogComponent {
  constructor(
      public dialogRef: MatDialogRef<EditPartialContentDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: EditPartialContentData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    let payload : EditPartialContentData = {
      name: this.data.name,
      selectedToken: this.data.selectedToken
    }
    this.dialogRef.close(payload);
  }
}
