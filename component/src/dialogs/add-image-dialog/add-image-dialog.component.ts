import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatIcon } from "@angular/material/icon";
import { ImageBlock } from "../../models/interfaces";

@Component({
  selector: 'app-add-image-dialog',
  templateUrl: './add-image-dialog.component.html',
  styleUrls: ['./add-image-dialog.component.scss'],
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    MatFormField,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    NgIf,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon
  ]
})
export class AddImageDialogComponent implements OnInit {
  imageBase64: string = '';
  filename: string = '';
  width: number = 100;
  alignment: 'left' | 'center' | 'right' = 'left';

  constructor(
      public dialogRef: MatDialogRef<AddImageDialogComponent, ImageBlock>,
      @Inject(MAT_DIALOG_DATA) public data: ImageBlock
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.imageBase64 = this.data.imageBase64 || '';
      this.filename = this.data.filename || '';
      this.width = this.data.width ?? 100;
      this.alignment = this.data.alignment || 'left';
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      this.filename = file.name;
    };
    reader.readAsDataURL(file);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.imageBase64) return;
    const imageBlock: ImageBlock = {
      imageBase64: this.imageBase64,
      filename: this.filename,
      width: this.width,
      alignment: this.alignment
    };
    this.dialogRef.close(imageBlock);
  }
}