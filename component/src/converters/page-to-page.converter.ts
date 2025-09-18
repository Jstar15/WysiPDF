import {Injectable} from '@angular/core';
import {Page, Row} from '../models/page';
import {HtmlToStructuredContentConverter} from './html-to-structured-content.converter';
import {TokenAttribute} from '../models/token-attribute';
import {TokenReplacerUtility} from "../utils/token-replacer.utility";
import {DisplayLogicUtility} from "../utils/display-logic.utility";
import {Converter} from "./converter";
import {TokenAttributeType} from "../models/token-attribute-type";
import {BarcodeService} from "../services/external/barcode.service";

@Injectable({ providedIn: 'root' })
export class PageToPageConverter  implements Converter<Page, Promise<Page>, TokenAttribute[]> {
  constructor(
    private htmlToStructuredContentService: HtmlToStructuredContentConverter,
    private tokenReplacerUtility: TokenReplacerUtility,
    private displayLogicUtility : DisplayLogicUtility,
    private barcodeService : BarcodeService) {}

  /**
   * Runs all "page" transformations, independent of any PDF engine.
   */
  public async convert(page: Page, tokenAttributeList: TokenAttribute[]): Promise<Page> {
    // deep copy so we never mutate the caller's object
    page = this.deepCopy(page);

    // 1) convert inline HTML in cells to structured content your pipeline understands
    page = this.htmlToStructuredContentService.convert(page);

    // 2) expand tokenized/partial sections
    page = this.insertRepeatableContent(page, tokenAttributeList);

    // 3) normalize row background colors to match page background
    page = this.updateRowColorToMatchPageBackgroundColor(page);

    // 4) clean header/footer: remove explicit row heights
    page = this.cleanHeaderFooter(page);

    // 5) Replace tokens
    page.header.rows = this.tokenReplacerUtility.replaceTokensInRows(page.header.rows, tokenAttributeList);
    page.header2.rows = this.tokenReplacerUtility.replaceTokensInRows(page.header2.rows, tokenAttributeList);
    page.footer.rows = this.tokenReplacerUtility.replaceTokensInRows(page.footer.rows, tokenAttributeList);
    page.content.rows = this.tokenReplacerUtility.replaceTokensInRows(page.content.rows, tokenAttributeList);

    // 6 ) Replace barcodes in row (await all)
    page.header.rows  = await Promise.all(page.header.rows.map(r  => this.replaceBarcodesInRow(r, tokenAttributeList)));
    page.header2.rows = await Promise.all(page.header2.rows.map(r => this.replaceBarcodesInRow(r, tokenAttributeList)));
    page.footer.rows  = await Promise.all(page.footer.rows.map(r  => this.replaceBarcodesInRow(r, tokenAttributeList)));
    page.content.rows = await Promise.all(page.content.rows.map(r => this.replaceBarcodesInRow(r, tokenAttributeList)));

    // 6b) Replace images in row
    page.header.rows  = page.header.rows.map(r => this.replaceImagesInRow(r, tokenAttributeList));
    page.header2.rows = page.header2.rows.map(r => this.replaceImagesInRow(r, tokenAttributeList));
    page.footer.rows  = page.footer.rows.map(r => this.replaceImagesInRow(r, tokenAttributeList));
    page.content.rows = page.content.rows.map(r => this.replaceImagesInRow(r, tokenAttributeList));


    // 7) Evaluate display logic show / hide
    page.header.rows = this.displayLogicUtility.evaluateAllRows(page.header.rows, tokenAttributeList);
    page.header2.rows = this.displayLogicUtility.evaluateAllRows(page.header2.rows, tokenAttributeList);
    page.footer.rows = this.displayLogicUtility.evaluateAllRows(page.footer.rows, tokenAttributeList);
    page.content.rows = this.displayLogicUtility.evaluateAllRows(page.content.rows, tokenAttributeList);

    return page;
  }


  private deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private cleanHeaderFooter(page: Page): Page {
    // header
    if (page.header?.rows) {
      for (let i = 0; i < page.header.rows.length; i++) {
        const row = page.header.rows[i] as Row & { height?: number };
        if (row && 'height' in row) {
          delete (row as any).height;
        }
      }
    }

    if (page.header2?.rows) {
      for (let i = 0; i < page.header2.rows.length; i++) {
        const row = page.header2.rows[i] as Row & { height?: number };
        if (row && 'height' in row) {
          delete (row as any).height;
        }
      }
    }

    // footer
    if (page.footer?.rows) {
      for (let i = 0; i < page.footer.rows.length; i++) {
        const row = page.footer.rows[i] as Row & { height?: number };
        if (row && 'height' in row) {
          delete (row as any).height;
        }
      }
    }

    return page;
  }

