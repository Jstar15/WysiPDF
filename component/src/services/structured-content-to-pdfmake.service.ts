import { Injectable } from '@angular/core';
import {
    Cell,
    HtmlBasicElement,
    HtmlBlock,
    HtmlBlockContainer,
    HtmlGridBlock,
    HtmlTableBlock,
    Row
} from '../models/interfaces';

import type {
    Content,
    ContentTable,
    ContentText,
    TableCell,
    TableLayout,
    TDocumentDefinitions,
    Alignment
} from 'pdfmake/interfaces';

@Injectable({ providedIn: 'root' })
export class StructuredContentToPdfmakeService {
    convertToPdfDefinition(container: HtmlBlockContainer): TDocumentDefinitions {
        const content: Content[] = container.blocks.flatMap(block => this.renderBlock(block));
        return { content };
    }

    private renderBlock(block: HtmlBlock | HtmlTableBlock | HtmlGridBlock): Content | Content[] {
        switch (block.blockType) {
            case 'table': return this.renderTableBlock(block as HtmlTableBlock);
            case 'grid': return this.renderGridBlock(block as HtmlGridBlock);
            default: return this.renderHtmlBlock(block as HtmlBlock);
        }
    }

    private renderGridBlock(gb: HtmlGridBlock): Content[] {
        const contents: Content[] = [];

        const renderCell = (cell: Cell, row: Row, c: number) => {
            const paddingLeft = cell.attrs?.paddingLeft ?? 0;
            const paddingRight = cell.attrs?.paddingRight ?? 0;

            const cellWidth = this.calculateCellWidth(
                row.widths[c],
                595.28, 40, 40,
                paddingLeft, paddingRight
            );

            const nested: Content[] = cell.type === 'image'
                ? [{
                    image: cell.imageBlock.imageBase64,
                    width: cellWidth * (cell.imageBlock.width / 100) - 8, //this will need adjustign on page change of margin //todos
                    alignment: cell.imageBlock.alignment as Alignment
                }]
                : cell.block
                    ? cell.block.blocks.flatMap(i => this.renderBlock(i) as Content[])
                    : [{ text: cell.value || '​', noWrap: false }];

            const border: [boolean, boolean, boolean, boolean] = [
                (cell.attrs?.borderLeft ?? 1) > 0,
                (cell.attrs?.borderTop ?? 1) > 0,
                (cell.attrs?.borderRight ?? 1) > 0,
                (cell.attrs?.borderBottom ?? 1) > 0
            ];

          return {
            stack: nested,
            fillColor: !cell.attrs.backgroundColor || cell.attrs.backgroundColor === 'transparent'
              ? row.backgroundColor
              : cell.attrs.backgroundColor,
            alignment: 'left',
            border,
            borderColor: [
              cell.attrs?.borderColor,
              cell.attrs?.borderColor,
              cell.attrs?.borderColor,
              cell.attrs?.borderColor
            ],
            margin: [
              Number(cell.attrs?.paddingLeft ?? 0),
              Number(cell.attrs?.paddingTop ?? 0),
              Number(cell.attrs?.paddingRight ?? 0),
              Number(cell.attrs?.paddingBottom ?? 0)
            ],
            __attrs: {
              borderTop: Number(cell.attrs?.borderTop) || 0,
              borderRight: Number(cell.attrs?.borderRight) || 0,
              borderBottom: Number(cell.attrs?.borderBottom) || 0,
              borderLeft: Number(cell.attrs?.borderLeft) || 0,
              borderColor: cell.attrs?.borderColor || '#000'
            }
          } as TableCell & { __attrs: any };
        };

        gb.rows.forEach((row, index) => {
            if (row.type === 'page-break') {
                // Only insert page break if it's not the last row
                const hasMoreRows = gb.rows.slice(index + 1).some(r => r.type !== 'page-break');
                if (hasMoreRows) {
                    contents.push({ text: '', pageBreak: 'before' });
                }
                return;
            }

            const widths = row.widths.map(w => `${w}%`);
            const rowCells = row.cells.map((cell, c) => renderCell(cell, row, c));

            contents.push({
                table: {
                    widths,
                    body: [rowCells]
                },
                layout: this.getCustomLayout([rowCells]),
                margin: [0, 0, 0, 0]
            });
        });

        return contents;
    }


    private renderTableBlock(tb: HtmlTableBlock): ContentTable {
        const maxCols = Math.max(...tb.rows.map(r => r.cells.length));
        const widths = Array(maxCols).fill('*');
        const body = tb.rows.map(row =>
            row.cells.map(cell => {
                const el = cell.elements[0];
                const al: Alignment = (el?.attributes?.align || 'left') as Alignment;
                const stack = cell.elements.length
                    ? cell.elements.map(e => this.convertElement(e))
                    : [{ text: '​', noWrap: false }];
                return {
                    stack,
                    alignment: al,
                    margin: [0, 0, 0, 0],
                    border: [true, true, true, true],
                    borderColor: '#bbb'
                } as TableCell;
            })
        );
        return { table: { widths, body }, layout: this.getDefaultLayout(), margin: [0, 0, 0, 0] };
    }

