import { Injectable } from '@angular/core';
import { Page } from '../models/interfaces';
import { PageToHtmlService, PageToHtmlOptions } from './page-to-html.service';
import { asBlob } from 'html-docx-js-typescript';

export interface PageToDocxOptions {
  filename?: string;
  html?: Omit<PageToHtmlOptions, 'includeBaseStyles'> & {
    includeBaseStyles?: boolean;
    /** Render rows as <table> for Word fidelity */
    forDocx?: boolean;
  };
  /** TWIPs (1/1440"): 720 = 0.5" */
  marginsTwip?: { top?: number; right?: number; bottom?: number; left?: number };
  orientation?: 'portrait' | 'landscape';
  /** Optional explicit page size (TWIPs). Example A4: { width: 11906, height: 16838 } */
  pageSizeTwip?: { width: number; height: number };
}

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

@Injectable({ providedIn: 'root' })
export class PageToDocxService {
  constructor(private pageToHtml: PageToHtmlService) {}

  /** Convert Page → Blob (.docx) — always returns a real Blob in the browser */
  async toBlob(page: Page, options?: PageToDocxOptions): Promise<Blob> {
    // Ask PageToHtmlService for DOCX-friendly HTML (table layout)
    const html = this.pageToHtml.toHtmlDocument(page, {
      includeBaseStyles: options?.html?.includeBaseStyles ?? true,
      rootClass: options?.html?.rootClass ?? 'docx-export',
      page: options?.html?.page,
      // Pass flag if your PageToHtmlService supports it (as in our earlier version)
      forDocx: options?.html?.forDocx ?? true,
    } as PageToHtmlOptions & { forDocx?: boolean });

    const res = await asBlob(html, {
      orientation: options?.orientation ?? 'portrait',
      margins: {
        top: options?.marginsTwip?.top ?? 720,
        right: options?.marginsTwip?.right ?? 720,
        bottom: options?.marginsTwip?.bottom ?? 720,
        left: options?.marginsTwip?.left ?? 720,
      }
    });

    // Normalize: html-docx-js-typescript may return Buffer in some environments.
    return this.normalizeToBlob(res);
  }

  /** Convert Page → ArrayBuffer (.docx content) */
  async toArrayBuffer(page: Page, options?: PageToDocxOptions): Promise<ArrayBuffer> {
    const blob = await this.toBlob(page, options);
    return blob.arrayBuffer();
  }

  /** Trigger a download of the .docx file */
  async download(page: Page, options?: PageToDocxOptions): Promise<void> {
    const blob = await this.toBlob(page, options);
    const name = options?.filename ?? this.deriveFilename(page);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  // ----------------- helpers -----------------

  private deriveFilename(page: Page): string {
    const base = page?.content?.name || page?.header?.name || 'page';
    return `${base.replace(/[^\w\-]+/g, '_')}.docx`;
  }

  /** Convert any Buffer/TypedArray/ArrayBuffer-ish to Blob without referencing Node types */
  private normalizeToBlob(x: unknown): Blob {
    if (typeof Blob !== 'undefined' && x instanceof Blob) return x;

    // ArrayBuffer
    if (typeof ArrayBuffer !== 'undefined' && x instanceof ArrayBuffer) {
      return new Blob([x], { type: DOCX_MIME });
    }

    // TypedArray or Node Buffer-like: has .buffer and .byteLength
    if (x && typeof x === 'object' && 'buffer' in (x as any) && 'byteLength' in (x as any)) {
      const buf: any = x as any;
      // If it has byteOffset, use it; else assume 0
      const byteOffset = typeof buf.byteOffset === 'number' ? buf.byteOffset : 0;
      const u8 = new Uint8Array(buf.buffer as ArrayBuffer, byteOffset, buf.byteLength as number);
      return new Blob([u8], { type: DOCX_MIME });
    }

    // Fallback (string, etc.)
    return new Blob([x as any], { type: DOCX_MIME });
  }
}
