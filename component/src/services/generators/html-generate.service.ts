import { Injectable } from '@angular/core';
import {Page, Grid, Row, Cell, CellAttrs, ImageBlock, ChartBlock, BarcodeBlock} from '../../models/page';
import {TokenAttribute} from "../../models/token-attribute";
import {PageToPageConverter} from "../../converters/page-to-page.converter";
import {JsonTokenParserUtility} from "../../utils/json-token-parser.utility";
import {TokenHtmlReplacerService} from "../../utils/token-html-cell-replacer.utility";

export interface PageToHtmlOptions {
  includeBaseStyles?: boolean;
  rootClass?: string; // default: 'p2h-root'
  pageView?: boolean
}

export interface HtmlGenerationResult {
  page: Page;
  html?: string; // full doc or fragment, depending on opts
}
@Injectable({ providedIn: 'root' })
export class HtmlGenerateService {
  constructor(
    private pageService: PageToPageConverter,
    private jsonTokenParserService: JsonTokenParserUtility,
    private tokenHtmlCellReplacerService : TokenHtmlReplacerService
  ) {}
  public async generateHtml(
    page: Page,
    tokenAttributeList: TokenAttribute[],
    opts?: PageToHtmlOptions & { title?: string; fullDocument?: boolean } // fullDocument=false => fragment
  ): Promise<HtmlGenerationResult> {
    // reuse your shared page pipeline
    page = await this.pageService.convert(page, tokenAttributeList);
    page = this.tokenHtmlCellReplacerService.replaceTokensInPageHtml(page, page.tokenAttrs);


    const html = opts?.fullDocument
      ? this.toHtmlDocument(page, opts)
      : this.toHtmlString(page, opts);

    return { page, html };
  }

  public async generateHtmlFromJson(
    page: Page,
    json: string,
    opts?: PageToHtmlOptions & { title?: string; fullDocument?: boolean }
  ): Promise<HtmlGenerationResult> {
    const tokenAttributeList: TokenAttribute[] = this.jsonTokenParserService.parse(json);
    return this.generateHtml(page, tokenAttributeList, opts);
  }

  /** Convert a full Page into an HTML string (no <!doctype>, just markup). */
  public toHtmlString(page: Page, opts?: PageToHtmlOptions): string {
    const rootClass = opts?.rootClass ?? 'p2h-root';
    const styleTag = (opts?.includeBaseStyles ?? true)
      ? `<style>${this.baseCss(rootClass)}</style>`
      : '';

    const p = page.pageAttrs ?? {};
    const paddingFromMargins = this.fourSidePadding(
      p.marginTop, p.marginRight, p.marginBottom, p.marginLeft
    );

    // Original inline wrapper style (used when NOT in pageView)
    const wrapperStyle: string = this.inlineStyle({
      width: '100%',
      'box-sizing': 'border-box',
      padding: paddingFromMargins ?? undefined,
      'background-color': p.backgroundColor ?? undefined,
      'font-family': p.defaultFont ?? undefined
    });

    const headerHtml  = page.header  ? this.renderSection('header',  page.header, p.headerMarginTop) : '';
    const contentHtml = page.content ? this.renderSection('content', page.content) : '';
    const footerHtml  = page.footer  ? this.renderSection('footer',  page.footer, p.footerMarginTop) : '';

    // When pageView=true, we wrap with canvas/page shells to emulate a printed page
    if (opts?.pageView) {
      // Inner “page” style (padding == margins)
      const pageStyle = this.inlineStyle({
        'box-sizing': 'border-box',
        padding: paddingFromMargins ?? '24px',
        'background-color': p.backgroundColor ?? '#ffffff',
        'font-family': p.defaultFont ?? 'Roboto, Arial, sans-serif'
      });

      return `
        ${styleTag}
        <div class="${rootClass} ${rootClass}--page-view">
          <div class="${rootClass}__canvas">
            <div class="${rootClass}__page" style="${pageStyle}">
              ${headerHtml}
              ${contentHtml}
              ${footerHtml}
            </div>
          </div>
        </div>`.trim();
    }

    // Default: no page shell — preserve existing behavior
    return `
      ${styleTag}
      <div class="${rootClass}" style="${wrapperStyle}">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`.trim();
  }

