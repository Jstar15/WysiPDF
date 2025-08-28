import { importProvidersFrom } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import 'zone.js';
import { TemplateEditorComponent } from './areas/template-editor/template-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { PdfGenerateService } from './services/pdf-generate.service';
import { HtmlGenerationResult, PageToHtmlService } from './services/page-to-html.service';

// ---- keep a single Angular app instance (unchanged) ----
let appPromise: Promise<any>;
appPromise = (async () => {
  try {
    const app = await createApplication({
      providers: [
        provideHttpClient(),
        importProvidersFrom(MatIconModule),
      ],
    });

    const templateEditor = createCustomElement(TemplateEditorComponent, {
      injector: app.injector,
    });
    if (!customElements.get('app-template-editor')) {
      customElements.define('app-template-editor', templateEditor);
    }

    return app;
  } catch (err) {
    console.error(err);
    return null;
  }
})();

// ---- shared service singletons (unchanged logic) ----
let pdfServiceInstance: PdfGenerateService | null = null;
async function getPdfService(): Promise<PdfGenerateService> {
  const app = await appPromise;
  if (!pdfServiceInstance) {
    pdfServiceInstance = app.injector.get(PdfGenerateService);
  }
  return pdfServiceInstance!;
}

let pageToHtmlServiceInstance: PageToHtmlService | null = null;
async function getHtmlService(): Promise<PageToHtmlService> {
  const app = await appPromise;
  if (!pageToHtmlServiceInstance) {
    pageToHtmlServiceInstance = app.injector.get(PageToHtmlService);
  }
  return pageToHtmlServiceInstance!;
}

// ---- lightweight instance wrapper (no globals) ----
export interface WysiPDFOptions {
  /** Element or selector to host the editor (default: document.body) */
  mount?: HTMLElement | string;
}

export class WysiPDF {
  private container: HTMLElement;

  constructor(options: WysiPDFOptions = {}) {
    this.container =
      typeof options.mount === 'string'
        ? (document.querySelector(options.mount) as HTMLElement) || document.body
        : options.mount || document.body;
  }

  private async ensureEditor(): Promise<HTMLElement & { page?: any }> {
    await appPromise;

    // Prefer editor within the container; fall back to first on page
    let el = (this.container.querySelector('app-template-editor') ||
      document.querySelector('app-template-editor')) as (HTMLElement & { page?: any }) | null;

    if (!el) {
      el = document.createElement('app-template-editor') as HTMLElement & { page?: any };
      this.container.appendChild(el);
    }
    return el;
  }

  /** Inject a Page object into the editor component. */
  async loadPage(page: any): Promise<void> {
    const el = await this.ensureEditor();
    el.page = page;
  }

  /** Subscribe to page changes from the editor component. */
  async onPageChange(callback: (updatedPage: any) => void): Promise<void> {
    const el = await this.ensureEditor();
    el.addEventListener('page-change', (e: Event) => {
      const ce = e as CustomEvent;
      callback(ce.detail);
    });
  }

  /** Generate base64 PDF from a page and token list. */
  async generatePdfBase64(page: any, tokens: any[]): Promise<string> {
    const service = await getPdfService();
    const result = await service.generatePdfBase64(page, tokens);
    return result.base64;
  }

  /** Generate base64 PDF from a page and JSON token string. */
  async generatePdfBase64FromJson(page: any, json: string): Promise<string> {
    const service = await getPdfService();
    const result = await service.generatePdfBase64FromJson(page, json);
    return result.base64;
  }

  /** Generate HTML from a page and token list. */
  async generateHtml(page: any, tokens: any[]): Promise<string> {
    const service = await getHtmlService();
    const result: HtmlGenerationResult = await service.generateHtml(page, tokens);
    return result.html;
  }

  /** Generate HTML from a page and JSON token string. */
  async generateHtmlFromJson(page: any, json: string): Promise<string> {
    const service = await getHtmlService();
    const result: HtmlGenerationResult = await service.generateHtmlFromJson(page, json);
    return result.html;
  }
}



// ---- ONE-LINER: expose constructor for non-module HTML pages ----
declare global { interface Window { WysiPDF: typeof WysiPDF } }
if (typeof window !== 'undefined') { window.WysiPDF = WysiPDF; }

// allow default/ESM import usage
export default WysiPDF;
