import {
  Page, Grid, Row, Cell, HtmlBlockContainer, HtmlBlock, HtmlTableBlock, HtmlGridBlock,
  HtmlBasicElement, HtmlTokenElement
} from '../models/interfaces';
import { Injectable } from '@angular/core';
import { PageService } from './page.service';
import { TokenAttribute } from '../models/TokenAttribute';

@Injectable({ providedIn: 'root' })
export class PageTokenValidator {

  constructor(public pageService: PageService) {}

  // ────────────────────────────────────────────────────────────────────────────
  // PUBLIC API

  /** Mutates `page` to flag cells with errors. Logs counts. Returns the same page. */
  public validatePage(page: Page, tokens?: TokenAttribute[]): Page {
    const tokenList = (tokens && tokens.length ? tokens : (page.tokenAttrs || []));
    const available: string[] = [];
    for (let i = 0; i < (tokenList || []).length; i++) {
      const name = (tokenList[i]?.name || '').trim();
      if (!name) continue;
      let exists = false;
      for (let j = 0; j < available.length; j++) if (available[j] === name) { exists = true; break; }
      if (!exists) available.push(name);
    }

    // Normalize once so tokens are materialized into elements
    const norm: Page = this.pageService.processPage({ ...page, tokenAttrs: tokenList }, tokenList);

    // For logging: compute referenced keys from normalized page
    const refs = this.fetchAllTokens(norm);
    const refKeys: string[] = [];
    for (let i = 0; i < refs.length; i++) {
      const k = (refs[i].key || '').trim();
      if (!k) continue;
      let seen = false;
      for (let j = 0; j < refKeys.length; j++) if (refKeys[j] === k) { seen = true; break; }
      if (!seen) refKeys.push(k);
    }

    console.groupCollapsed('[TokenValidate] Start');
    console.log('[TokenValidate] referenced keys (%d):', refKeys.length, refKeys);
    console.log('[TokenValidate] available keys (%d):', available.length, available);

    // Clear previous errors on the ORIGINAL page
    this.clearPageErrors(page);

    const errors: string[] = [];

    // Validate header/content/footer using (normalized, original) grid pairs
    this.validateGridPair(norm.header, page.header, 'header', available, errors);
    this.validateGridPair(norm.content, page.content, 'content', available, errors);
    this.validateGridPair(norm.footer, page.footer, 'footer', available, errors);

    // Top-level partials: pair by index
    const normPartials = norm.partialContent || [];
    const origPartials = page.partialContent || [];
    const maxTop = Math.max(normPartials.length, origPartials.length);
    for (let i = 0; i < maxTop; i++) {
      const n = normPartials[i];
      const o = origPartials[i];
      const label = (o && o.name) ? `partial[${o.name}]` : (n && (n as any).name ? `partial[${(n as any).name}]` : `partial[${i}]`);
      this.validateGridPair(n, o, label, available, errors);
    }

    console.log('[TokenValidate] missing errors (%d):', errors.length, errors);
    console.groupEnd();

    return page;
  }

  /** True if no cells are marked with errors after validation. */
  public isValid(page: Page): boolean {
    this.validatePage(page, page.tokenAttrs || []);
    const errs = this.collectErrorsFromPage(page);
    return errs.length === 0;
  }

