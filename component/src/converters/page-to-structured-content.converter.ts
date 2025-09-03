import {
  Page,
  PageAttrs
} from '../models/page';
import { Injectable } from '@angular/core';
import type { Content, ContentColumns, TDocumentDefinitions } from 'pdfmake/interfaces';
import { StructuredContentToPdfmakeConverter } from './structured-content-to-pdfmake.converter';
import { GridToStructuredContentConverter } from './grid-to-structured-content.converter';
import {Converter} from "./converter";
@Injectable({ providedIn: 'root' })
export class PageToStructuredContentConverter implements Converter<Page, TDocumentDefinitions> {
  constructor(
    private structuredContentToPdfmakeService: StructuredContentToPdfmakeConverter,
    private gridToPdfmakeConverter: GridToStructuredContentConverter
  ) {}



  public convert(page: Page): TDocumentDefinitions {
    const contentContainer = this.gridToPdfmakeConverter.convert(page.content.rows);
    const headerContainer  = this.gridToPdfmakeConverter.convert(page.header.rows);
    const footerContainer  = this.gridToPdfmakeConverter.convert(page.footer.rows);

    const headerContent = this.structuredContentToPdfmakeService.convert(headerContainer);
    const bodyContent   = this.structuredContentToPdfmakeService.convert(contentContainer);
    const footerContent = this.structuredContentToPdfmakeService.convert(footerContainer);

    const p: PageAttrs = page.pageAttrs || {};

    const bodyLeft   = p.marginLeft   ?? 0;
    const bodyTop    = p.marginTop    ?? 0;
    const bodyRight  = p.marginRight  ?? 0;
    const bodyBottom = p.marginBottom ?? 0;

    const headerBase = (p.headerHeight ?? (headerContent?.length ? 60 : 0));
    const footerBase = (p.footerHeight ?? (footerContent?.length ? 60 : 0));

    const headerBand = headerBase + (p.headerMarginTop ?? 0) + (p.headerMarginBottom ?? 0);
    const footerBand = footerBase + (p.footerMarginTop ?? 0) + (p.footerMarginBottom ?? 0);

    return {
      content: [
        {
          stack: bodyContent,
          margin: [bodyLeft, bodyTop, bodyRight, bodyBottom]
        }
      ],
      header: () => this.buildHeaderPayload(headerContent, p),
      footer: (currentPage, pageCount) => {
        const payload = this.buildFooterPayload(footerContent, p);
        // inject real values
        (payload.columns[1] as any).text = `Page ${currentPage} of ${pageCount}`;
        return payload;
      },
      background: p.backgroundColor ? () => this.buildBackgroundPayload(p)! : undefined,
      defaultStyle: { font: p.defaultFont },
      pageSize: 'A4',
      pageMargins: [0, headerBand, 0, footerBand]
    };
  }

  /**
   * Export version: builds a JS string payload with inline functions.
   */
  public convertToStringPayload(page: Page): string {
    const contentContainer = this.gridToPdfmakeConverter.convert(page.content.rows);
    const headerContainer  = this.gridToPdfmakeConverter.convert(page.header.rows);
    const footerContainer  = this.gridToPdfmakeConverter.convert(page.footer.rows);

    const headerContent = this.structuredContentToPdfmakeService.convert(headerContainer);
    const bodyContent   = this.structuredContentToPdfmakeService.convert(contentContainer);
    const footerContent = this.structuredContentToPdfmakeService.convert(footerContainer);

    const p: PageAttrs = page.pageAttrs || {};

    const bodyLeft   = p.marginLeft   ?? 0;
    const bodyTop    = p.marginTop    ?? 0;
    const bodyRight  = p.marginRight  ?? 0;
    const bodyBottom = p.marginBottom ?? 0;

    const headerBase = (p.headerHeight ?? (headerContent?.length ? 60 : 0));
    const footerBase = (p.footerHeight ?? (footerContent?.length ? 60 : 0));

    const headerBand = headerBase + (p.headerMarginTop ?? 0) + (p.headerMarginBottom ?? 0);
    const footerBand = footerBase + (p.footerMarginTop ?? 0) + (p.footerMarginBottom ?? 0);

    const headerPayload = this.buildHeaderPayload(headerContent, p);
    const footerPayload = this.buildFooterPayload(footerContent, p);
    const backgroundPayload = this.buildBackgroundPayload(p);

    // JSON-safe stringify
    const stringify = (obj: any) => JSON.stringify(obj, null, 2);

    // Build string
    const js = `
  {
  "content": [
    {
      "stack": ${stringify(bodyContent)},
      "margin": [${bodyLeft}, ${bodyTop}, ${bodyRight}, ${bodyBottom}]
    }
  ],
  "header": function(currentPage, pageCount) {
    return ${stringify(headerPayload)};
  },
  "footer": function(currentPage, pageCount) {
    var payload = ${stringify(footerPayload)};
    payload.columns[1].text = "Page " + currentPage + " of " + pageCount;
    return payload;
  },
  "background": ${backgroundPayload ? `function() { return ${stringify(backgroundPayload)}; }` : "undefined"},
  "defaultStyle": ${stringify({ font: p.defaultFont })},
  "pageSize": "A4",
  "pageMargins": [0, ${headerBand}, 0, ${footerBand}]
}`;

    console.log(js);
    return js;
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
        { width: '80%', stack: footerContent, margin: [0, 0, 0, 0] },
        {
          width: '20%',
          text: `Page {{currentPage}} of {{pageCount}}`, // placeholder for string payload
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

}

