import { Injectable } from '@angular/core';
import { Row, HtmlBasicElement, HtmlTableBlock } from '../models/interfaces';
import { TokenAttribute } from '../models/TokenAttribute';

@Injectable({ providedIn: 'root' })
export class TokenReplacerService {
  public replaceTokensInRow(rows: Row[], tokens: TokenAttribute[]): Row[] {
    // ── build a richer map: full, last-segment, and normalized keys ──
    const tokenMap: { [key: string]: string } = {};
    for (const t of tokens ?? []) {
      if (!t?.name) continue;
      tokenMap[t.name.trim()] = String(t.value ?? '');
    }

    for (const row of rows) {
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

      // keep your partial behavior untouched
      if (row.partialContent) {
        this.replaceTokensInRow(row.partialContent.rows, tokens);
      }
    }

    return rows;
  }

  private replaceInElement(el: HtmlBasicElement, tokenMap: { [k: string]: string }) {
    const attrs = (el as any).attributes || {};
    const isTokenish = el.type === 'token' || attrs.isMergeField === true; // ← minimal fix
    if (!isTokenish) return;

    const candidates: string[] = [];

    // from currentColumnName (prefer full, then last segment)
    const cc = (attrs.currentColumnName || '').toString().trim();
    if (cc) {
      candidates.push(cc);
      const last = cc.split('.').pop();
      if (last) candidates.push(last);
    }

    // from placeholder like "<<customer.name>>"
    const ph = this.extractPlaceholder(el.value);
    if (ph) {
      candidates.push(ph);
      const last = ph.split('.').pop();
      if (last) candidates.push(last);
    }

    // try raw then normalized lookups
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
      el.type = 'token'; // keep your original line
    }
  }

  // ── tiny helpers ──
  private norm(k: string): string {
    return k.replace(/^<<\s*|\s*>>$/g, '').trim().toLowerCase();
  }

  private extractPlaceholder(v?: string): string | null {
    if (!v) return null;
    const m = String(v).match(/^<<\s*([^>]+?)\s*>>$/);
    return m ? m[1] : null;
  }
}