  /** Returns all error strings after mutating the page to flag cells. */
  public validationError(page: Page): string[] {
    this.validatePage(page, page.tokenAttrs || []);
    return this.collectErrorsFromPage(page);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // GRID VALIDATION (reads normalized, writes to original, with logs)

  private validateGridPair(
    normGrid: Grid | undefined,
    origGrid: Grid | undefined,
    sectionLabel: string,
    available: string[],
    errors: string[]
  ): void {
    if (!normGrid || !normGrid.rows || !normGrid.rows.length) {
      console.log(`[TokenValidate] ${sectionLabel}: refs=0, missing=0`);
      return;
    }
    const nRows = normGrid.rows || [];
    const oRows = (origGrid && origGrid.rows) ? origGrid.rows : [];

    let sectionRefs = 0;
    let sectionMissing = 0;

    const maxR = Math.max(nRows.length, oRows.length);
    for (let r = 0; r < maxR; r++) {
      const nRow = nRows[r];
      const oRow = oRows[r];

      if (!nRow || !nRow.cells || !oRow || !oRow.cells) continue;

      const nCells = nRow.cells;
      const oCells = oRow.cells;
      const maxC = Math.max(nCells.length, oCells.length);

      for (let c = 0; c < maxC; c++) {
        const nCell = nCells[c];
        const oCell = oCells[c];
        if (!nCell || !oCell) continue;

        const keysInCell: string[] = [];
        this.collectTokensFromCell(nCell, keysInCell); // read from normalized
        sectionRefs += keysInCell.length;

        // find missing
        const missing: string[] = [];
        for (let k = 0; k < keysInCell.length; k++) {
          const key = keysInCell[k];
          if (!this.inArray(available, key)) {
            let seen = false;
            for (let m = 0; m < missing.length; m++) if (missing[m] === key) { seen = true; break; }
            if (!seen) missing.push(key);
          }
        }

        if (missing.length > 0) {
          sectionMissing += missing.length;
          oCell.hasError = true;
          oCell.errorMessage = `${sectionLabel}: row ${r} col ${c} — Missing tokens: ${missing.join(', ')}`;
          errors.push(oCell.errorMessage);
          console.warn('[TokenValidate]', oCell.errorMessage);
        } else {
          oCell.hasError = false;
          oCell.errorMessage = '';
        }
      }

      // Row-level partial grid: validate pair recursively (normalized vs original)
      if (nRow?.partialContent || oRow?.partialContent) {
        const nSub = nRow?.partialContent;
        const oSub = oRow?.partialContent;
        const subLabel = `${sectionLabel} > partial(row ${r})`;
        this.validateGridPair(nSub, oSub, subLabel, available, errors);
      }
    }

    console.log(`[TokenValidate] ${sectionLabel}: refs=${sectionRefs}, missing=${sectionMissing}`);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // TOKEN SCAN (logs preserved; operates on normalized pages)

  public fetchAllTokens(page: Page): HtmlTokenElement[] {
    const normalized: Page = this.pageService.processPage(page, page.tokenAttrs);

    const tokens: HtmlTokenElement[] = [];
    const seenKeys: string[] = [];

    console.groupCollapsed('[TokenScan] Page — start');

    const scanGridLabeled = (grid: Grid | undefined, label: string) => {
      console.groupCollapsed(`[TokenScan] Scan grid: ${label}${grid?.name ? ` (${grid.name})` : ''} — start`);
      this.scanRows(grid?.rows || [], tokens, seenKeys, label);
      console.groupEnd();
    };

    scanGridLabeled(normalized.header, 'header');
    scanGridLabeled(normalized.content, 'content');
    scanGridLabeled(normalized.footer, 'footer');

    for (let i = 0; i < (normalized.partialContent || []).length; i++) {
      const g = normalized.partialContent![i];
      scanGridLabeled(g, g?.name ? `partial[${g.name}]` : `partial[${i}]`);
    }

    if (tokens.length === 0) {
      console.warn('[TokenScan] No tokens found in page');
    } else {
      console.groupCollapsed(`[TokenScan] Found ${tokens.length} unique token(s)`);
      for (let i = 0; i < tokens.length; i++) console.log('-', tokens[i]);
      console.groupEnd();
    }

    console.groupEnd();
    return tokens;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Walkers for scanning (used by fetchAllTokens)

  private scanRows(
    rows: Row[],
    out: HtmlTokenElement[],
    seen: string[],
    label: string,
    prefix: string = ''
  ): void {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const rowPath = `${prefix} -> row ${r}`;

      const cells = row?.cells || [];
      for (let c = 0; c < cells.length; c++) {
        const cell = cells[c];
        const cellPath = `${rowPath}, col ${c}`;

        const container: HtmlBlockContainer | undefined = cell?.block;
        const blocks = container?.blocks || [];
        for (let b = 0; b < blocks.length; b++) {
          const blk = blocks[b];

          // Table
          if ((blk as HtmlTableBlock)?.blockType === 'table') {
            const table = blk as HtmlTableBlock;
            const tRows = table?.rows || [];
            for (let tr = 0; tr < tRows.length; tr++) {
              const trow = tRows[tr];
              const tCells = trow?.cells || [];
              for (let tc = 0; tc < tCells.length; tc++) {
                const tcell = tCells[tc];
                const els = tcell?.elements || [];
                for (let e = 0; e < els.length; e++) {
                  const el = els[e];
                  this.collectTokenFromElement(el, out, seen, `${label}${cellPath}, table r${tr} c${tc} el${e}`);
                }
              }
            }
            continue;
          }

          // Nested grid block
          if ((blk as HtmlGridBlock)?.blockType === 'grid') {
            const nested = blk as HtmlGridBlock;
            this.scanRows(nested?.rows || [], out, seen, label, `${rowPath} [grid]`);
            continue;
          }

          // Normal block
          const normal = blk as HtmlBlock;
          const els = normal?.elements || [];
          for (let e = 0; e < els.length; e++) {
            const el = els[e];
            this.collectTokenFromElement(el, out, seen, `${label}${cellPath}, block ${b} el${e}`);
          }
        }
      }

      if (row?.partialContent?.rows?.length) {
        this.scanRows(row.partialContent.rows, out, seen, `${label} > partial`, rowPath);
      }
    }
  }

  private collectTokenFromElement(
    el: HtmlBasicElement,
    out: HtmlTokenElement[],
    seen: string[],
    ctx: string
  ): void {
    if (!el) return;

    const isMerge = el?.attributes?.isMergeField === true;
    const colName = typeof el?.attributes?.currentColumnName === 'string'
      ? el.attributes.currentColumnName.trim()
      : '';

    let key: string | null = null;
    let type: string | undefined = undefined;

    if (isMerge && colName) {
      key = colName;
      type = typeof el?.attributes?.type === 'string' ? el.attributes.type : undefined;
    } else if (el.type === 'token' && (el as any)?.token?.key) {
      const tk = String((el as any).token.key).trim();
      if (tk) {
        key = tk;
        type = (el as any).token?.type || el?.attributes?.type;
      }
    }

    if (!key) return;

    for (let i = 0; i < seen.length; i++) {
      if (seen[i] === key) {
        console.debug('[TokenScan] duplicate token ignored:', { key, ctx });
        return;
      }
    }

    seen.push(key);
    const tok: HtmlTokenElement = { key, type };
    out.push(tok);

    console.log('[TokenScan] + token', tok, 'at', ctx);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Token extraction for a SINGLE CELL (used by validation on normalized cells)

  private collectTokensFromCell(cell: Cell, outKeys: string[]): void {
    if (!cell) return;

    const container: HtmlBlockContainer | undefined = cell.block;
    const blocks = container?.blocks || [];
    for (let b = 0; b < blocks.length; b++) {
      const blk = blocks[b];

      // Table
      if ((blk as HtmlTableBlock)?.blockType === 'table') {
        const table = blk as HtmlTableBlock;
        const tRows = table?.rows || [];
        for (let tr = 0; tr < tRows.length; tr++) {
          const trow = tRows[tr];
          const tCells = trow?.cells || [];
          for (let tc = 0; tc < tCells.length; tc++) {
            const tcell = tCells[tc];
            const els = tcell?.elements || [];
            for (let e = 0; e < els.length; e++) this.collectKeyFromElement(els[e], outKeys);
          }
        }
        continue;
      }

      // Nested grid
      if ((blk as HtmlGridBlock)?.blockType === 'grid') {
        const nested = blk as HtmlGridBlock;
        const nRows = nested?.rows || [];
        for (let nr = 0; nr < nRows.length; nr++) {
          const nRow = nRows[nr];
          const nCells = nRow?.cells || [];
          for (let nc = 0; nc < nCells.length; nc++) this.collectTokensFromCell(nCells[nc], outKeys);

          if (nRow?.partialContent?.rows?.length) {
            const pcRows = nRow.partialContent.rows;
            for (let pr = 0; pr < pcRows.length; pr++) {
              const pcRow = pcRows[pr];
              const pcCells = pcRow?.cells || [];
              for (let pc = 0; pc < pcCells.length; pc++) this.collectTokensFromCell(pcCells[pc], outKeys);
            }
          }
        }
        continue;
      }

      // Normal block
      const normal = blk as HtmlBlock;
      const els = normal?.elements || [];
      for (let e = 0; e < els.length; e++) this.collectKeyFromElement(els[e], outKeys);
    }
  }

  private collectKeyFromElement(el: HtmlBasicElement, outKeys: string[]): void {
    if (!el) return;

    // Canonical: merge field + currentColumnName
    if (el?.attributes?.isMergeField === true && typeof el?.attributes?.currentColumnName === 'string') {
      const key = el.attributes.currentColumnName.trim();
      if (key) this.pushIfMissing(outKeys, key);
      return;
    }

    // Fallback: explicit token element with token.key
    if (el.type === 'token' && (el as any)?.token?.key) {
      const tk = String((el as any).token.key).trim();
      if (tk) this.pushIfMissing(outKeys, tk);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Page utilities

  private clearPageErrors(page: Page): void {
    const clearGrid = (grid?: Grid) => {
      if (!grid?.rows?.length) return;
      for (let r = 0; r < grid.rows.length; r++) {
        const row = grid.rows[r];
        const cells = row?.cells || [];
        for (let c = 0; c < cells.length; c++) {
          const cell = cells[c];
          cell.hasError = false;
          cell.errorMessage = '';
        }
        if (row?.partialContent?.rows?.length) clearGrid(row.partialContent);
      }
    };

    clearGrid(page.header);
    clearGrid(page.content);
    clearGrid(page.footer);
    for (let i = 0; i < (page.partialContent || []).length; i++) clearGrid(page.partialContent![i]);
  }

  private collectErrorsFromPage(page: Page): string[] {
    const out: string[] = [];
    const collectGrid = (grid?: Grid) => {
      if (!grid?.rows?.length) return;
      for (let r = 0; r < grid.rows.length; r++) {
        const row = grid.rows[r];
        const cells = row?.cells || [];
        for (let c = 0; c < cells.length; c++) {
          const cell = cells[c];
          if (cell?.hasError && cell.errorMessage) out.push(cell.errorMessage);
        }
        if (row?.partialContent?.rows?.length) collectGrid(row.partialContent);
      }
    };
    collectGrid(page.header);
    collectGrid(page.content);
    collectGrid(page.footer);
    for (let i = 0; i < (page.partialContent || []).length; i++) collectGrid(page.partialContent![i]);
    return out;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Array helpers

  private inArray(arr: string[], v: string): boolean {
    for (let i = 0; i < arr.length; i++) if (arr[i] === v) return true;
    return false;
  }

  private pushIfMissing(arr: string[], v: string): void {
    for (let i = 0; i < arr.length; i++) if (arr[i] === v) return;
    arr.push(v);
  }
}
