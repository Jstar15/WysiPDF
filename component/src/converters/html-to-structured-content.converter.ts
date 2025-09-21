import { HtmlBlock, HtmlBasicElement, HtmlAttributes, HtmlTokenElement, Page } from "../models/page";
import { Injectable } from "@angular/core";
import { Converter } from "./converter";
import * as cheerio from "cheerio";

@Injectable()
export class HtmlToStructuredContentConverter implements Converter<Page, Page> {

  convert(page: Page): Page {
    ['header', 'header2', 'content', 'footer'].forEach(sectionName => {
      const section = page[sectionName];
      section.rows.forEach(row => {
        row.cells.forEach(cell => {
          cell.block = this.convertHtmlToObject(cell.value);
        });
      });
    });
    return page;
  }

  convertHtmlToObject(html: string) {
    try {
      const parsed = this.parseHtmlToStructuredObject(html);
      return parsed && Array.isArray(parsed.blocks) ? parsed : { blocks: [] };
    } catch (err) {
      console.warn('Failed to parse HTML:', err);
      return { blocks: [] };
    }
  }

  private parseHtmlToStructuredObject(html: string) {
    const container = { blocks: [] };
    const $ = cheerio.load(`<div>${html}</div>`);

    $('div').contents().each((_, node) => {
      const el = $(node);

      if (el.is('table')) {
        container.blocks.push(this.parseTable(el, $));
      } else if (el.is('ul, ol')) {
        container.blocks.push(...this.parseListBlock(el, $));
      } else {
        container.blocks.push(this.parseBlock(el, $));
      }
    });

    return container;
  }

  private parseBlock(el: any, $: any) {
    const elements: HtmlBasicElement[] = [];
    const blockType = el[0]?.tagName?.toLowerCase() || 'div';
    const alignment = el.css('text-align') || this.getAlignmentFromClass(el.attr('class')) || 'left';

    const parseNodeRecursively = (node: any, inheritedAttrs: HtmlAttributes = {}) => {
      if (node.type === 'text') {
        if (node.data.trim()) {
          elements.push({ value: node.data, attributes: inheritedAttrs, type: 'text' });
        }
      } else if (node.type === 'tag') {
        const $node = $(node);
        const attrs = this.extractAttributes($node, inheritedAttrs);

        // ✅ Token detection anywhere in the element's ancestors
        const tokenEl = $node.closest('.ql-mathjax');
        if (tokenEl && tokenEl.length) {
          elements.push(this.createTokenElement(tokenEl.first()));
          return;
        }

        if ($node.is('br')) {
          elements.push({ value: '\n', attributes: attrs, type: 'text' });
          return;
        }

        if ($node.is('a')) {
          const href = $node.attr('href') || '';
          elements.push({
            value: $node.text(),
            attributes: attrs,
            type: 'hyperlink',
            hyperlink: { name: $node.text(), link: href }
          });
          return;
        }

        $node.contents().each((_, child) => parseNodeRecursively(child, attrs));
      }
    };

    el.contents().each((_, child) => parseNodeRecursively(child));
    return { elements, blockType, alignment };
  }

  private parseTable(el: any, $: any) {
    const rows = [];
    el.find('tr').each((_, rowEl) => {
      const $row = $(rowEl);
      const cells = [];
      $row.find('td, th').each((_, cellEl) => {
        const elements: HtmlBasicElement[] = [];
        this.parseTableCellContent($(cellEl), elements, $);
        cells.push({ elements });
      });
      rows.push({ blockType: 'table-row', elements: [], alignment: 'left', cells });
    });
    return { blockType: 'table', elements: [], alignment: 'left', rows };
  }

  private parseTableCellContent(el: any, elements: HtmlBasicElement[], $: any, inheritedAttrs: HtmlAttributes = {}) {
    el.contents().each((_, child) => {
      if (child.type === 'text') {
        if (child.data.trim()) elements.push({ value: child.data, attributes: inheritedAttrs, type: 'text' });
      } else if (child.type === 'tag') {
        const $child = $(child);
        const attrs = this.extractAttributes($child, inheritedAttrs);

        const tokenEl = $child.closest('.ql-mathjax');
        if (tokenEl && tokenEl.length) {
          elements.push(this.createTokenElement(tokenEl.first()));
        } else {
          this.parseTableCellContent($child, elements, $, attrs);
        }
      }
    });
  }

  private parseListBlock(el: any, $: any) {
    const blocks = [];
    const listType = el[0]?.tagName?.toLowerCase() || 'ul';
    el.find('li').each((_, li) => {
      const block: any = this.parseBlock($(li), $);
      block.listType = listType;
      blocks.push(block);
    });
    return blocks;
  }

  private createTokenElement(el: any): HtmlBasicElement {
    const attrs: HtmlAttributes = this.extractAttributes(el, {});
    attrs.isCustomElement = true;

    const dataValue = el.attr('data-value') || '';
    const decodedValue = this.decodeHtmlEntities(dataValue) || el.text();
    const type = el.attr('data-type') || undefined;
    const currentColumnName = el.attr('data-name') || undefined;

    const tokenElement: HtmlTokenElement = { key: currentColumnName, type: type };

    return { value: decodedValue, attributes: attrs, type: 'token', token: tokenElement };
  }

  private decodeHtmlEntities(str: string): string {
    return str.replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  private extractAttributes(el: any, inheritedAttrs: HtmlAttributes = {}): HtmlAttributes {
    const result: HtmlAttributes = { ...inheritedAttrs };
    const tagName = el[0]?.tagName?.toLowerCase();
    const color = el.css('color');
    const bg = el.css('background-color');
    const fontWeight = el.css('font-weight');
    const fontStyle = el.css('font-style');
    const textDecoration = el.css('text-decoration');
    const fontSize = el.css('font-size');
    const textAlign = el.css('text-align');
    const className = el.attr('class') || '';

    if (color) result.color = this.rgbToHex(color);
    if (bg) result.background = this.rgbToHex(bg);
    if (fontWeight && fontWeight !== 'normal') result.bold = 'true';
    if (fontStyle && fontStyle !== 'normal') result.italic = 'true';
    if (textDecoration?.includes('underline')) result.underline = 'true';
    if (fontSize) {
      const match = fontSize.match(/(\d+)px/);
      if (match) result.size = parseInt(match[1], 10);
    }
    if (textAlign) result.align = textAlign;
    else result.align = this.getAlignmentFromClass(className) || 'left';

    if (tagName === 'strong' || tagName === 'b') result.bold = 'true';
    if (tagName === 'em' || tagName === 'i') result.italic = 'true';
    if (tagName === 'u') result.underline = 'true';

    const fontMatch = className.match(/ql-font-([a-zA-Z0-9_-]+)/);
    if (fontMatch) {
      const fontMap: Record<string, string> = {
        raleway: 'Raleway',
        roboto: 'Roboto',
        nunito: 'Nunito',
        cormorant: 'Cormorant'
      };
      result.font = fontMap[fontMatch[1].toLowerCase()] || undefined;
    }

    return result;
  }

  private getAlignmentFromClass(className: string | null | undefined): string | undefined {
    const cls = className || ''; // ✅ ensure it's always a string
    if (cls.includes('ql-align-center')) return 'center';
    if (cls.includes('ql-align-right')) return 'right';
    if (cls.includes('ql-align-justify')) return 'justify';
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
}
