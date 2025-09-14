// src/app/services/page-token-validator.service.ts
import { Injectable } from '@angular/core';
import {
  HtmlBlock,
  HtmlGridBlock,
  HtmlTableBlock,
  Page,
  Row,
} from '../models/page';
import { TokenAttribute } from '../models/token-attribute';
import { HtmlToStructuredContentConverter } from '../converters/html-to-structured-content.converter';

@Injectable({ providedIn: 'root' })
export class PageTokenValidator {
  constructor(
    private htmlToStructuredContentService: HtmlToStructuredContentConverter
  ) {}

  public validatePage(page: Page, tokens: TokenAttribute[]): Page {
    if (!page) return page;

    page = this.htmlToStructuredContentService.convert(page);

    page.content.rows = this.validateRow(page.content.rows, tokens);
    page.header.rows = this.validateRow(page.header.rows, tokens);
    page.footer.rows = this.validateRow(page.footer.rows, tokens);

    return page;
  }

  public validateRow(rows: Row[], tokens: TokenAttribute[]): Row[] {
    return this.processRows(rows, tokens);
  }

  /** Central recursive processor for any Row[] */
  private processRows(rows: Row[], tokens: TokenAttribute[]): Row[] {
    for (let row of rows) {
      const matchedToken = tokens.find(t => t.name === row.repeatableToken?.name);

      // Reset all cell errors at the start
      row.cells.forEach(cell => {
        cell.errorMessage = '';
        cell.hasError = false;
      });

      // 🔹 Push error if repeatableToken name does not exist in tokens
      if (row.repeatableToken?.name && !matchedToken) {
        row.cells.forEach(cell => {
          cell.errorMessage = `Repeatable token "${row.repeatableToken?.name}" not found`;
          cell.hasError = true;
        });
      }

      // Use latest tokenAttributes if found, otherwise fallback to existing
      const rowTokens =
        matchedToken?.tokenAttributes ??
        row.repeatableToken?.tokenAttributes ??
        tokens;

      for (let cell of row.cells) {
        let key: string | null = null;
        const errors: string[] = [];

        if (cell.type === 'barcode' && cell.barcodeBlock?.HtmlTokenElement?.key) {
          key = cell.barcodeBlock.HtmlTokenElement.key;
        } else if (cell.type === 'image' && cell.barcodeBlock?.HtmlTokenElement?.key) {
          key = cell.barcodeBlock.HtmlTokenElement.key;
        } else if (cell.type === 'chart' && cell.barcodeBlock?.HtmlTokenElement?.key) {
          // key = cell.chartBlock.HtmlTokenElement.key; // Uncomment if needed
        }

        if (key) {
          const isAvailable = this.isTokenAvailable(key, rowTokens);
          if (!isAvailable) {
            errors.push(`Token "${key}" not found`);
          }
        }

        for (let block of cell.block.blocks) {
          switch (block.blockType) {
            case 'table': {
              const tableBlock = block as HtmlTableBlock;
              for (let tableRow of tableBlock.rows) {
                for (let tableCell of tableRow.cells) {
                  for (let element of tableCell.elements) {
                    errors.push(...this.processAttributes(element.attributes, rowTokens));
                  }
                }
              }
              break;
            }

            case 'grid': {
              const gridBlock = block as HtmlGridBlock;
              this.processRows(gridBlock.rows, rowTokens);
              break;
            }

            default: {
              const htmlBlock = block as HtmlBlock;
              for (let element of htmlBlock.elements) {
                errors.push(...this.processAttributes(element.attributes, rowTokens));
              }
            }
          }
        }

        // update cell error state once per cell
        if (errors.length > 0) {
          cell.errorMessage = errors.join(', ');
          cell.hasError = true;
        } else if (!cell.errorMessage) {
          // Preserve error from missing repeatable token if already set
          cell.hasError = false;
          cell.errorMessage = '';
        }
      }
    }

    return rows;
  }



  /** 🔍 Attribute validator */
  private processAttributes(
    attributes: any,
    tokens: TokenAttribute[]
  ): string[] {
    const errors: string[] = [];

    if (attributes?.currentColumnName) {
      const tokenKey: string = attributes.currentColumnName;
      const isAvailable = this.isTokenAvailable(tokenKey, tokens);
      if (!isAvailable) {
        errors.push(`Token "${tokenKey}" not found`);
      }
    }

    return errors;
  }

  private isTokenAvailable(tokenKey: string, tokens: TokenAttribute[]): boolean {
    if (!tokenKey || !tokens) return false;
    return tokens.some(
      (t) => t.name?.toLowerCase() === tokenKey.toLowerCase()
    );
  }

  /** 📋 Validate and return a (de-duplicated) list of error messages.
   *  By default this DOES NOT mutate the input page. Pass mutateOriginal=true to allow mutation.
   */
  public hasErrors(
    page: Page,
    tokens: TokenAttribute[],
    mutateOriginal: boolean = false
  ): string[] {
    if (!page) return ['Page is null or undefined'];

    const working = mutateOriginal ? page : this.clonePage(page);

    // Run validation (populates cell.hasError / cell.errorMessage on `working`)
    this.validatePage(working, tokens);

    const messages = new Set<string>();

    const addFromRows = (rows?: Row[]) => {
      if (!rows || !Array.isArray(rows)) return;
      for (const row of rows) {
        for (const cell of row?.cells ?? []) {
          if (cell?.hasError && cell?.errorMessage) {
            messages.add(cell.errorMessage);
          }
        }
      }
    };

    addFromRows(working.header?.rows);
    addFromRows(working.content?.rows);
    addFromRows(working.footer?.rows);

    return Array.from(messages);
  }

  /** Simple deep clone to avoid mutating the caller’s page */
  private clonePage<T>(obj: T): T {
    try {
      if (typeof structuredClone === 'function') return structuredClone(obj);
    } catch {}
    return JSON.parse(JSON.stringify(obj));
  }
}
