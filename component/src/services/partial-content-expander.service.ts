import { Injectable } from '@angular/core';
import { Grid, Page, Row } from '../models/page';
import { TokenAttribute } from '../models/token-attribute';
import { TokenReplacerUtility } from '../utils/token-replacer.utility';
import { JsonTokenParserUtility } from '../utils/json-token-parser.utility';
import {TokenHtmlReplacerService} from "../utils/token-html-cell-replacer.utility";

@Injectable({ providedIn: 'root' })
export class PartialContentExpanderService {
  constructor(
    private jsonTokenParserService: JsonTokenParserUtility,
    private tokenReplacerService: TokenReplacerUtility,
    private tokenHtmlReplacerService : TokenHtmlReplacerService
  ) {}

  /**
   * Expand header, content, and footer grids on the page.
   */
  public insertPartialContent(page: Page, tokenAttributeList?: TokenAttribute[]): Page {
    // shallow copy so splice() won’t break our loop
    const rows = [...page.content.rows];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (row.type === 'partial-content') {
        const partialRows: Row[] = this.fetchPartialPage(row.partialContent.name, page.partialContent).rows;

        // default to one repetition
        let count: number = 1;
        let arr: any[] = [];

        if (row.partialContent.tokenSource) {
          const token: TokenAttribute = this.getTokenFromTokenSource(row.partialContent.tokenSource, tokenAttributeList);
          if (token) {
            try {
              const parsed: any = JSON.parse(token.value);
              if (Array.isArray(parsed)) {
                arr = parsed;
                count = parsed.length;
              }
            } catch {
              // leave count = 1 on error
            }
          }
        }

        // build and replace once per array element
        const toInsert: Row[] = [];
        for (let a = 0; a < count; a++) {
          // 🔑 deep‑clone everything so each iteration is independent
          const cloneRows: Row[] = JSON.parse(JSON.stringify(partialRows));

          // parse the a-th fragment into TokenAttributes
          const fragment = arr[a] ?? {};
          const attributeList: TokenAttribute[] = this.jsonTokenParserService.parse(JSON.stringify(fragment));


          // replace tokens in *this* clone
          let replaced: Row[] = this.tokenReplacerService.replaceTokensInRow(cloneRows, attributeList);
          replaced  = this.tokenHtmlReplacerService.replaceTokensInRow(replaced, attributeList);

          toInsert.push(...replaced);
        }

        // splice out the placeholder and insert all the expanded rows
        rows.splice(i, 1, ...toInsert);
        i += toInsert.length - 1;
      }
    }

    page.content.rows = rows;
    return page;
  }

  private fetchPartialPage(name: string, partialContentList: Grid[]): Grid {
    for (const grid of partialContentList) {
      if (grid.name === name) {
        return grid;
      }
    }
    throw new Error(`Partial content with name "${name}" not found.`);
  }

  private getTokenFromTokenSource(tokenSource: string, tokenAttributeList?: TokenAttribute[]): TokenAttribute {
    for (const token of tokenAttributeList || []) {
      if (token.name === tokenSource) {
        return token;
      }
    }
    return null;
  }
}
