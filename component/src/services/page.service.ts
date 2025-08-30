import { Injectable } from '@angular/core';
import { Page, Row } from '../models/interfaces';
import { PartialContentExpanderService } from './partial-content-expander.service';
import { HtmlToStructuredContentService } from './html-to-structured-content.service';
import { TokenAttribute } from '../models/TokenAttribute';
import {TokenReplacerService} from "./token-replacer.service";
import {DisplayLogicService} from "./display-logic.service";

@Injectable({ providedIn: 'root' })
export class PageService {
  constructor(
    private partialContentExpander: PartialContentExpanderService,
    private htmlToStructuredContentService: HtmlToStructuredContentService,
    private tokenReplacerService: TokenReplacerService,
    private displayLogicService : DisplayLogicService
  ) {}

  /**
   * Runs all "page" transformations, independent of any PDF engine.
   */
  public processPage(page: Page, tokenAttributeList: TokenAttribute[]): Page {
    // deep copy so we never mutate the caller's object
    page = this.deepCopy(page);

    // 1) convert inline HTML in cells to structured content your pipeline understands
    page = this.htmlToStructuredContentService.updatePageHtmlToObject(page);

    // 2) expand tokenized/partial sections
    page = this.partialContentExpander.insertPartialContent(page, tokenAttributeList);

    // 3) normalize row background colors to match page background
    page = this.updateRowColorToMatchPageBackgroundColor(page);

    // 4) clean header/footer: remove explicit row heights
    page = this.cleanHeaderFooter(page);

    // 5) Replace tokens
    page.header.rows = this.tokenReplacerService.replaceTokensInRow(page.header.rows, tokenAttributeList);
    page.footer.rows = this.tokenReplacerService.replaceTokensInRow(page.footer.rows, tokenAttributeList);
    page.content.rows = this.tokenReplacerService.replaceTokensInRow(page.content.rows, tokenAttributeList);

    // 6) Evaluate display logic show / hide
    page.header.rows = this.displayLogicService.evaulateCells(page.header.rows, tokenAttributeList);
    page.footer.rows = this.displayLogicService.evaulateCells(page.footer.rows, tokenAttributeList);
    page.content.rows = this.displayLogicService.evaulateCells(page.content.rows, tokenAttributeList);

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