  private updateRowColorToMatchPageBackgroundColor(page: Page): Page {
    const bg = page.pageAttrs?.backgroundColor ?? 'white';

    if (page.header?.rows) {
      for (let i = 0; i < page.header.rows.length; i++) {
        page.header.rows[i].backgroundColor = bg;
      }
    }

    if (page.header2?.rows) {
      for (let i = 0; i < page.header2.rows.length; i++) {
        page.header2.rows[i].backgroundColor = bg;
      }
    }

    if (page.content?.rows) {
      for (let i = 0; i < page.content.rows.length; i++) {
        page.content.rows[i].backgroundColor = bg;
      }
    }

    if (page.footer?.rows) {
      for (let i = 0; i < page.footer.rows.length; i++) {
        page.footer.rows[i].backgroundColor = bg;
      }
    }

    return page;
  }

  /**
   * Expand all repeatable rows in the page.
   * Each repeatable row is duplicated based on the longest valueArray
   * in the associated tokenAttributes.
   */
  public insertRepeatableContent(page: Page, tokenAttributeList: TokenAttribute[] = []): Page {
    const expandedRows: Row[] = [];

    for (const row of page.content.rows) {
      if (row.repeatableToken) {
        const repeatableName = row.repeatableToken.name;
        const tokenType = row.repeatableToken.type;

        // STRING_ARRAY token stored as JSON string
        if (tokenType === TokenAttributeType.STRING_ARRAY) {
          let values: string[] = [];
          try {
            values = JSON.parse(row.repeatableToken.value || '[]');
          } catch {
            values = [];
          }

          for (let i = 0; i < values.length; i++) {
            const itemValue = values[i];
            let clonedRow: Row = JSON.parse(JSON.stringify(row));

            // Only pass the single string value for this row
            const singleToken: TokenAttribute = {
              ...row.repeatableToken,
              value: itemValue, // this ensures each row sees only one string
              valueArray: undefined // remove array so replacer doesn't see it
            };

            clonedRow = this.tokenReplacerUtility.replaceTokensInRow(clonedRow, [singleToken]);
            expandedRows.push(clonedRow);
          }

          continue; // done with this row
        }

        // JSON_ARRAY / nested objects
        const sourceToken = tokenAttributeList.find(t => t.name === repeatableName);
        if (!sourceToken || !sourceToken.tokenAttributes || sourceToken.tokenAttributes.length === 0) {
          expandedRows.push(row);
          continue;
        }

        const maxLength = Math.max(
          ...sourceToken.tokenAttributes.map(t => t.valueArray?.length ?? 0)
        );

        for (let i = 0; i < maxLength; i++) {
          let clonedRow: Row = JSON.parse(JSON.stringify(row));

          const attributeList = sourceToken.tokenAttributes.map(t => ({
            ...t,
            value: Array.isArray(t.valueArray) && t.valueArray.length > i ? t.valueArray[i] : ''
          }));

          clonedRow = this.tokenReplacerUtility.replaceTokensInRow(clonedRow, attributeList);
          expandedRows.push(clonedRow);
        }
      } else {
        expandedRows.push(row);
      }
    }

    page.content.rows = expandedRows;
    return page;
  }

  /**
   * Replace all barcodes in a given row, looking up values from tokenAttributes.
   */
  private async replaceBarcodesInRow(row: Row, tokenAttributeList: TokenAttribute[]): Promise<Row> {
    const newCells = await Promise.all(row.cells.map(async cell => {
      if (cell.type === 'barcode' && cell.barcodeBlock?.HtmlTokenElement) {
        const key = cell.barcodeBlock.HtmlTokenElement.key;
        const tokenValue = this.getTokenValue(key, tokenAttributeList);

        if (!tokenValue) return cell; // skip if no token found

        const dataUrl: string = await this.barcodeService.generateDataUrl(
          tokenValue,
          {
            format: cell.barcodeBlock.format,
            width: 2,
            height: cell.barcodeBlock.heightPx,
            displayValue: false,
            margin: 3,
            size: 256,
            errorCorrectionLevel: 'M',
            dark: '#000000',
            light: '#ffffff'
          }
        );

        return {
          ...cell,
          barcodeBlock: {
            ...cell.barcodeBlock,
            imageBase64: dataUrl
          }
        };
      }
      return cell;
    }));

    return { ...row, cells: newCells };
  }

  /**
   * Replace all images in a given row, looking up values from tokenAttributes.
   */
  private replaceImagesInRow(row: Row, tokenAttributeList: TokenAttribute[]): Row {
    const newCells = row.cells.map(cell => {
      if (cell.type === 'image' && cell.imageBlock?.HtmlTokenElement) {
        const key = cell.imageBlock.HtmlTokenElement.key;
        const token = tokenAttributeList.find(t => t.name === key);

        if (!token || !token.value) return cell;

        return {
          ...cell,
          imageBlock: {
            ...cell.imageBlock,
            imageBase64: token.value // assume value contains the base64 string
          }
        };
      }
      return cell;
    });

    return { ...row, cells: newCells };
  }

  /**
   * Find a token's value by name from the provided token list.
   */
  private getTokenValue(key: string, tokenAttributeList: TokenAttribute[]): string | null {
    const token = tokenAttributeList.find(t => t.name === key);
    return token?.value ?? null;
  }
}
