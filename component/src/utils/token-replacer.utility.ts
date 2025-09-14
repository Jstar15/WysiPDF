import { Injectable } from '@angular/core';
import { Row, HtmlBasicElement, HtmlTableBlock } from '../models/page';
import { TokenAttribute } from '../models/token-attribute';

@Injectable({ providedIn: 'root' })
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
      }
    }

    return row;
  }

  // ── Internal helpers ──

  private buildTokenMap(tokens: TokenAttribute[]): { [key: string]: string } {
    const tokenMap: { [key: string]: string } = {};
    for (const t of tokens ?? []) {
      if (!t?.name) continue;
      tokenMap[t.name.trim()] = String(t.value ?? '');
    }
    return tokenMap;
  }

  private replaceInElement(el: HtmlBasicElement, tokenMap: { [k: string]: string }) {
    const attrs = (el as any).attributes || {};
    const isTokenish = el.type === 'token' || attrs.isMergeField === true;
    if (!isTokenish) return;

    const candidates: string[] = [];

    // currentColumnName
    const cc: string = (attrs.currentColumnName || '').toString().trim();
    if (cc) {
      candidates.push(cc);
      const last = cc.split('.').pop();
      if (last) candidates.push(last);
    }

    // placeholder like <<customer.name>>
    const ph: string = this.extractPlaceholder(el.value);
    if (ph) {
      candidates.push(ph);
      const last = ph.split('.').pop();
      if (last) candidates.push(last);
    }

    // lookup replacement
    let replacement: string | undefined;
    for (const k of candidates) {
      if (k in tokenMap) { replacement = tokenMap[k]; break; }
      const nk = this.norm(k);
      if (nk in tokenMap) { replacement = tokenMap[nk]; break; }
    }

    if (replacement !== undefined) {
      el.value = replacement;
      (el as any).attributes = attrs;
      (el as any).attributes.value = replacement;
      el.type = 'token';
    }
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
