import {
  Page,
  PageAttrs
} from '../models/page';
import { Injectable } from '@angular/core';
import type { Content, ContentColumns, TDocumentDefinitions } from 'pdfmake/interfaces';
import { StructuredContentToPdfmakeConverter } from './structured-content-to-pdfmake.converter';
import { GridToStructuredContentConverter } from './grid-to-structured-content.converter';
import { Converter } from "./converter";

@Injectable()
export class PageToStructuredContentConverter implements Converter<Page, TDocumentDefinitions> {
  constructor(
    private structuredContentToPdfmakeService: StructuredContentToPdfmakeConverter,
    private gridToPdfmakeConverter: GridToStructuredContentConverter
  ) {}

  public convert(page: Page): TDocumentDefinitions {
    const contentContainer = this.gridToPdfmakeConverter.convert(page.content.rows, page.pageAttrs);
    const headerContainer  = this.gridToPdfmakeConverter.convert(page.header.rows, page.pageAttrs);
    const header2Container = this.gridToPdfmakeConverter.convert(page.header2.rows, page.pageAttrs);
    const footerContainer  = this.gridToPdfmakeConverter.convert(page.footer.rows, page.pageAttrs);

    const headerContent = this.structuredContentToPdfmakeService.convert(headerContainer, page.pageAttrs);
    const header2Content = this.structuredContentToPdfmakeService.convert(header2Container, page.pageAttrs);
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
      header: (currentPage: number) => {
        const headerToUse = page.pageAttrs.headerForPage2Up && currentPage >= 2 && header2Content?.length
          ? header2Content
          : headerContent;
        return this.buildHeaderPayload(headerToUse, p);
      },
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
    const header2Container = this.gridToPdfmakeConverter.convert(page.header2?.rows || [], page.pageAttrs); // <<< NEW
    const footerContainer  = this.gridToPdfmakeConverter.convert(page.footer.rows, page.pageAttrs);

    const headerContent  = this.structuredContentToPdfmakeService.convert(headerContainer, page.pageAttrs);
    const header2Content = this.structuredContentToPdfmakeService.convert(header2Container, page.pageAttrs); // <<< NEW
    const bodyContent    = this.structuredContentToPdfmakeService.convert(contentContainer, page.pageAttrs);
    const footerContent  = this.structuredContentToPdfmakeService.convert(footerContainer, page.pageAttrs);



    //TODO messy here need clean up
    const body = this.updateLayoutFunctionForAllCells(bodyContent);

    const p: PageAttrs = page.pageAttrs || {};

    const headerBase = (p.headerHeight ?? (headerContent?.length ? 60 : 0));
    const footerBase = (p.footerHeight ?? (footerContent?.length ? 60 : 0));

    const headerBand = headerBase + (p.headerMarginTop ?? 0) + (p.headerMarginBottom ?? 0);
    const footerBand = footerBase + (p.footerMarginTop ?? 0) + (p.footerMarginBottom ?? 0);

    const headerPayload = this.buildHeaderPayload(headerContent, p);
    const header2Payload = this.buildHeaderPayload(header2Content, p); // <<< NEW
    const footerPayload = this.buildFooterPayload(footerContent, p);
    const backgroundPayload = this.buildBackgroundPayload(p);

    const stringify = (obj: any) => JSON.stringify(obj, null, 2);

    let js = `
{
  "content": [
    {
      "stack": ${this.formatBody(body.contents)},
      "margin": [0, 0, 0, 0]
    }
  ],
  "header": function(currentPage, pageCount) {
    var headerToUse = (${p.headerForPage2Up} && currentPage >= 2 && ${header2Content?.length ? 'true' : 'false'})
      ? ${stringify(header2Payload)}
      : ${stringify(headerPayload)};
    return headerToUse;
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


    Object.entries(body.layouts).forEach(([placeholder, layoutStr]) => {
      js = js.replace(`"${placeholder}"`, layoutStr);
    });

    return js;
  }


  //Hacky workaround
  //This injects the layout fucntion into all content ensuring the pdfmake output doesnt break styling
  updateLayoutFunctionForAllCells(contents: Content[]): { contents: Content[]; layouts: Record<string, string> } {
    const layouts: Record<string, string> = {};
    let layoutCounter = 0;

    for (const content of contents) {
      const table = (content as any).table;
      if (!table) continue;

      // Generate a unique placeholder for this table
      const placeholder = `__LAYOUT_FUNC_${layoutCounter}__`;

      // The layout function as a string
      const layoutStr = `{
      hLineWidth: (i, node) => {
        const rowAbove = node.table.body[i - 1] || [];
        const row = node.table.body[i] || [];
        let max = 0;
        const len = Math.max(row.length, rowAbove.length);
        for (let c = 0; c < len; c++) {
          const top = row[c]?.__attrs?.borderTop ?? 0;
          const bottom = rowAbove[c]?.__attrs?.borderBottom ?? 0;
          max = Math.max(max, top, bottom);
        }
        return max;
      },
      vLineWidth: (i, node) => {
        let max = 0;
        for (const row of node.table.body) {
          const left = row[i]?.__attrs?.borderLeft ?? 0;
          const right = row[i - 1]?.__attrs?.borderRight ?? 0;
          max = Math.max(max, left, right);
        }
        return max;
      },
      hLineColor: (i, node) => {
        const row = node.table.body[i];
        const rowAbove = node.table.body[i - 1];
        let color = '#000';
        for (let c = 0; c < (row?.length ?? 0); c++) {
          const thisCell = row[c];
          const aboveCell = rowAbove?.[c];
          if (thisCell?.__attrs?.borderTop > 0) color = thisCell.__attrs.borderColor;
          else if (aboveCell?.__attrs?.borderBottom > 0) color = aboveCell.__attrs.borderColor;
        }
        return color;
      },
      vLineColor: (i, node) => {
        let color = '#000';
        for (const row of node.table.body) {
          const thisCell = row[i];
          const prevCell = row[i - 1];
          if (thisCell?.__attrs?.borderLeft > 0) color = thisCell.__attrs.borderColor;
          else if (prevCell?.__attrs?.borderRight > 0) color = prevCell.__attrs.borderColor;
        }
        return color;
      },
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0
    }`;

      // Store the layout string keyed by the placeholder
      layouts[placeholder] = layoutStr;

      // Replace the table layout with the placeholder
      (content as any).layout = placeholder;

      layoutCounter++;
    }

    return { contents, layouts };
  }



  private formatBody(v: unknown, indent = 0): string {
    const a: string = JSON.stringify(v, null, 2);
    const clean: string = this.cleanPdfMakeJson(a);
    return clean;
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

  private cleanPdfMakeJson(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(v => this.cleanPdfMakeJson(v));
    } else if (typeof obj === 'object' && obj !== null) {
      const cloned: any = {};

      for (const [key, value] of Object.entries(obj)) {
        // Skip internal / default keys
        if (
          value === null ||
          value === undefined ||
          (key === 'noWrap' && value === false) ||
          key === '__attrs' ||
          (key === 'width' && value === 'auto') ||
          (key === 'margin' && Array.isArray(value) && value.every(v => v === 0)) // optional
        ) {
          continue;
        }

        // Only copy border if it exists and is meaningful
        if (key === 'border') {
          if (!Array.isArray(value) || value.every(v => v === false)) continue;
        }

        cloned[key] = this.cleanPdfMakeJson(value);
      }

      // Ensure default margin
      if (!('margin' in obj)) {
        cloned.margin = [0, 0, 0, 0];
      }

      return cloned;
    }
    return obj;
  }



}
