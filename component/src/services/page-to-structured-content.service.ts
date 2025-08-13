import {
  HtmlBlockContainer,
  HtmlBlock,
  HtmlGridBlock,
  Row,
  Cell,
  CellAttrs, Page, PageAttrs
} from '../models/interfaces';
import {Injectable} from "@angular/core";
import {TokenAttribute} from "../models/TokenAttribute";
import type {Content, ContentColumns, TDocumentDefinitions} from "pdfmake/interfaces";
import {StructuredContentToPdfmakeService} from "./structured-content-to-pdfmake.service";
import {GridToStructuredContentService} from "./grid-to-structured-content.service";
import {TokenReplacerService} from "./token-replacer.service";

/**
 * PageToStructuredContentService
 *
 * Converts a full `Page` object (header, content, footer) into a complete `TDocumentDefinitions`
 * structure suitable for rendering by pdfMake.
 *
 *   Token Injection: Replaces tokens throughout the entire layout, including headers/footers.
 *   Structured Conversion: Uses grid + content services to map `Row[]` into `HtmlBlockContainer`,
 *    which is then converted into pdfMake `Content`.
 *   Layout Preservation: Includes page-level attributes such as background color, margins,
 *    default font, and page size.
 *   Header/Footer Support: Applies token replacement and formatting to all layout sections,
 *    ensuring proper rendering across pages.
 *
 * This is the final transformation step before PDF rendering.
 */
@Injectable({ providedIn: 'root' })
export class PageToStructuredContentService {
    constructor(private structuredContentToPdfmakeService: StructuredContentToPdfmakeService,
                private gridToPdfmakeConverter: GridToStructuredContentService,
                private tokenReplacerService: TokenReplacerService,) {}


  public convert(page: Page, tokenAttributeList?: TokenAttribute[]): TDocumentDefinitions {

    page.header.rows = this.tokenReplacerService.replaceTokensInRow(page.header.rows, tokenAttributeList);
    page.footer.rows = this.tokenReplacerService.replaceTokensInRow(page.footer.rows, tokenAttributeList);
    page.content.rows = this.tokenReplacerService.replaceTokensInRow(page.content.rows, tokenAttributeList);

    let htmlBlockContainerContent: HtmlBlockContainer = this.gridToPdfmakeConverter.convert(page.content.rows);
    let htmlBlockContainerHeader: HtmlBlockContainer = this.gridToPdfmakeConverter.convert(page.header.rows);
    let htmlBlockContainerFooter: HtmlBlockContainer = this.gridToPdfmakeConverter.convert(page.footer.rows);

    const headerContent: Content[] = this.structuredContentToPdfmakeService.convert(htmlBlockContainerHeader);
    const bodyContent: Content[] = this.structuredContentToPdfmakeService.convert(htmlBlockContainerContent);
    const footerContent: Content[] = this.structuredContentToPdfmakeService.convert(htmlBlockContainerFooter);

    debugger;
    const gridAttrs: PageAttrs = page.pageAttrs || {};

    return {
      content: [
        {
          stack: bodyContent,
          margin: [
            gridAttrs.marginLeft ?? 0,
            gridAttrs.marginTop ?? 0,
            gridAttrs.marginRight ?? 0,
            gridAttrs.marginBottom ?? 0
          ]
        }
      ],
      header: (): Content => {
        return {
          stack: headerContent,
          margin: [30,20,30,gridAttrs.headerMargin] // ✅ Left, Top, Right, Bottom
        };
      },
      footer: (currentPage: number, pageCount: number): ContentColumns => {
        return {
          columns: [
            {
              stack: footerContent,
              margin: [gridAttrs.footerMargin, 0, 0, 0] // ✅ Left, Top, Right, Bottom

            },
            {
              text: `Page ${currentPage} of ${pageCount}`,
              alignment: 'right',
              fontSize: 9,
              margin: [0, 0, gridAttrs.footerMargin, 0] // ✅ Left, Top, Right, Bottom
            }
          ]
        };
      },
      background: gridAttrs.backgroundColor
        ? () => ({
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 595.28, // A4 width
              h: 841.89, // A4 height
              color: gridAttrs.backgroundColor
            }
          ]
        })
        : undefined,
      defaultStyle: {
        font: page.pageAttrs.defaultFont
      },
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],  // top & bottom margins increased

    };
  }

}
