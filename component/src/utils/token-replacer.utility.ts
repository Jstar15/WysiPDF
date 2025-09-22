import { Injectable } from '@angular/core';
import { Row, HtmlBasicElement, HtmlTableBlock } from '../models/page';
import { TokenAttribute } from '../models/token-attribute';
import * as cheerio from 'cheerio';

@Injectable()
export class TokenReplacerUtility {

  /**
   * Replace tokens in multiple rows
   */
  public replaceTokensInRows(rows: Row[], tokens: TokenAttribute[]): Row[] {
    return rows.map(row => this.replaceTokensInRow(row, tokens));
  }

  /**
   * Replace tokens in a single row
   */
  public replaceTokensInRow(row: Row, tokens: TokenAttribute[]): Row {
    const tokenMap: { [key: string]: string } = this.buildTokenMap(tokens);

    for (const cell of row.cells) {
      if (!cell.block) continue;

      for (const block of cell.block.blocks) {
        if (block.blockType === 'table') {
          const table = block as HtmlTableBlock;
          for (const tr of table.rows) {
            for (const tc of tr.cells) {
              for (const el of tc.elements) {
                this.replaceInElement(el, tokenMap);
              }
            }
          }
        } else {
          const maybeEls = (block as any).elements;
          if (Array.isArray(maybeEls)) {
            for (const el of maybeEls as HtmlBasicElement[]) {
              this.replaceInElement(el, tokenMap);
            }
          }
        }

        const repeatable: TokenAttribute = row.repeatableToken;
        if (repeatable) {
          const repeatableTokenMap = this.buildTokenMap(tokens);
          cell.value = this.replaceInHtml(cell.value, repeatableTokenMap); // updated to use Cheerio
        }
      }
    }

    return row;
  }

  private buildTokenMap(tokens: TokenAttribute[]): { [key: string]: string } {
    const tokenMap: { [key: string]: string } = {};
    for (const t of tokens ?? []) {
      if (!t?.name) continue;

      if (t.type === 'string_array' && typeof t.value === 'string') {
        try {
          const arr = JSON.parse(t.value);
          if (Array.isArray(arr)) {
            arr.forEach((v, i) => {
              tokenMap[`${t.name}[${i}]`] = String(v ?? '');
            });
          } else {
            tokenMap[t.name.trim()] = String(t.value ?? '');
          }
        } catch {
          tokenMap[t.name.trim()] = String(t.value ?? '');
        }
      } else {
        tokenMap[t.name.trim()] = String(t.value ?? '');
      }
    }
    return tokenMap;
  }

  private replaceInElement(el: HtmlBasicElement, tokenMap: { [k: string]: string }) {
    const attrs = (el as any).attributes || {};
    const isTokenish = el.type === 'token' || attrs.isMergeField === true;
    if (!isTokenish) return;

    const candidates: string[] = [];

    const cc: string = (attrs.currentColumnName || '').toString().trim();
    if (cc) {
      candidates.push(cc);
      const last = cc.split('.').pop();
      if (last) candidates.push(last);
    }

    const ph: string = this.extractPlaceholder(el.value);
    if (ph) {
      candidates.push(ph);
      const last = ph.split('.').pop();
      if (last) candidates.push(last);
    }

    let replacement: string | undefined;
    for (const k of candidates) {
      if (k in tokenMap) { replacement = tokenMap[k]; break; }
      const nk = this.norm(k);
      if (nk in tokenMap) { replacement = tokenMap[nk]; break; }
    }

    if (replacement !== undefined) {
      const unescaped: string = replacement.replace(/\\n/g, '\n');
      el.value = unescaped;
      (el as any).attributes = attrs;
      (el as any).attributes.value = unescaped;
      el.type = 'token';
    }
  }

  /**
   * Replace tokens in HTML using Cheerio instead of DOMParser.
   */
  public replaceInHtml(html: string, tokenMap: { [key: string]: string }): string {
    if (!html) return html;

    const $ = cheerio.load(html);

    $('span[data-name]').each((_, span) => {
      const $span = $(span);
      const key = $span.attr('data-name')?.trim();
      if (!key) return;

      const replacement =
        tokenMap[key] ?? tokenMap[key.toLowerCase()] ?? null;

      if (replacement != null) {
        $span.text(replacement);
      }
    });

    return $.html();
  }

  private norm(k: string): string {
    return k.replace(/^<<\s*|\s*>>$/g, '').trim().toLowerCase();
  }

  private extractPlaceholder(v?: string): string | null {
    if (!v) return null;
    const m = String(v).match(/^<<\s*([^>]+?)\s*>>$/);
    return m ? m[1] : null;
  }
}
