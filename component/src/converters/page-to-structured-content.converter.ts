import {
  Page,
  PageAttrs
} from '../models/page';
import { Injectable } from '@angular/core';
import type { Content, ContentColumns, TDocumentDefinitions } from 'pdfmake/interfaces';
import { StructuredContentToPdfmakeConverter } from './structured-content-to-pdfmake.converter';
import { GridToStructuredContentConverter } from './grid-to-structured-content.converter';
import { Converter } from "./converter";

@Injectable({ providedIn: 'root' })
export class PageToStructuredContentConverter implements Converter<Page, TDocumentDefinitions> {
  constructor(
    private structuredContentToPdfmakeService: StructuredContentToPdfmakeConverter,
    private gridToPdfmakeConverter: GridToStructuredContentConverter
  ) {}

  public convert(page: Page): TDocumentDefinitions {
    const contentContainer = this.gridToPdfmakeConverter.convert(page.content.rows, page.pageAttrs);
    const headerContainer  = this.gridToPdfmakeConverter.convert(page.header.rows, page.pageAttrs);
    const footerContainer  = this.gridToPdfmakeConverter.convert(page.footer.rows, page.pageAttrs);

    const headerContent = this.structuredContentToPdfmakeService.convert(headerContainer, page.pageAttrs);
    const bodyContent   = this.structuredContentToPdfmakeService.convert(contentContainer, page.pageAttrs);
    const footerContent = this.structuredContentToPdfmakeService.convert(footerContainer, page.pageAttrs);

    const p: PageAttrs = page.pageAttrs || {};

    const headerBase = (p.headerHeight ?? (headerContent?.length ? 60 : 0));
    const footerBase = (p.footerHeight ?? (footerContent?.length ? 60 : 0));

    const headerBand = headerBase + (p.headerMarginTop ?? 0) + (p.headerMarginBottom ?? 0);
    const footerBand = footerBase + (p.footerMarginTop ?? 0) + (p.footerMarginBottom ?? 0);

    return {
      content: [
        {
          stack: bodyContent,
          margin: [0, 0, 0, 0]
        }
      ],
      header: () => this.buildHeaderPayload(headerContent, p),
      footer: (currentPage, pageCount) => {
        let payload = this.buildFooterPayload(footerContent, p);
        payload = this.injectPageTokens(payload, currentPage, pageCount);
        return payload;
      },
      background: p.backgroundColor ? () => this.buildBackgroundPayload(p)! : undefined,
      defaultStyle: { font: p.defaultFont },
      pageSize: 'A4',
      pageMargins: [p.marginLeft, headerBand, p.marginRight, footerBand]
    };
  }

  public convertToStringPayload(page: Page): string {
    const contentContainer = this.gridToPdfmakeConverter.convert(page.content.rows, page.pageAttrs);
    const headerContainer  = this.gridToPdfmakeConverter.convert(page.header.rows, page.pageAttrs);
    const footerContainer  = this.gridToPdfmakeConverter.convert(page.footer.rows, page.pageAttrs);

    const headerContent = this.structuredContentToPdfmakeService.convert(headerContainer, page.pageAttrs);
    const bodyContent   = this.structuredContentToPdfmakeService.convert(contentContainer, page.pageAttrs);
    const footerContent = this.structuredContentToPdfmakeService.convert(footerContainer, page.pageAttrs);

    const p: PageAttrs = page.pageAttrs || {};

    const headerBase = (p.headerHeight ?? (headerContent?.length ? 60 : 0));
    const footerBase = (p.footerHeight ?? (footerContent?.length ? 60 : 0));

    const headerBand = headerBase + (p.headerMarginTop ?? 0) + (p.headerMarginBottom ?? 0);
    const footerBand = footerBase + (p.footerMarginTop ?? 0) + (p.footerMarginBottom ?? 0);

    const headerPayload = this.buildHeaderPayload(headerContent, p);
    const footerPayload = this.buildFooterPayload(footerContent, p);
    const backgroundPayload = this.buildBackgroundPayload(p);

    const stringify = (obj: any) => JSON.stringify(obj, null, 2);

    const js = `
  {
  "content": [
    {
      "stack": ${this.formatBody(bodyContent)},
      "margin": [0, 0, 0, 0]
    }
  ],
  "header": function(currentPage, pageCount) {
    return ${stringify(headerPayload)};
  },
  "footer": function(currentPage, pageCount) {
    var payload = ${stringify(footerPayload)};
    payload = (function inject(content) {
      if (Array.isArray(content)) {
        return content.map(c => inject(c));
      } else if (typeof content === 'object' && content !== null) {
        var cloned = Object.assign({}, content);
        if (typeof cloned.text === 'string') {
          cloned.text = cloned.text
            .replace(/\\{\\{currentPage\\}\\}/g, String(currentPage))
            .replace(/\\{\\{totalPages\\}\\}/g, String(pageCount));
        }
        if (Array.isArray(cloned.text)) {
          cloned.text = cloned.text.map(function (t) {
            return (typeof t === 'string')
              ? t.replace(/\\{\\{currentPage\\}\\}/g, String(currentPage))
                   .replace(/\\{\\{totalPages\\}\\}/g, String(pageCount))
              : inject(t);
          });
        }
        Object.keys(cloned).forEach(function (k) {
          cloned[k] = inject(cloned[k]);
        });
        return cloned;
      }
      return content;
    })(payload);
    return payload;
  },
  "background": ${backgroundPayload ? `function() { return ${stringify(backgroundPayload)}; }` : "undefined"},
  "defaultStyle": ${stringify({ font: p.defaultFont })},
  "pageSize": "A4",
  "pageMargins": [${p.marginLeft}, ${headerBand}, ${p.marginRight}, ${footerBand}]
}`;

    return js;
  }

