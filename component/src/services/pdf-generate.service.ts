import { Injectable } from '@angular/core';
import 'pdfmake/build/vfs_fonts';
import type {
    TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { Page } from '../models/interfaces';

import {TokenAttribute} from "../models/TokenAttribute";
import {PageToStructuredContentService} from "./converters/page-to-structured-content.service";
import {PdfMakeService} from "./external/pdf-make.service";
import {JsonTokenParserService} from "../utils/json-token-parser.service";
import {PageToPageService} from "./converters/page-to-page.service";

@Injectable({ providedIn: 'root' })
export class PdfGenerateService {
    constructor(
        private structuredContentToPdfmakeService: PageToStructuredContentService,
        private pageService: PageToPageService,
        private pdfMakeService : PdfMakeService,
        private jsonTokenParserService: JsonTokenParserService

    ) {}

    public async generatePdfBase64(page: Page, tokenAttributeList: TokenAttribute[]): Promise<PdfGenerationResult> {
        page = this.pageService.processPage(page, tokenAttributeList);

        const docDefinition: TDocumentDefinitions = this.structuredContentToPdfmakeService.convert(page);

        // Correct usage: get base64 via service
        const base64: string = await this.pdfMakeService.getBase64(docDefinition);

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
}

export interface PdfGenerationResult {
    base64: string;
    docDefinition: TDocumentDefinitions;
    page: Page;
}
