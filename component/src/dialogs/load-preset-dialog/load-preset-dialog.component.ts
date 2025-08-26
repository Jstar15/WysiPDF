import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { PresetsService } from '../../services/presets.service';
import { Page } from '../../models/interfaces';
import {MatOption} from "@angular/material/core";
import {MatFormField, MatLabel} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-load-preset-dialog',
  templateUrl: './load-preset-dialog.component.html',
  styleUrls: ['./load-preset-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    NgFor,
    NgIf,
    JsonPipe,
    MatOption,
    MatFormField,
    MatSelect,
    MatLabel,
    FormsModule
  ]
})
export class LoadPresetDialogComponent implements OnInit {
  presets: Page[] = [];
  selectedPreset?: Page;

  constructor(
    private presetsService: PresetsService,
    public dialogRef: MatDialogRef<LoadPresetDialogComponent, Page>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.presets = this.presetsService.getAllPresets();
  }

  onSelect(index: number): void {
    this.selectedPreset = this.presets[index];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onLoad(): void {
    if (this.selectedPreset) {
      this.dialogRef.close(this.selectedPreset);
    }
  }
}