  /** Full HTML document (for download). */
  public toHtmlDocument(page: Page, opts?: PageToHtmlOptions & { title?: string }): string {
    const title = opts?.title ?? (page?.content?.name || 'Page Export');
    const body = this.toHtmlString(page, opts);
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${this.escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
${body}
</body>
</html>`;
  }


  // -----------------------
  // Section / Grid / Row rendering
  // -----------------------

  private renderSection(role: 'header' | 'content' | 'footer' | 'partial', grid: Grid, gapPx?: number): string {
    const sectionStyle = this.inlineStyle({
      width: '100%',
      'box-sizing': 'border-box',
      ...(gapPx != null
        ? (role === 'header'
          ? { 'margin-bottom': this.pxOrUndefined(gapPx) }
          : role === 'footer'
            ? { 'margin-top': this.pxOrUndefined(gapPx) }
            : {})
        : {})
    });

    const rowsHtml = (grid?.rows ?? []).map(r => this.renderRow(r)).join('');
    return `<section class="p2h-section p2h-${role}" style="${sectionStyle}">
  ${rowsHtml}
</section>`;
  }

  private renderRow(row: Row): string {
    if (row.type === 'page-break') {
      return `<div class="p2h-page-break"></div>`;
    }

    // Normalize widths to match cell count and scale to 100%
    const widths = this.normalizeWidths(row.widths, row.cells.length);

    // Build CSS Grid template like "33.33% 33.33% 33.33%"
    const template = widths.map(w => `${w}%`).join(' ');

    const rowStyle = this.inlineStyle({
      display: 'grid',
      'grid-template-columns': template,
      width: '100%',
      'box-sizing': 'border-box',
      'background-color': row.backgroundColor ?? undefined
      // No fixed height: content drives height
    });

    const cells = row.cells.map(cell => this.renderCell(cell)).join('');

    return `<div class="p2h-row" style="${rowStyle}">
  ${cells}
</div>`;
  }

  private renderCell(cell: Cell): string {
    const a: CellAttrs = {
      paddingTop: cell?.attrs?.paddingTop ?? 0,
      paddingRight: cell?.attrs?.paddingRight ?? 0,
      paddingBottom: cell?.attrs?.paddingBottom ?? 0,
      paddingLeft: cell?.attrs?.paddingLeft ?? 0,
      borderTop: cell?.attrs?.borderTop ?? 0,
      borderRight: cell?.attrs?.borderRight ?? 0,
      borderBottom: cell?.attrs?.borderBottom ?? 0,
      borderLeft: cell?.attrs?.borderLeft ?? 0,
      borderColor: cell?.attrs?.borderColor ?? '#bbb',
      backgroundColor: cell?.attrs?.backgroundColor ?? '#fff'
    };

    const borders = this.bordersCss(a);
    const cellStyle = this.inlineStyle({
      'box-sizing': 'border-box',
      display: 'block',
      padding: this.paddingCss(a),
      ...borders,
      'background-color': a.backgroundColor,
      'word-break': 'break-word',
      'overflow-wrap': 'anywhere'
    });

    const content = this.renderCellContent(cell);
    return `<div class="p2h-cell" style="${cellStyle}">${content}</div>`;
  }

  private renderCellContent(cell: Cell): string {
    // NEW: chart support
    if ((cell as any).type === 'chart' && cell.chartBlock?.imageBase64) {
      const cb = (cell as any).chartBlock as ChartBlock;
      const src = this.imageSrcFromChart(cb);
      const styleObj: Record<string, string | number | undefined> = {
        display: 'block',
        'max-width': '100%',
        width: cb?.width ? `${Math.max(1, Math.min(100, Number(cb.width) || 0))}%` : '100%',
      };

      if (cb?.alignment === 'center') {
        styleObj['margin-left'] = 'auto';
        styleObj['margin-right'] = 'auto';
      } else if (cb?.alignment === 'right') {
        styleObj['margin-left'] = 'auto';
      }

      const style = this.inlineStyle(styleObj);

      return `<figure class="p2h-chart">
  <img src="${src}" style="${style}">
</figure>`;
    }

    // Existing image support
    if (cell.type === 'image' && cell.imageBlock?.imageBase64) {
      const src = this.imageSrcFromBlock(cell.imageBlock);
      const styleObj: Record<string, string | number | undefined> = {
        display: 'block',
        width: cell.imageBlock?.width ? `${Math.max(1, Math.min(100, Number(cell.imageBlock.width) || 0))}%` : '100%',
      };

      const a = cell.imageBlock.alignment;
      if (a === 'center') {
        styleObj['margin-left'] = 'auto';
        styleObj['margin-right'] = 'auto';
      } else if (a === 'right') {
        styleObj['margin-left'] = 'auto';
      }

      const style = this.inlineStyle(styleObj);
      const alt = this.escapeHtml(cell.imageBlock.filename || 'image');
      return `<img src="${src}" alt="${alt}" style="${style}">`;
    }

    // Existing barcode support
    if (cell.type === 'barcode' && cell.barcodeBlock?.imageBase64) {
      const src = this.imageSrcFromBlock(cell.barcodeBlock);
      const styleObj: Record<string, string | number | undefined> = {
        display: 'block',
        width: cell.barcodeBlock?.width ? `${Math.max(1, Math.min(100, Number(cell.barcodeBlock.width) || 0))}%` : '100%',
      };

      // Alignment via margins
      const a = cell.barcodeBlock.alignment;
      if (a === 'center') {
        styleObj['margin-left'] = 'auto';
        styleObj['margin-right'] = 'auto';
      } else if (a === 'right') {
        styleObj['margin-left'] = 'auto';
      }

      const style = this.inlineStyle(styleObj);
      const alt = this.escapeHtml(cell.barcodeBlock.filename || 'image');
      return `<img src="${src}" alt="${alt}" style="${style}">`;
    }

    // Default: use editor HTML but fix Quill alignment classes
    if (cell.value) {
      try {
        const doc = new DOMParser().parseFromString(cell.value, 'text/html');

        doc.querySelectorAll('[class*="ql-align-"]').forEach(el => {
          const cls = Array.from(el.classList).find(c => c.startsWith('ql-align-'));
          if (cls) {
            const align = cls.replace('ql-align-', '');
            const existing = el.getAttribute('style') || '';
            el.setAttribute('style', `${existing}; text-align: ${align};`);
          }
        });

        return doc.body.innerHTML;
      } catch (e) {
        console.warn('Failed to parse HTML for alignment', e);
        return cell.value;
      }
    }

    return '';
  }

  // -----------------------
  // CSS & utils
  // -----------------------

  private baseCss(scopeClass: string): string {
    return `
.${scopeClass}--page-view .${scopeClass}__canvas {
  min-height: 100vh;
  padding: 32px 16px;                 /* space around the page */
  box-sizing: border-box;
  background: #f6f7f9;                /* soft app/canvas bg */
  font-size: 110%;                     /* increase all fonts by 10% */
  line-height: 1.35;                   /* tighter default line spacing */
}

/* Page wrapper */
.${scopeClass}--page-view .${scopeClass}__page {
  max-width: 900px;                   /* page width */
  margin: 0 auto;
  padding: 24px;                      /* default; inline style can override */
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.08); /* small border */
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08),
              0  2px  8px rgba(0,0,0,0.06);
  font-size: 110%;                     /* ensure page-level font increase */
  line-height: 1.35;                   /* consistent tighter spacing */
}

/* Reset paragraph spacing inside cells to prevent huge gaps */
.${scopeClass}--page-view .p2h-cell p {
  margin: 0 0 8px 0;                   /* small bottom margin between paragraphs */
  padding: 0;
  line-height: 1.35;                   /* consistent line spacing */
  font-size: 12px;                      /* default if not specified */
}

/* Section rhythm when in page view */
.${scopeClass}--page-view [data-section="header"] { margin-bottom: 16px; }
.${scopeClass}--page-view [data-section="footer"] { margin-top: 16px; }

/* Keep rows/cells from splitting awkwardly when printing */
@media print {
  .${scopeClass}--page-view .${scopeClass}__canvas {
    padding: 0;
    background: #ffffff;
  }
  .${scopeClass}--page-view .${scopeClass}__page {
    max-width: none;
    margin: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
  .${scopeClass} .p2h-row { break-inside: avoid; page-break-inside: avoid; }
}

/* Small screens: soften spacing/radius a bit */
@media (max-width: 640px) {
  .${scopeClass}--page-view .${scopeClass}__canvas { padding: 16px 8px; }
  .${scopeClass}--page-view .${scopeClass}__page { border-radius: 8px; }
}

/* Optional: page margins for print output */
@page { margin: 15mm; }
`.trim();
  }


  /** Make padding CSS from CellAttrs. */
  private paddingCss(a: CellAttrs): string {
    const pt = this.safeInt(a.paddingTop);
    const pr = this.safeInt(a.paddingRight);
    const pb = this.safeInt(a.paddingBottom);
    const pl = this.safeInt(a.paddingLeft);
    return `${pt}px ${pr}px ${pb}px ${pl}px`;
  }

  /** Side-specific borders only when > 0. */
  private bordersCss(a: CellAttrs): Record<string, string | undefined> {
    const color = a.borderColor ?? '#bbb';
    const side = (v?: number) => {
      const n = this.safeInt(v);
      return n > 0 ? `${n}px solid ${color}` : undefined;
    };
    return {
      'border-top': side(a.borderTop),
      'border-right': side(a.borderRight),
      'border-bottom': side(a.borderBottom),
      'border-left': side(a.borderLeft)
    };
  }

  private inlineStyle(style: Record<string, string | number | undefined>): string {
    return Object.entries(style)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
  }

  private defaultWidths(count: number): number[] {
    if (count <= 0) return [];
    const equal = 100 / count;
    return Array(count).fill(equal);
  }

  /** Normalize widths: pad/trim to cellCount and scale to sum 100%. */
  private normalizeWidths(widths: number[] | undefined, cellCount: number): number[] {
    if (!cellCount || cellCount < 1) return [];
    let w = Array.isArray(widths) && widths.length ? widths.slice(0, cellCount) : [];

    // If too few, distribute the remaining percentage equally
    if (w.length < cellCount) {
      const missing = cellCount - w.length;
      const current = w.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
      const remaining = Math.max(0, 100 - current);
      const fill = remaining / (missing || 1);
      for (let i = 0; i < missing; i++) w.push(fill);
    }

    // If none provided, fallback to equal columns
    if (w.length === 0) {
      return this.defaultWidths(cellCount);
    }

    // Scale to 100% (protect against tiny rounding drift)
    const sum = w.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
    const factor = sum > 0 ? (100 / sum) : (100 / (w.length || 1));
    w = w.map(v => this.clampPct((Number.isFinite(v) ? v : 0) * factor));

    // Final rounding pass to 4 decimals and correction to exactly 100
    const rounded = w.map(v => Math.max(0, Math.min(100, Number(v.toFixed(4)))));
    const diff = 100 - rounded.reduce((a, b) => a + b, 0);
    if (Math.abs(diff) > 0.0001) {
      // Nudge the last column to fix float residue
      rounded[rounded.length - 1] = this.clampPct(rounded[rounded.length - 1] + diff);
    }

    return rounded;
  }

  private clampPct(v: number): number { return Math.max(0, Math.min(100, v)); }

  private pxOrUndefined(v?: number): string | undefined {
    if (typeof v === 'number' && !isNaN(v)) return `${v}px`;
    return undefined;
  }

  private safeInt(v?: number): number {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
  }

  private escapeHtml(s: string): string {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  private fourSidePadding(top?: number, right?: number, bottom?: number, left?: number): string | undefined {
    const hasAny = [top, right, bottom, left].some(v => typeof v === 'number');
    if (!hasAny) return undefined;
    const t = this.safeInt(top);
    const r = this.safeInt(right);
    const b = this.safeInt(bottom);
    const l = this.safeInt(left);
    return `${t}px ${r}px ${b}px ${l}px`;
  }

  // -----------------------
  // Image helpers
  // -----------------------

  private imageSrcFromBlock(img: ImageBlock | BarcodeBlock): string {
    if (img.imageBase64.startsWith('data:')) return img.imageBase64;
    const mime = this.mimeFromFilename(img.filename) ?? 'image/png';
    return `data:${mime};base64,${img.imageBase64}`;
  }

  // NEW: chart image helper (accept data URL or raw base64)
  private imageSrcFromChart(chart: ChartBlock): string {
    const b64 = chart?.imageBase64 ?? '';
    if (b64.startsWith('data:')) return b64;
    // ECharts getDataURL returns a full data URL; this is a fallback if only raw base64 is stored.
    return `data:image/png;base64,${b64}`;
  }

  private mimeFromFilename(name?: string): string | undefined {
    if (!name) return undefined;
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png': return 'image/png';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      case 'svg': return 'image/svg+xml';
      default: return undefined;
    }
  }
}
