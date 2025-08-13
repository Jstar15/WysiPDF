import { Injectable } from '@angular/core';

import 'pdfmake/build/vfs_fonts';
import type {
    TDocumentDefinitions,
    Content,
    ContentColumns,
} from 'pdfmake/interfaces';
import { HtmlBlockContainer, Page, PageAttrs, Row} from '../models/interfaces';

import {TokenAttribute} from "../models/TokenAttribute";
import {PartialContentExpanderService} from "./partial-content-expander.service";
import {HtmlToStructuredContentService} from "./html-to-structured-content.service";
import {PageToStructuredContentService} from "./page-to-structured-content.service";
import {PdfMakeService} from "./pdf-make.service";
import {JsonTokenParserService} from "./json-token-parser.service";



@Injectable({ providedIn: 'root' })
export class PdfGenerateService {
    constructor(
        private structuredContentToPdfmakeService: PageToStructuredContentService,
        private partialContentExpander: PartialContentExpanderService,
        private htmlToStructuredContentService: HtmlToStructuredContentService,
        private pdfMakeService : PdfMakeService,
        private jsonTokenParserService: JsonTokenParserService

    ) {}

    public async generatePdfBase64(page: Page, tokenAttributeList: TokenAttribute[]): Promise<PdfGenerationResult> {
        page = this.deepCopy(page);
        page = this.htmlToStructuredContentService.updatePageHtmlToObject(page);
        page = this.partialContentExpander.insertPartialContent(page, tokenAttributeList);
        page = this.updateRowColorToMatchPageBackgroundColor(page);
        page = this.cleanHeaderFooter(page);

        const docDefinition: TDocumentDefinitions =
            this.structuredContentToPdfmakeService.convert(page, tokenAttributeList);

        // Correct usage: get base64 via service
        const base64 = await this.pdfMakeService.getBase64(docDefinition);

        return {
            base64,
            page,
            docDefinition,
        };
    }

  public async generatePdfBase64FromJson(page: Page, json: string): Promise<PdfGenerationResult> {
    const tokenAttributeList: TokenAttribute[] = this.jsonTokenParserService.parse(json);
    return this.generatePdfBase64(page, tokenAttributeList);
  }

    private deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    private cleanHeaderFooter(page: Page): Page {
        const stripHeights = (rows: Row[] | undefined) => {
            if (!rows) return;
            for (const row of rows) {
                // remove explicit height on the row
                if ('height' in row) {
                    delete (row as any).height;
                }
            }
        };

        stripHeights(page.header?.rows);
        stripHeights(page.footer?.rows);
        return page;
    }

    private updateRowColorToMatchPageBackgroundColor(page: Page): Page{
        for(let row of page.header.rows){
            row.backgroundColor = page.pageAttrs.backgroundColor;
        }
        for(let row of page.content.rows){
            row.backgroundColor = page.pageAttrs.backgroundColor;
        }
        for(let row of page.footer.rows){
            row.backgroundColor = page.pageAttrs.backgroundColor;
        }
        return page;
    }
}

export interface PdfGenerationResult {
    base64: string;
    docDefinition: TDocumentDefinitions;
    page: Page;
}