  private formatBody(v: unknown, indent = 0): string {
    return JSON.stringify(v, null, 2)
      .split('\n')
      .map((l, i) => (i ? ' '.repeat(indent) + l : l))
      .join('\n');
  }

  private buildHeaderPayload(headerContent: Content[], p: PageAttrs): Content {
    const bodyLeft   = p.marginLeft   ?? 0;
    const bodyRight  = p.marginRight  ?? 0;
    const headerMarginLeft   = p.headerMarginLeft   ?? bodyLeft;
    const headerMarginRight  = p.headerMarginRight  ?? bodyRight;
    const headerMarginTop    = p.headerMarginTop    ?? 0;
    const headerMarginBottom = p.headerMarginBottom ?? 0;

    return {
      stack: headerContent,
      margin: [headerMarginLeft, headerMarginTop, headerMarginRight, headerMarginBottom]
    };
  }

  private buildFooterPayload(footerContent: Content[], p: PageAttrs): ContentColumns {
    const bodyLeft   = p.marginLeft   ?? 0;
    const bodyRight  = p.marginRight  ?? 0;
    const footerMarginLeft   = p.footerMarginLeft   ?? bodyLeft;
    const footerMarginRight  = p.footerMarginRight  ?? bodyRight;
    const footerMarginTop    = p.footerMarginTop    ?? 0;
    const footerMarginBottom = p.footerMarginBottom ?? 0;

    return {
      margin: [footerMarginLeft, footerMarginTop, footerMarginRight, footerMarginBottom],
      columns: [
        { width: '100%', stack: footerContent, margin: [0, 0, 0, 0] },
        {
          width: '0%',
          text: ``,
          alignment: 'right',
          fontSize: 9,
          margin: [0, 10, 0, 0]
        }
      ],
      columnGap: 10
    };
  }

  private buildBackgroundPayload(p: PageAttrs): Content | undefined {
    return p.backgroundColor
      ? {
        canvas: [
          { type: 'rect', x: 0, y: 0, w: 595.28, h: 841.89, color: p.backgroundColor }
        ]
      }
      : undefined;
  }

  private injectPageTokens(content: any, currentPage: number, pageCount: number): any {
    if (Array.isArray(content)) {
      return content.map(c => this.injectPageTokens(c, currentPage, pageCount));
    } else if (typeof content === 'object' && content !== null) {
      const cloned: any = { ...content };

      if (typeof cloned.text === 'string') {
        cloned.text = cloned.text
          .replace(/\{\{currentPage\}\}/g, String(currentPage))
          .replace(/\{\{totalPages\}\}/g, String(pageCount));
      }

      // pdfmake also allows text arrays
      if (Array.isArray(cloned.text)) {
        cloned.text = cloned.text.map((t: any) =>
          typeof t === 'string'
            ? t.replace(/\{\{currentPage\}\}/g, String(currentPage))
              .replace(/\{\{totalPages\}\}/g, String(pageCount))
            : this.injectPageTokens(t, currentPage, pageCount)
        );
      }

      for (const key of Object.keys(cloned)) {
        cloned[key] = this.injectPageTokens(cloned[key], currentPage, pageCount);
      }

      return cloned;
    }
    return content;
  }

}
