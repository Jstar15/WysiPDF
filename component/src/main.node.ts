// src/main.node.ts

import { PdfGenerateService } from './services/generators/pdf-generate.service';
import { HtmlGenerateService } from './services/generators/html-generate.service';
import { PageTokenValidator } from './services/page-token-validator.service';
import { JsonTokenParserUtility } from './utils/json-token-parser.utility';
import { PdfMakeService } from './services/external/pdf-make.service';
import { PageToPageConverter } from './converters/page-to-page.converter';
import { PageToStructuredContentConverter } from './converters/page-to-structured-content.converter';
import { StructuredContentToPdfmakeConverter } from './converters/structured-content-to-pdfmake.converter';
import { GridToStructuredContentConverter } from './converters/grid-to-structured-content.converter';
import { HtmlToStructuredContentConverter } from './converters/html-to-structured-content.converter';
import { TokenReplacerUtility } from './utils/token-replacer.utility';
import { DisplayLogicUtility } from './utils/display-logic.utility';
import { TokenHtmlReplacerService } from './utils/token-html-cell-replacer.utility';
import { BarcodeServiceNode} from "./services/external/barcode.node.service";
import {ChartGenerationService} from "./services/external/chart-generation.service";
import {BarcodeService} from "./services/external/barcode.service";

// --- manually build dependency tree ---

const jsonParser = new JsonTokenParserUtility();
const pdfMakeService = new PdfMakeService();
const structuredToPdfmake = new StructuredContentToPdfmakeConverter();
const gridConverter = new GridToStructuredContentConverter();
const htmlToStructured = new HtmlToStructuredContentConverter();
const tokenReplacer = new TokenReplacerUtility();
const displayLogic = new DisplayLogicUtility();
const tokenHtmlReplacer = new TokenHtmlReplacerService();
const barcodeServiceNode = new BarcodeServiceNode();
const chartGenerationService = new ChartGenerationService();

const pageToStructured = new PageToStructuredContentConverter(structuredToPdfmake, gridConverter);
const pageToPage = new PageToPageConverter(htmlToStructured, tokenReplacer, displayLogic, null, chartGenerationService, barcodeServiceNode);
const htmlService = new HtmlGenerateService(pageToPage, jsonParser, tokenHtmlReplacer);
const pdfService = new PdfGenerateService(pageToStructured, pageToPage, pdfMakeService, jsonParser);
const validatorService = new PageTokenValidator(htmlToStructured);

// --- Node-only WysiPDF wrapper ---

export class WysiPDFNode {
  async generatePdfBase64(page: any, tokens: any[]): Promise<string> {
    return (await pdfService.generatePdfBase64(page, tokens)).base64;
  }

  async generatePdfBase64FromJson(page: any, json: string): Promise<string> {
    return (await pdfService.generatePdfBase64FromJson(page, json)).base64;
  }

  async generateHtml(page: any, tokens: any[], opts?: any): Promise<string> {
    return (await htmlService.generateHtml(page, tokens, opts)).html;
  }

  async generateHtmlFromJson(page: any, json: string, opts?: any): Promise<string> {
    return (await htmlService.generateHtmlFromJson(page, json, opts)).html;
  }

  async hasErrors(page: any, tokens: any[], mutateOriginal = false): Promise<string[]> {
    return validatorService.hasErrors(page, tokens, mutateOriginal);
  }

  async isValid(page: any, tokens: any[]): Promise<boolean> {
    return (await this.hasErrors(page, tokens)).length === 0;
  }
}

export default WysiPDFNode;