    private renderHtmlBlock(tb: HtmlBlock): Content {
        if (tb.listType === 'ul' || tb.listType === 'ol') {
            return this.renderHtmlListBlock(tb); // Pass the HtmlBlock for list rendering
        }

        return {
            text: tb.elements.map(el => this.convertElement(el)),
            alignment: (tb.alignment || 'left') as Alignment,
            margin: [0, 0, 0, 0],
            noWrap: false
        };
    }



    private convertElement(el: HtmlBasicElement): ContentText {
        const a = el.attributes;

        // ✅ If value is missing but token key exists, show token name as placeholder
        let finalValue = el.value;
        if (!finalValue && el.token?.key) {
            finalValue = `{{${el.token.key}}}`;  // e.g., {{batters.batter.id}}
        }

        const style: any = {
            text: this.insertSoftBreaks(finalValue || '​'),
            noWrap: false
        };

        if (a.bold === 'true') style.bold = true;
        if (a.italic === 'true') style.italics = true;
        if (a.underline === 'true') style.decoration = 'underline';
        if (a.size) style.fontSize = a.size;
        if (a.font) style.font = a.font;
        if (a.color) style.color = a.color;
        if (a.background) style.background = a.background;

        return style;
    }


    // hacky workaround for table break
    private insertSoftBreaks(text: string, every = 10): string {
        return text.replace(new RegExp(`(.{${every}})`, 'g'), '$1​');
    }

    private getDefaultLayout(): TableLayout {
        return {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
            paddingTop: () => 4,
            paddingBottom: () => 4,
            paddingLeft: () => 4,
            paddingRight: () => 4
        };
    }

    private getCustomLayout(body: (TableCell & { __attrs?: any })[][]): TableLayout {
        return {
            hLineWidth: (i) => {
                const rowAbove = body[i - 1] || [];
                const row = body[i] || [];
                const len = Math.max(row.length, rowAbove.length);
                let max = 0;
                for (let c = 0; c < len; c++) {
                    const top = row[c]?.__attrs?.borderTop || 0;
                    const bottom = rowAbove[c]?.__attrs?.borderBottom || 0;
                    max = Math.max(max, top, bottom);
                }
                return max;
            },
            vLineWidth: (i) => {
                let max = 0;
                for (const row of body) {
                    const left = row[i]?.__attrs?.borderLeft || 0;
                    const right = row[i - 1]?.__attrs?.borderRight || 0;
                    max = Math.max(max, left, right);
                }
                return max;
            },
            hLineColor: (i, node, colIndex) => {
                const row = body[i];
                const rowAbove = body[i - 1];

                const thisCell = row?.[colIndex];
                const aboveCell = rowAbove?.[colIndex];

                return thisCell?.__attrs?.borderTop > 0 ? thisCell.__attrs.borderColor
                    : aboveCell?.__attrs?.borderBottom > 0 ? aboveCell.__attrs.borderColor
                        : '#000';
            },
            vLineColor: (i, node, rowIndex) => {
                const row = body[rowIndex];
                const thisCell = row?.[i];
                const prevCell = row?.[i - 1];

                return thisCell?.__attrs?.borderLeft > 0 ? thisCell.__attrs.borderColor
                    : prevCell?.__attrs?.borderRight > 0 ? prevCell.__attrs.borderColor
                        : '#000';
            },
            paddingTop: () => 1,
            paddingBottom: () => 1,
            paddingLeft: () => 4,
            paddingRight: () => 4
        };
    }


    public convert(c: HtmlBlockContainer): Content[] {
        try { return this.convertToPdfDefinition(c).content as Content[]; }
        catch { return []; }
    }

    private calculateCellWidth(
        columnPct: number,
        pageWidthPt: number,
        marginLeftPt: number,
        marginRightPt: number,
        paddingLeftPt: number,
        paddingRightPt: number
    ): number {
        const contentWidth = pageWidthPt - marginLeftPt - marginRightPt;
        const rawCellWidth = (columnPct / 100) * contentWidth;
        const innerWidth = rawCellWidth - paddingLeftPt - paddingRightPt;
        return Math.max(0, innerWidth);
    }

    private renderHtmlListBlock(tb: HtmlBlock): Content {
        const items: Content[] = tb.elements.map(el => {
            const item = this.convertElement(el);
            const align = (el.attributes?.align || tb.alignment || 'left') as Alignment;

            return {
                text: [
                    { text: '• ' },         // No alignment here, just the bullet
                    { ...item }             // Spread existing styles including .text
                ],
                alignment: align,         // Apply alignment to the full line
                margin: [0, 2, 0, 2],
                noWrap: false
            };
        });

        return {
            stack: items,
            margin: [0, 0, 0, 0]
        };
    }






}
