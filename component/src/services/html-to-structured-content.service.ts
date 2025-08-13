import { Injectable } from '@angular/core';
import {
  HtmlAttributes,
  HtmlBasicElement,
  HtmlBlock,
  HtmlBlockContainer,
  HtmlTableBlock,
  HtmlTableRow,
  HtmlTableCell,
  HtmlTokenElement,
  Page
} from "../models/interfaces";

/**
 * HtmlToStructuredContentService
 *
 * This service parses HTML content—typically generated from QuillJS editor output—
 * into a structured intermediate object format (`HtmlBlockContainer`) used by the app.
 *
 * It supports rich text formatting, custom elements (like custom tokens), and basic table structures.
 * The resulting object is used as a normalized content model for rendering, editing, or converting to PDF.
 */
@Injectable({ providedIn: 'root' })
export class HtmlToStructuredContentService {
  parseHtmlToStructuredObject(html: string): HtmlBlockContainer {
    const container: HtmlBlockContainer = { blocks: [] };
    const root = document.createElement('div');
    root.innerHTML = html;

    root.childNodes.forEach(node => {
      const tag = (node as HTMLElement)?.tagName?.toLowerCase();

      switch (tag) {
        case 'table':
          if (node.nodeType === Node.ELEMENT_NODE) {
            const table = this.parseTable(node as HTMLElement);
            container.blocks.push(table);
          }
          break;
        case 'ul':
        case 'ol':
          if (node.nodeType === Node.ELEMENT_NODE) {
            const listBlocks = this.parseListBlock(node as HTMLElement, tag);
            container.blocks.push(...listBlocks);
          }
          break;

        case 'p':
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'li':
        case 'div':
          if (node.nodeType === Node.ELEMENT_NODE) {
            const block = this.parseBlock(node as HTMLElement);
            container.blocks.push(block);
          }
          break;

        default:
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains('ql-mathjax')) {
            const el = node as HTMLElement;
            const dataValue = el.dataset['value'] ?? '';
            const childAttrs: HtmlAttributes = this.extractAttributes(el, el.className);
            childAttrs.value = dataValue;
            childAttrs.type = 'token';
            childAttrs.currentColumnName = el.dataset['name'] ?? undefined;
            childAttrs.isCustomElement = true;

            container.blocks.push({
              blockType: 'span',
              alignment: 'left',
              elements: [{ value: 'test', attributes: childAttrs, type: 'token' }]
            });
          }
      }
    });

