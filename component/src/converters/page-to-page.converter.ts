import { Injectable } from '@angular/core';
import { Page, Row } from '../models/page';
import { HtmlToStructuredContentConverter } from './html-to-structured-content.converter';
import { TokenAttribute } from '../models/token-attribute';
import {TokenReplacerUtility} from "../utils/token-replacer.utility";
import {DisplayLogicUtility} from "../utils/display-logic.utility";
import {Converter} from "./converter";
import {RepeatableContentExpanderService} from "../services/RepeatableContentExpanderService";

@Injectable({ providedIn: 'root' })
export class PageToPageConverter  implements Converter<Page, Page, TokenAttribute[]> {
  constructor(
    private htmlToStructuredContentService: HtmlToStructuredContentConverter,
    private tokenReplacerUtility: TokenReplacerUtility,
    private displayLogicUtility : DisplayLogicUtility,
    private repeatableContentExpanderService : RepeatableContentExpanderService
  ) {}

  /**
   * Runs all "page" transformations, independent of any PDF engine.
   */
  public convert(page: Page, tokenAttributeList: TokenAttribute[]): Page {
    // deep copy so we never mutate the caller's object
    page = this.deepCopy(page);

    // 1) convert inline HTML in cells to structured content your pipeline understands
    page = this.htmlToStructuredContentService.convert(page);

    // 2) expand tokenized/partial sections
    page = this.repeatableContentExpanderService.expandRepeatables(page, tokenAttributeList);

    // 3) normalize row background colors to match page background
    page = this.updateRowColorToMatchPageBackgroundColor(page);

    // 4) clean header/footer: remove explicit row heights
    page = this.cleanHeaderFooter(page);

    // 5) Replace tokens
    page.header.rows = this.tokenReplacerUtility.replaceTokensInRows(page.header.rows, tokenAttributeList);
    page.footer.rows = this.tokenReplacerUtility.replaceTokensInRows(page.footer.rows, tokenAttributeList);
    page.content.rows = this.tokenReplacerUtility.replaceTokensInRows(page.content.rows, tokenAttributeList);

    // 6) Evaluate display logic show / hide
    page.header.rows = this.displayLogicUtility.evaluateAllRows(page.header.rows, tokenAttributeList);
    page.footer.rows = this.displayLogicUtility.evaluateAllRows(page.footer.rows, tokenAttributeList);
    page.content.rows = this.displayLogicUtility.evaluateAllRows(page.content.rows, tokenAttributeList);

    return page;
  }

  private deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private cleanHeaderFooter(page: Page): Page {
    // header
    if (page.header?.rows) {
      for (let i = 0; i < page.header.rows.length; i++) {
        const row = page.header.rows[i] as Row & { height?: number };
        if (row && 'height' in row) {
          delete (row as any).height;
        }
      }
    }

    // footer
    if (page.footer?.rows) {
      for (let i = 0; i < page.footer.rows.length; i++) {
        const row = page.footer.rows[i] as Row & { height?: number };
        if (row && 'height' in row) {
          delete (row as any).height;
        }
      }
    }

    return page;
  }

  private updateRowColorToMatchPageBackgroundColor(page: Page): Page {
    const bg = page.pageAttrs?.backgroundColor ?? 'white';

    if (page.header?.rows) {
      for (let i = 0; i < page.header.rows.length; i++) {
        page.header.rows[i].backgroundColor = bg;
      }
    }

    if (page.content?.rows) {
      for (let i = 0; i < page.content.rows.length; i++) {
        page.content.rows[i].backgroundColor = bg;
      }
    }

    if (page.footer?.rows) {
      for (let i = 0; i < page.footer.rows.length; i++) {
        page.footer.rows[i].backgroundColor = bg;
      }
    }

    return page;
  }
}
