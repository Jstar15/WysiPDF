import { Injectable } from '@angular/core';
import { Page, Grid, Row, Cell, CellAttrs, ImageBlock } from '../models/interfaces';

export interface PageToHtmlOptions {
  includeBaseStyles?: boolean;
  rootClass?: string; // default: 'p2h-root'
  page?: {
    width?: string;       // e.g. '100%' or '900px'
    margin?: string;      // e.g. '0 auto'
    background?: string;  // fallback if pageAttrs.backgroundColor missing
    padding?: string;     // fallback if pageAttrs margins missing
    fontFamily?: string;  // fallback if pageAttrs.defaultFont missing
  };
}

@Injectable({ providedIn: 'root' })
export class PageToHtmlService {
  /** Convert a full Page into an HTML string (no <!doctype>, just markup). */
  public toHtmlString(page: Page, opts?: PageToHtmlOptions): string {
    const rootClass = opts?.rootClass ?? 'p2h-root';
    const styleTag = (opts?.includeBaseStyles ?? true)
      ? `<style>${this.baseCss(rootClass)}</style>`
      : '';

    const p = page.pageAttrs ?? {};
    const paddingFromMargins = this.fourSidePadding(p.marginTop, p.marginRight, p.marginBottom, p.marginLeft);

    const wrapperStyle = this.inlineStyle({
      width: opts?.page?.width ?? '100%',
      margin: opts?.page?.margin ?? undefined,
      'box-sizing': 'border-box',
      padding: paddingFromMargins ?? opts?.page?.padding ?? undefined,
      'background-color': p.backgroundColor ?? opts?.page?.background ?? undefined,
      'font-family': p.defaultFont ?? opts?.page?.fontFamily ?? undefined
    });

    const headerHtml   = page.header ? this.renderSection('header',  page.header, p.headerMargin) : '';
    const contentHtml  = page.content ? this.renderSection('content', page.content) : '';
    const partialsHtml = Array.isArray(page.partialContent) && page.partialContent.length
      ? page.partialContent.map(g => this.renderSection('partial', g)).join('')
      : '';
    const footerHtml   = page.footer ? this.renderSection('footer',  page.footer, p.footerMargin) : '';

    return `
${styleTag}
<div class="${rootClass}" style="${wrapperStyle}">
  ${headerHtml}
  ${contentHtml}
  ${partialsHtml}
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

  public toHtmlBlob(page: Page, opts?: PageToHtmlOptions & { title?: string }): Blob {
    const html = this.toHtmlDocument(page, opts);
    return new Blob([html], { type: 'text/html;charset=utf-8' });
  }

  public downloadHtml(page: Page, filename = 'page.html', opts?: PageToHtmlOptions & { title?: string }): void {
    const blob = this.toHtmlBlob(page, opts);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
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
    if (cell.type === 'image' && cell.imageBlock?.imageBase64) {
      const src = this.imageSrcFromBlock(cell.imageBlock);
      const styleObj: Record<string, string | number | undefined> = {
        display: 'block',
        'max-width': '100%',
      };

      // Alignment via margins
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

    // Use the editor HTML as-is (tables, headings, fonts, etc.)
    return cell.value ?? '';
  }

  // -----------------------
  // CSS & utils
  // -----------------------

  private baseCss(scopeClass: string): string {
    return `
.${scopeClass} { width: 100%; display: block; }
.${scopeClass} .p2h-section { width: 100%; box-sizing: border-box; }
.${scopeClass} .p2h-row { width: 100%; box-sizing: border-box; }
.${scopeClass} .p2h-cell { box-sizing: border-box; }
.${scopeClass} .p2h-cell img { max-width: 100%; height: auto; display: block; }

/* Quill minimal shims so exported HTML matches editor look */
.${scopeClass} .ql-align-center { text-align: center; }
.${scopeClass} .ql-align-right  { text-align: right; }
.${scopeClass} .ql-align-justify{ text-align: justify; }
.${scopeClass} .ql-font-raleway { font-family: Raleway, Arial, sans-serif; }
.${scopeClass} .ql-font-roboto { font-family: Roboto, Arial, sans-serif; }
.${scopeClass} .ql-font-nunito { font-family: Nunito, Arial, sans-serif; }
.${scopeClass} .ql-font-cormorant { font-family: Cormorant, serif; }
.${scopeClass} .ql-font-opensans { font-family: "Open Sans", Arial, sans-serif; }

/* Optional page break support for print */
.${scopeClass} .p2h-page-break { display: block; page-break-after: always; }

@media print {
  .${scopeClass} { width: 100%; }
}
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

  private imageSrcFromBlock(img: ImageBlock): string {
    if (img.imageBase64.startsWith('data:')) return img.imageBase64;
    const mime = this.mimeFromFilename(img.filename) ?? 'image/png';
    return `data:${mime};base64,${img.imageBase64}`;
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
