import {Component, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import { MatDialogContent } from "@angular/material/dialog";
import {MatInput, MatLabel} from "@angular/material/input";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {PdfGenerateService, PdfGenerationResult} from "../../../services/generators/pdf-generate.service";
import {HtmlGenerationResult, HtmlGenerateService} from "../../../services/generators/html-generate.service";
import {Page} from "../../../models/page";
import {MatIcon} from "@angular/material/icon";
import {MatFormField} from "@angular/material/form-field";

@Component({
  selector: 'app-import-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButton, MatDialogContent, MatFormField, MatIcon, MatInput, MatLabel, MatTab, MatTabGroup],
  templateUrl: './import-editor.component.html',
  styleUrls: ['./import-editor.component.scss']
})
export class ImportEditorComponent {
  @Input() page : Page;
  @Output() pageImported = new EventEmitter<Page>(); // <-- added

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
    private pageToHtmlService: HtmlGenerateService) {}

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
      this.onImport();
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
      this.pageImported.emit(parsed);                 // <-- emit page to parent
      this.page = parsed;                             // keep local state useful
      this.buildExport();
    } catch (e: any) {
      this.importError = e?.message || 'Invalid JSON.';
    }
  }

  // ----- Export -----
  private buildExport(): void {
    try {
      this.exportText = JSON.stringify(this.page, null, 2);
    } catch {
      this.exportText = '';
    }
  }

  private getDownloadName(): string {
    const base = (this.filename || '').trim() || 'page.json';
    return base.toLowerCase().endsWith('.json') ? base : `${base}.json`;
  }

  // ----- Utilities -----
  private getTokens(): any[] {
    // Adjust if tokens live elsewhere
    return (this.page as any)?.tokenAttrs ?? [];
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

  // ----- Previews -----
  public async generatePDFPreview(): Promise<void> {
    try {
      const result: PdfGenerationResult = await this.pdfGenerateService.generatePdfBase64(
        this.page,
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
        this.page,
        this.getTokens(),
        {
          fullDocument: true,
          pageView: true,
          title: 'WysiPDF Document'
        }
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
