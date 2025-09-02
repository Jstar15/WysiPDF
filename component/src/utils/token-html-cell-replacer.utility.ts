import { Injectable } from '@angular/core';
import { Grid, Page, Row } from '../models/page';
import { TokenAttribute } from '../models/token-attribute';

@Injectable({ providedIn: 'root' })
export class TokenHtmlReplacerService {
  constructor() {}

  public replaceTokensInPageHtml(page: Page, tokens: TokenAttribute[] = []): Page {
    if (!page) return page;

    if (page.header)  this.replaceInGridHtml(page.header,  tokens);
    if (page.content) this.replaceInGridHtml(page.content, tokens);
    if (page.footer)  this.replaceInGridHtml(page.footer,  tokens);

    return page;
  }

  private replaceInGridHtml(grid: Grid, tokens: TokenAttribute[]): void {
    if (!grid?.rows?.length) return;
    this.replaceTokensInRow(grid.rows, tokens);
  }

  /**
   * Replace tokens in all HTML cells across the given rows.
   * Mutates the provided rows and returns them for convenience.
   */
  public replaceTokensInRow(rows: Row[], tokens: TokenAttribute[] = []): Row[] {
    if (!rows?.length) return rows;

    const tokenMap = this.buildExactTokenMap(tokens);

    for (const row of rows) {
      if (!row?.cells?.length) continue;

      for (const cell of row.cells) {
        if (!cell || cell.type !== 'html') continue;

        const html: string = cell.value || '';
        if (!html) continue;

        cell.value = this.replaceInHtml(html, tokenMap);
      }
    }

    return rows;
  }

  /**
   * Replaces <span class="custom-token" data-name="..." data-type="..." data-value="<<...>>">...</span>
   * using tokenMap. Tries exact key first, then tail key (e.g., "items.amount" -> "amount").
   */
  private replaceInHtml(html: string, tokenMap: Record<string, string>): string {
    if (!html) return html;

    // Minimal SSR behavior: no DOM operations.
    if (typeof document === 'undefined') return html;

    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = html;

    const nodes: HTMLElement[] = Array.from(
      container.querySelectorAll<HTMLElement>('.custom-token')
    );

    for (const node of nodes) {
      const nameRaw: string = (node.dataset?.['name'] ?? '').trim();
      const typeRaw: string = (node.dataset?.['type'] ?? '').trim().toLowerCase();
      const valRaw: string  = (node.dataset?.['value'] ?? '').trim(); // e.g. "<<customer.name>>"

      // Candidates in priority order:
      // 1) exact data-name
      // 2) exact placeholder from data-value (e.g. "<<items.amount>>" -> "items.amount")
      // 3) tail of data-name (e.g. "items.amount" -> "amount")
      // 4) tail of placeholder (e.g. "items.amount" -> "amount")
      const placeholder = this.extractPlaceholder(valRaw);
      const tailFromName = this.extractTailKey(nameRaw);
      const tailFromPlaceholder = this.extractTailKey(placeholder ?? '');

      const candidates: string[] = [];
      if (nameRaw) candidates.push(nameRaw);
      if (placeholder) candidates.push(placeholder);
      if (tailFromName && tailFromName !== nameRaw) candidates.push(tailFromName);
      if (tailFromPlaceholder && tailFromPlaceholder !== placeholder) candidates.push(tailFromPlaceholder);

      let replacement: string | undefined;
      for (const k of candidates) {
        if (k in tokenMap) {
          replacement = tokenMap[k];
          break;
        }
      }

      if (replacement !== undefined) {
        if (typeRaw === 'html') {
          node.innerHTML = replacement;
        } else {
          node.textContent = replacement;
        }
        node.setAttribute('data-resolved', 'true');
      }
    }

    return container.innerHTML;
  }


  private buildExactTokenMap(tokens: TokenAttribute[]): Record<string, string> {
    const map: Record<string, string> = {};
    for (const t of tokens ?? []) {
      if (!t?.name) continue;
      const key: string = t.name.trim();
      const val: string = String(t.value ?? '');
      map[key] = val;
    }
    return map;
  }

  private extractPlaceholder(v?: string): string | null {
    if (!v) return null;
    const m = String(v).match(/^<<\s*([^>]+?)\s*>>$/);
    return m ? m[1] : null;
  }

  /**
   * Regex tail-key extractor.
   * Examples:
   *  - "items.amount"         -> "amount"
   *  - "items[3].amount"      -> "amount"
   *  - "order.unit-price"     -> "unit-price"
   *  - "amount"               -> "amount"
   */
  private extractTailKey(source: string): string | null {
    if (!source) return null;
    // Grab last run of [A-Za-z0-9_-] chars at the end of the string.
    // This ignores preceding object paths / indices.
    const m = source.match(/([A-Za-z0-9_-]+)$/);
    return m ? m[1] : null;
  }
}
