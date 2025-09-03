import { Injectable } from '@angular/core';
import 'pdfmake/build/vfs_fonts';
import type {
    TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { Page } from '../../models/page';

import {TokenAttribute} from "../../models/token-attribute";
import {PageToStructuredContentConverter} from "../../converters/page-to-structured-content.converter";
import {PdfMakeService} from "../external/pdf-make.service";
import {JsonTokenParserUtility} from "../../utils/json-token-parser.utility";
import {PageToPageConverter} from "../../converters/page-to-page.converter";

@Injectable({ providedIn: 'root' })
export class PdfGenerateService {
    constructor(
        private structuredContentToPdfmakeService: PageToStructuredContentConverter,
        private pageService: PageToPageConverter,
        private pdfMakeService : PdfMakeService,
        private jsonTokenParserService: JsonTokenParserUtility

    ) {}

    public async generatePdfBase64(page: Page, tokenAttributeList: TokenAttribute[]): Promise<PdfGenerationResult> {
        page = this.pageService.convert(page, tokenAttributeList);

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

  public convertToStringPayload(page: Page):string{
      return this.structuredContentToPdfmakeService.convertToStringPayload(page);
  }


}

export interface PdfGenerationResult {
    base64: string;
    docDefinition: TDocumentDefinitions;
    page: Page;
}
