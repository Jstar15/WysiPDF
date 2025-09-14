import { Injectable } from '@angular/core';
import { Page, Row } from '../models/page';
import { TokenAttribute } from '../models/token-attribute';
import { TokenReplacerUtility } from '../utils/token-replacer.utility';

@Injectable({ providedIn: 'root' })
export class RepeatableContentExpanderService {

  constructor(private tokenReplacerService: TokenReplacerUtility) {}

  /**
   * Expand all repeatable rows in the page.
   * Each repeatable row is duplicated based on the longest valueArray
   * in the associated tokenAttributes.
   */
  public expandRepeatables(page: Page, tokenAttributeList: TokenAttribute[] = []): Page {
    const expandedRows: Row[] = [];

    for (const row of page.content.rows) {

      if (row.repeatableToken) {
        const repeatableName = row.repeatableToken.name;

        // Find the token that matches the repeatable name
        const sourceToken = tokenAttributeList.find(t => t.name === repeatableName);

        if (!sourceToken || !sourceToken.tokenAttributes || sourceToken.tokenAttributes.length === 0) {
          expandedRows.push(row); // no data → keep original row
          continue;
        }

        // Determine the max length of any valueArray across the tokenAttributes
        const maxLength = Math.max(
          ...sourceToken.tokenAttributes.map(t => t.valueArray?.length ?? 0)
        );

        // Clone the row for each index
        for (let i = 0; i < maxLength; i++) {
          // Deep clone the row
          let clonedRow: Row = JSON.parse(JSON.stringify(row));

          // Prepare a shallow array of tokens for this row
          const attributeList = sourceToken.tokenAttributes.map(t => {
            const tokenCopy = { ...t };
            tokenCopy.value = Array.isArray(t.valueArray) && t.valueArray.length > i
              ? t.valueArray[i]
              : '';
            return tokenCopy;
          });

          // Replace tokens in this cloned row
          clonedRow = this.tokenReplacerService.replaceTokensInRow(clonedRow, attributeList);

          expandedRows.push(clonedRow);
        }

      } else {
        // Not repeatable → just push
        expandedRows.push(row);
      }
    }

    page.content.rows = expandedRows;
    return page;
  }
}
