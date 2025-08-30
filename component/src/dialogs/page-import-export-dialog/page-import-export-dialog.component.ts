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
import { PdfGenerateService, PdfGenerationResult } from '../../services/pdf-generate.service';
import { HtmlGenerationResult, PageToHtmlService } from '../../services/converters/page-to-html.service';

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
    private pdfGenerateService: PdfGenerateService,
    private pageToHtmlService: PageToHtmlService,
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

  // ----- Utilities -----
  private getTokens(): any[] {
    // Adjust if tokens live elsewhere
    return (this.data.page as any)?.tokenAttrs ?? [];
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  /** Open a real tab for PDF/blob navigation (no need to write into it). */
  private openBlobInNewTab(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  /** Open a writable tab synchronously (NO 'noopener') so we can document.write HTML into it. */
  private openWritableTab(): Window | null {
    // Important: omit 'noopener' or you'll lose the reference in some browsers
    return window.open('', '_blank');
  }

  // ----- Dialog -----
  public onClose(): void {
    this.dialogRef.close();
  }

  // ----- Previews -----
  public async generatePDFPreview(): Promise<void> {
    try {
      const result: PdfGenerationResult = await this.pdfGenerateService.generatePdfBase64(
        this.data.page,
        this.getTokens()
      );
      if (!result?.base64) throw new Error('PDF generation returned no data.');

      const pdfBytes = this.base64ToUint8Array(result.base64);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      this.openBlobInNewTab(blob);
    } catch (err) {
      console.error('PDF preview error:', err);
      alert('Failed to generate PDF preview.');
    }
  }

  public async generateHTMLPreview(): Promise<void> {
    // Open the tab first (user-initiated), then stream HTML in
    const tab = this.openWritableTab();
    if (!tab) { alert('Popup blocked. Please allow popups for this site.'); return; }

    try {
      // Lightweight placeholder while we generate
      tab.document.open();
      tab.document.write(`<!doctype html><title>Generating HTML…</title><body>Generating HTML…</body>`);
      tab.document.close();

      const result: HtmlGenerationResult = await this.pageToHtmlService.generateHtml(
        this.data.page,
        this.getTokens()
      );
      if (!result?.html) throw new Error('HTML generation returned no markup.');

      // Replace with the actual HTML
      tab.document.open();
      tab.document.write(result.html);
      tab.document.close();
      // Note: if the generated HTML references external assets, they must be reachable.
    } catch (err) {
      console.error('HTML preview error:', err);
      try { tab.document.body.innerText = 'Failed to generate HTML preview.'; } catch {}
    }
  }
}
