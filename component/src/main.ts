import { importProvidersFrom } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import 'zone.js';
import { TemplateEditorComponent } from './areas/template-editor/template-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { PdfGenerateService } from './services/pdf-generate.service';

// ✅ CHANGED: appPromise now returns the app object so we can access the injector
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
    customElements.define('app-template-editor', templateEditor);

    return app; // ✅ return the app so injector can be accessed later
  } catch (err) {
    console.error(err);
    return null;
  }
})();

function ensureEditor(): any {
  let el = document.querySelector('app-template-editor') as any;
  if (!el) {
    el = document.createElement('app-template-editor');
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Injects a Page object into the editor component.
 */
export async function loadPage(page: any): Promise<void> {
  await appPromise;
  const el = ensureEditor();
  el.page = page;
}

/**
 * Subscribes to page changes from the editor component.
 */
export async function onPageChange(callback: (updatedPage: any) => void): Promise<void> {
  await appPromise;
  const el = ensureEditor();
  el.addEventListener('page-change', (e: CustomEvent) => {
    callback(e.detail);
  });
}

let pdfServiceInstance: PdfGenerateService | null = null;

async function getPdfService(): Promise<PdfGenerateService> {
  const app = await appPromise; // ✅ Now this resolves to the app object
  if (!pdfServiceInstance) {
    pdfServiceInstance = app.injector.get(PdfGenerateService);
  }
  return pdfServiceInstance;
}

/**
 * Generate base64 PDF from a page and token list.
 */
export async function generatePdfBase64(page: any, tokens: any[]): Promise<string> {
  const service = await getPdfService();
  const result = await service.generatePdfBase64(page, tokens);
  return result.base64;
}

/**
 * Generate base64 PDF from a page and JSON token string.
 */
export async function generatePdfBase64FromJson(page: any, json: string): Promise<string> {
  const service = await getPdfService();
  const result = await service.generatePdfBase64FromJson(page, json);
  return result.base64;
}

// ✅ Expose to global scope for browser usage
(window as any).loadPage = loadPage;
(window as any).onPageChange = onPageChange;
(window as any).generatePdfBase64 = generatePdfBase64;
(window as any).generatePdfBase64FromJson = generatePdfBase64FromJson;
