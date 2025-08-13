import {
    HtmlBlockContainer,
    HtmlBlock,
    HtmlGridBlock,
    Row,
    Cell,
    CellAttrs
} from '../models/interfaces';
import {Injectable} from "@angular/core";

/**
 * GridToStructuredContentService
 *
 * This service converts grid-based layout data (`Row[]`) into a structured content model (`HtmlBlockContainer`)
 * that can later be used for rendering or PDF generation.
 *
 * Each cell's HTML content is parsed into block structures using PdfGenerateService,
 * and the resulting layout is normalized into a `HtmlGridBlock` format with consistent
 * padding, borders, and widths. Column widths are stored as percentages summing to 100.
 *
 * This is an intermediate step and does not return pdfMake-ready output directly.
 */
@Injectable({ providedIn: 'root' })
export class GridToStructuredContentService {
    constructor() {}

    public convert(gridData: Row[]): HtmlBlockContainer {


        const blocks: (HtmlGridBlock | HtmlBlock)[] = [];
        const gridBlock: HtmlGridBlock = {
            blockType: 'grid',
            rows: gridData.map(row => ({
                type: row.type,
                widths: row.widths ?? this.defaultWidths(row.cells.length),
                height: row.height,
                cells: row.cells.map(cell => this.normalizeCell(cell)),
                backgroundColor: row.backgroundColor
            }))
        };

        blocks.push(gridBlock);
        return { blocks };
    }

    private normalizeCell(cell: Cell): Cell {
        const attrs: CellAttrs = {
            paddingTop: cell.attrs?.paddingTop ?? 0,
            paddingBottom: cell.attrs?.paddingBottom ?? 0,
            paddingLeft: cell.attrs?.paddingLeft ?? 0,
            paddingRight: cell.attrs?.paddingRight ?? 0,

            borderTop: cell.attrs?.borderTop ?? 0,
            borderRight: cell.attrs?.borderRight ?? 0,
            borderBottom: cell.attrs?.borderBottom ?? 0,
            borderLeft: cell.attrs?.borderLeft ?? 0,

            borderColor: cell.attrs?.borderColor ?? '#bbb',
            backgroundColor: cell.attrs?.backgroundColor ?? '#fff'
        };

        return {
            value: cell.value || '',
            attrs,
            type: cell.type,
            imageBlock: cell.imageBlock,
            block: cell.block
        };
    }


    private defaultWidths(count: number): number[] {
        const equal = 100 / count;
        return Array(count).fill(equal);
    }
}