    return container;
  }

  private parseBlock(blockEl: HTMLElement): HtmlBlock {
    const elements: HtmlBasicElement[] = [];
    const blockType = blockEl.tagName.toLowerCase();

    const classAlign = this.getAlignmentFromClass(blockEl.className);
    const inlineAlign = blockEl.style.textAlign;
    const alignment = inlineAlign || classAlign || 'left';

    const parseNodeRecursively = (
      node: Node,
      inheritedAttrs: HtmlAttributes,
      inheritedClass: string
    ) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text) {
          elements.push({
            value: text,
            attributes: {
              ...inheritedAttrs,
              align: inheritedAttrs.align || alignment
            },
            type: 'text'
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const combinedClass = [inheritedClass, el.className].filter(Boolean).join(' ');
        // 🔧 Use extractAttributes with inheritance
        const mergedAttrs = this.extractAttributes(el, combinedClass, inheritedAttrs);

        if (el.classList.contains('ql-mathjax')) {
          const dsVal = el.dataset['value']?.trim();
          mergedAttrs.value = dsVal && dsVal.length
            ? dsVal
            : (el.textContent ?? '');
          mergedAttrs.type = el.dataset['type'] ?? undefined;
          mergedAttrs.currentColumnName = el.dataset['name'] ?? undefined;
          mergedAttrs.isCustomElement = true;
          mergedAttrs.isMergeField = true;

          elements.push({
            value: mergedAttrs.value!,
            attributes: mergedAttrs,
            type: 'token'
          });
          return;
        }

        el.childNodes.forEach(child => parseNodeRecursively(child, mergedAttrs, combinedClass));
      }
    };

    blockEl.childNodes.forEach(child =>
      parseNodeRecursively(child, this.getDefaultAttributes(), blockEl.className)
    );

    return { elements, blockType, alignment };
  }

  private parseTable(tableEl: HTMLElement): HtmlTableBlock {
    const rows: HtmlTableRow[] = [];
    const rowEls = Array.from(tableEl.querySelectorAll('tr'));

    for (const rowEl of rowEls) {
      const cells: HtmlTableCell[] = [];
      const cellEls = Array.from(rowEl.querySelectorAll('td,th'));

      for (const cellEl of cellEls) {
        const elements: HtmlBasicElement[] = [];
        this.parseTableCellContent(cellEl, elements, this.getDefaultAttributes(), cellEl.className);
        cells.push({ elements });
      }

      rows.push({ cells });
    }

    return {
      blockType: 'table',
      rows
    };
  }

  private parseTableCellContent(
    node: Node,
    elements: HtmlBasicElement[],
    inheritedAttrs: HtmlAttributes,
    inheritedClass: string
  ): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      elements.push({
        value: text,
        attributes: { ...inheritedAttrs },
        type: 'text'
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const combinedClass = [inheritedClass, el.className].filter(Boolean).join(' ');
      // 🔧 Use extractAttributes with inheritance
      const mergedAttrs = this.extractAttributes(el, combinedClass, inheritedAttrs);

      if (el.classList.contains('ql-mathjax')) {
        const dsVal = el.dataset['value'];
        mergedAttrs.value = dsVal && dsVal.length
          ? dsVal
          : (el.textContent ?? '');
        mergedAttrs.type = el.dataset['type'] ?? undefined;
        mergedAttrs.currentColumnName = el.dataset['name'] ?? undefined;
        mergedAttrs.isCustomElement = true;
        mergedAttrs.isMergeField = true;

        const htmlTokenElement: HtmlTokenElement = {
          key: el.dataset['name'] ?? undefined,
          type: el.dataset['type'] ?? undefined
        };
        elements.push({
          value: mergedAttrs.value!,
          attributes: mergedAttrs,
          type: 'token',
          token: htmlTokenElement
        });
        return;
      }

      el.childNodes.forEach(child => {
        this.parseTableCellContent(child, elements, mergedAttrs, combinedClass);
      });
    }
  }

  private extractAttributes(
    el: HTMLElement,
    fullClassName: string = '',
    inheritedAttrs: HtmlAttributes = {}
  ): HtmlAttributes {
    const tag = el.tagName.toLowerCase();
    const rgbColor = el.style.color;
    const bgColor = el.style.backgroundColor;

    // Start with inherited attributes
    const result: HtmlAttributes = { ...inheritedAttrs };

    if (tag === 'strong' || el.style.fontWeight === 'bold' || el.style.fontWeight === '700') {
      result.bold = 'true';
    }

    if (tag === 'em' || el.style.fontStyle === 'italic') {
      result.italic = 'true';
    }

    if (tag === 'u' || el.style.textDecoration?.includes('underline')) {
      result.underline = 'true';
    }

    // Only override size if explicitly defined
    if (el.style.fontSize) {
      const sizeMatch = el.style.fontSize.match(/(\d+)px/);
      if (sizeMatch) {
        result.size = parseInt(sizeMatch[1], 10);
      }
    }

    const align = el.style.textAlign || this.getAlignmentFromClass(fullClassName);
    if (align) {
      result.align = align;
    }

    if (rgbColor) {
      result.color = this.rgbToHex(rgbColor);
    }

    if (bgColor) {
      result.background = this.rgbToHex(bgColor);
    }

    const font = this.getFontFromClass(fullClassName) || el.style.fontFamily;
    if (font) {
      result.font = font;
    }

    return result;
  }

  private getDefaultAttributes(): HtmlAttributes {
    return {
      bold: 'false',
      italic: 'false',
      underline: 'false',
      size: 14,
      font: 'Roboto'
    };
  }

  private getAlignmentFromClass(className: string): string | undefined {
    if (className.includes('ql-align-center')) return 'center';
    if (className.includes('ql-align-right')) return 'right';
    if (className.includes('ql-align-justify')) return 'justify';
    return undefined;
  }

  private rgbToHex(rgb: string): string {
    const match = rgb.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/);
    if (!match) return rgb;

    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  public convertHTmlToObject(html: string) {
    try {
      const parsed = this.parseHtmlToStructuredObject(html);
      return parsed && Array.isArray(parsed.blocks) ? parsed : { blocks: [] };
    } catch (err) {
      console.warn('Failed to parse HTML:', err);
      return { blocks: [] };
    }
  }

  private parseListBlock(listEl: HTMLElement, listType: 'ul' | 'ol'): HtmlBlock[] {
    const blocks: HtmlBlock[] = [];
    listEl.querySelectorAll('li').forEach(li => {
      const block = this.parseBlock(li);
      block.listType = listType;
      blocks.push(block);
    });
    return blocks;
  }

  public updatePageHtmlToObject(page: Page): Page {
    for (let row of page.header.rows) {
      for (let cell of row.cells) {
        cell.block = this.convertHTmlToObject(cell.value);
      }
    }
    for (let row of page.content.rows) {
      for (let cell of row.cells) {
        cell.block = this.convertHTmlToObject(cell.value);
      }
    }
    for (let row of page.footer.rows) {
      for (let cell of row.cells) {
        cell.block = this.convertHTmlToObject(cell.value);
      }
    }
    for (let partial of page.partialContent) {
      for (let row of partial.rows) {
        for (let cell of row.cells) {
          cell.block = this.convertHTmlToObject(cell.value);
        }
      }
    }
    return page;
  }

  private getFontFromClass(className: string): string | undefined {
    const match = className.match(/ql-font-([a-zA-Z0-9_-]+)/);
    if (match) {
      const fontName = match[1];
      const fontMap: Record<string, string> = {
        raleway: 'Raleway',
        roboto: 'Roboto',
        nunito: 'Nunito',
        cormorant: 'Cormorant',
        opensans: 'OpenSans'
      };
      return fontMap[fontName.toLowerCase()] || undefined;
    }
    return undefined;
  }
}
