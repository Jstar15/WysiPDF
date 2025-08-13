import { Injectable } from '@angular/core';
import { Row, HtmlBasicElement, HtmlTableBlock} from '../models/interfaces';
import { TokenAttribute } from '../models/TokenAttribute';

@Injectable({ providedIn: 'root' })
export class TokenReplacerService {
    public replaceTokensInRow(rows: Row[], tokens: TokenAttribute[]): Row[] {
        const tokenMap: { [key: string]: string } = {};
        for (const t of tokens) {
            tokenMap[t.name] = t.value;
        }

        for (const row of rows) {
            for (const cell of row.cells) {
                if (!cell.block) continue;

                for (const block of cell.block.blocks) {
                    // ── if it's a table, drill down into rows→cells→elements ──
                    if (block.blockType === 'table') {
                        const table = block as HtmlTableBlock;
                        for (const tr of table.rows) {
                            for (const tc of tr.cells) {
                                for (const el of tc.elements) {
                                    this.replaceInElement(el, tokenMap);
                                }
                            }
                        }
                    }
                    // ── otherwise if it has an elements array, use that ──
                    else {
                        const maybeEls = (block as any).elements;
                        if (Array.isArray(maybeEls)) {
                            for (const el of maybeEls as HtmlBasicElement[]) {
                                this.replaceInElement(el, tokenMap);
                            }
                        }
                    }
                }
            }

            if (row.partialContent) {
                this.replaceTokensInRow(row.partialContent.rows, tokens);
            }
        }

        return rows;
    }

    private replaceInElement(el: HtmlBasicElement, tokenMap: { [k: string]: string }) {
        if (el.type === 'token') {
            const key = (el.attributes.currentColumnName || '').split('.').pop()!;
            const replacement = tokenMap[key];
            if (replacement !== undefined) {
                el.value = replacement;
                el.attributes.value = replacement;
                el.type = 'text';
            }
        }
    }
}
