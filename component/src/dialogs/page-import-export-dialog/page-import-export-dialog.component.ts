import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogActions,
  MatDialogContent
} from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import type { Page } from '../../models/interfaces';

export interface PageImportExportDialogData {
  page: Page;
}

@Component({
  selector: 'app-page-import-export-dialog',
  standalone: true,
  templateUrl: './page-import-export-dialog.component.html',
  styleUrls: ['./page-import-export-dialog.component.scss'],
  imports: [
    // Angular
    NgIf, FormsModule,
    // Dialog scaffolding
    MatDialogTitle, MatDialogActions, MatDialogContent,
    // Tabs
    MatTabGroup, MatTab,
    // Form & Inputs
    MatFormField, MatInput, MatLabel,
    // Buttons / Icons
    MatButton, MatIcon
  ]
})
export class PageImportExportDialogComponent implements OnInit {
  public tabIndex = 0;

  // Import state
  public importText = '';
  public importError: string | null = null;
  public selectedFilename: string | null = null;

  // Export state
  public exportText = '';
  public filename = 'page.json';

  constructor(
    public dialogRef: MatDialogRef<PageImportExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PageImportExportDialogData
  ) {}

  public ngOnInit(): void {
    this.buildExport();
  }

  // ----- Import -----
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedFilename = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.importText = (reader.result || '').toString();
      this.importError = null;
    };
    reader.onerror = () => {
      this.importError = 'Failed to read file.';
      this.importText = '';
    };
    reader.readAsText(file);
  }

  public onImport(): void {
    try {
      const parsed = JSON.parse(this.importText) as Page;
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON.');
      this.dialogRef.close({ page: parsed });
    } catch (e: any) {
      this.importError = e?.message || 'Invalid JSON.';
    }
  }

  // ----- Export -----
  private buildExport(): void {
    try {
      this.exportText = JSON.stringify(this.data.page, null, 2);
    } catch {
      this.exportText = '';
    }
  }

  private getDownloadName(): string {
    const base = (this.filename || '').trim() || 'page.json';
    return base.toLowerCase().endsWith('.json') ? base : `${base}.json`;
  }

  public downloadExport(): void {
    if (!this.exportText) return;
    const blob = new Blob([this.exportText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = this.getDownloadName();
    a.click();

    URL.revokeObjectURL(url);
  }

  // ----- Dialog -----
  public onClose(): void {
    this.dialogRef.close();
  }
}
