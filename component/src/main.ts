import { importProvidersFrom } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import 'zone.js';
import { TemplateEditorComponent } from './areas/template-editor/template-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { PdfGenerateService } from './services/generators/pdf-generate.service';
import {  PageToHtmlOptions, HtmlGenerateService } from './services/generators/html-generate.service';
import { PageTokenValidator } from './services/page-token-validator.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import {PageToStructuredContentConverter} from "./converters/page-to-structured-content.converter";
import {PageToPageConverter} from "./converters/page-to-page.converter";
import {JsonTokenParserUtility} from "./utils/json-token-parser.utility";
import {TokenHtmlReplacerService} from "./utils/token-html-cell-replacer.utility";
import {HtmlToStructuredContentConverter} from "./converters/html-to-structured-content.converter";
import {PdfMakeService} from "./services/external/pdf-make.service";
import {StructuredContentToPdfmakeConverter} from "./converters/structured-content-to-pdfmake.converter";
import {GridToStructuredContentConverter} from "./converters/grid-to-structured-content.converter";
import {TokenReplacerUtility} from "./utils/token-replacer.utility";
import {DisplayLogicUtility} from "./utils/display-logic.utility";
import {BarcodeService} from "./services/external/barcode.service";
import {ChartGenerationService} from "./services/external/chart-generation.service";
import {BarcodeServiceNode} from "./services/external/barcode.node.service";

// ---- keep a single Angular app instance ----
let appPromise: Promise<any>;
appPromise = (async () => {
  try {
    const app = await createApplication({
      providers: [
        provideHttpClient(),
        importProvidersFrom(MatIconModule),
        provideAnimations(),

        // ← Add all your custom services here
        PdfGenerateService,
        HtmlGenerateService,
        PageTokenValidator,
        PageToStructuredContentConverter,
        PageToPageConverter,
        JsonTokenParserUtility,
        PdfMakeService,
        TokenHtmlReplacerService,
        HtmlToStructuredContentConverter,
        StructuredContentToPdfmakeConverter,
        GridToStructuredContentConverter,
        TokenReplacerUtility,
        DisplayLogicUtility,
        BarcodeService,
        ChartGenerationService,
        BarcodeServiceNode
      ],
    });

    if (typeof window !== 'undefined') {
      const templateEditor = createCustomElement(TemplateEditorComponent, {
        injector: app.injector,
      });
      if (!customElements.get('app-template-editor')) {
        customElements.define('app-template-editor', templateEditor);
      }
    }

    return app;
  } catch (err) {
    console.error(err);
    return null;
  }
})();

// ---- shared service singletons ----
let pdfServiceInstance: PdfGenerateService | null = null;
async function getPdfService(): Promise<PdfGenerateService> {
  const app = await appPromise;
  if (!pdfServiceInstance) pdfServiceInstance = app.injector.get(PdfGenerateService);
  return pdfServiceInstance!;
}

let pageToHtmlServiceInstance: HtmlGenerateService | null = null;
async function getHtmlService(): Promise<HtmlGenerateService> {
  const app = await appPromise;
  if (!pageToHtmlServiceInstance) pageToHtmlServiceInstance = app.injector.get(HtmlGenerateService);
  return pageToHtmlServiceInstance!;
}

let pageTokenValidatorInstance: PageTokenValidator | null = null;
async function getValidatorService(): Promise<PageTokenValidator> {
  const app = await appPromise;
  if (!pageTokenValidatorInstance) pageTokenValidatorInstance = app.injector.get(PageTokenValidator);
  return pageTokenValidatorInstance!;
}

// ---- lightweight instance wrapper ----
export interface WysiPDFOptions {
  mount?: HTMLElement | string;
}

export class WysiPDF {
  private container: HTMLElement | null = null;

  constructor(options: WysiPDFOptions = {}) {
    if (typeof window === 'undefined') return; // skip all front-end code in Node/SSR

    this.container =
      typeof options.mount === 'string'
        ? (document.querySelector(options.mount) as HTMLElement) || document.body
        : options.mount || document.body;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.ensureEditor());
    } else {
      this.ensureEditor();
    }
  }

  private async ensureEditor(): Promise<HTMLElement & { page?: any } | null> {
    if (typeof window === 'undefined' || !this.container) return null;

    await appPromise;

    let el = (this.container.querySelector('app-template-editor') ||
      document.querySelector('app-template-editor')) as (HTMLElement & { page?: any }) | null;

    if (!el) {
      el = document.createElement('app-template-editor') as HTMLElement & { page?: any };
      el.style.display = 'block';
      el.style.width = '100%';
      el.style.height = '100%';
      this.container.appendChild(el);
    }
    return el;
  }

  async loadPage(page: any): Promise<void> {
    const el = await this.ensureEditor();
    if (el) el.page = page;
  }

  async onPageChange(callback: (updatedPage: any) => void): Promise<void> {
    const el = await this.ensureEditor();
    if (!el) return;
    el.addEventListener('page-change', (e: Event) => {
      const ce = e as CustomEvent;
      callback(ce.detail);
    });
  }

  async generatePdfBase64(page: any, tokens: any[]): Promise<string> {
    const svc = await getPdfService();
    const result = await svc.generatePdfBase64(page, tokens);
    return result.base64;
  }

  async generatePdfBase64FromJson(page: any, json: string): Promise<string> {
    const svc = await getPdfService();
    const result = await svc.generatePdfBase64FromJson(page, json);
    return result.base64;
  }

  async generateHtml(page: any, tokens: any[], opts?: PageToHtmlOptions): Promise<string> {
    const svc = await getHtmlService();
    return (await svc.generateHtml(page, tokens, opts)).html;
  }

  async generateHtmlFromJson(page: any, json: string, opts?: PageToHtmlOptions): Promise<string> {
    const svc = await getHtmlService();
    return (await svc.generateHtmlFromJson(page, json, opts)).html;
  }

  async hasErrors(page: any, tokens: any[], mutateOriginal: boolean = false): Promise<string[]> {
    const svc = await getValidatorService();
    return svc.hasErrors(page, tokens, mutateOriginal);
  }

  async isValid(page: any, tokens: any[]): Promise<boolean> {
    return (await this.hasErrors(page, tokens)).length === 0;
  }
}

// ---- ONE-LINER: expose constructor for non-module HTML pages ----
declare global { interface Window { WysiPDF: typeof WysiPDF } }
if (typeof window !== 'undefined') { window.WysiPDF = WysiPDF; }

// allow default/ESM import usage
export default WysiPDF;
