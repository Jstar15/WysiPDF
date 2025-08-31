import {
  HtmlBlockContainer,
  Page,
  PageAttrs
} from '../../models/interfaces';
import { Injectable } from '@angular/core';
import type { Content, ContentColumns, TDocumentDefinitions } from 'pdfmake/interfaces';
import { StructuredContentToPdfmakeService } from './structured-content-to-pdfmake.service';
import { GridToStructuredContentService } from './grid-to-structured-content.service';

@Injectable({ providedIn: 'root' })
export class PageToStructuredContentService {
  constructor(
    private structuredContentToPdfmakeService: StructuredContentToPdfmakeService,
    private gridToPdfmakeConverter: GridToStructuredContentService
  ) {}

  public convert(page: Page): TDocumentDefinitions {
    const contentContainer: HtmlBlockContainer = this.gridToPdfmakeConverter.convert(page.content.rows);
    const headerContainer:  HtmlBlockContainer = this.gridToPdfmakeConverter.convert(page.header.rows);
    const footerContainer:  HtmlBlockContainer = this.gridToPdfmakeConverter.convert(page.footer.rows);

    const headerContent: Content[] = this.structuredContentToPdfmakeService.convert(headerContainer);
    const bodyContent:   Content[] = this.structuredContentToPdfmakeService.convert(contentContainer);
    const footerContent: Content[] = this.structuredContentToPdfmakeService.convert(footerContainer);

    const p: PageAttrs = page.pageAttrs || {};

    // Body/content margins (apply ONLY to content node)
    const bodyLeft   = p.marginLeft   ?? 0;
    const bodyTop    = p.marginTop    ?? 0;
    const bodyRight  = p.marginRight  ?? 0;
    const bodyBottom = p.marginBottom ?? 0;

    // Choose a default band height if content exists but explicit height is not set
    const headerBase = (p.headerHeight ?? (headerContent?.length ? 60 : 0));
    const footerBase = (p.footerHeight ?? (footerContent?.length ? 60 : 0));

    // Header/Footer reserved vertical bands at the PAGE level (no LR margins here)
    const headerBand =
      headerBase + (p.headerMarginTop ?? 0) + (p.headerMarginBottom ?? 0);
    const footerBand =
      footerBase + (p.footerMarginTop ?? 0) + (p.footerMarginBottom ?? 0);

    // Header/Footer internal padding; default LR to body LR for alignment
    const headerMarginLeft   = p.headerMarginLeft   ?? bodyLeft;
    const headerMarginRight  = p.headerMarginRight  ?? bodyRight;
    const headerMarginTop    = p.headerMarginTop    ?? 0;
    const headerMarginBottom = p.headerMarginBottom ?? 0;

    const footerMarginLeft   = p.footerMarginLeft   ?? bodyLeft;
    const footerMarginRight  = p.footerMarginRight  ?? bodyRight;
    const footerMarginTop    = p.footerMarginTop    ?? 0;
    const footerMarginBottom = p.footerMarginBottom ?? 0;

    return {
      content: [
        {
          stack: bodyContent,
          margin: [bodyLeft, bodyTop, bodyRight, bodyBottom]
        }
      ],

      header: (): Content => ({
        stack: headerContent,
        margin: [headerMarginLeft, headerMarginTop, headerMarginRight, headerMarginBottom]
      }),

      footer: (currentPage: number, pageCount: number): ContentColumns => ({
        margin: [footerMarginLeft, footerMarginTop, footerMarginRight, footerMarginBottom],
        columns: [
          { width: '80%', stack: footerContent, margin: [0, 0, 0, 0] },
          {
            width: '20%',
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: 'right',
            fontSize: 9,
            margin: [0, 10, 0, 0]
          }
        ],
        columnGap: 10
      }),

      background: p.backgroundColor
        ? () => ({
          canvas: [
            { type: 'rect', x: 0, y: 0, w: 595.28, h: 841.89, color: p.backgroundColor } // A4
          ]
        })
        : undefined,

      defaultStyle: { font: p.defaultFont },
      pageSize: 'A4',

      // IMPORTANT: vertical bands only; no LR margins at page level
      pageMargins: [0, headerBand, 0, footerBand]
    };
  }
}
