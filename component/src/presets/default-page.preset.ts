import { Cell, Page, Row } from '../models/page';

export const DEFAULT_PAGE: Page = {
  header: { rows: [createEmptyRow()] },
  header2: { rows: [createEmptyRow()] },
  content: { rows: [createEmptyRow()] },
  footer: { rows: [createEmptyRow()] },
  pageAttrs: {
    backgroundColor: 'white',
    marginTop: 0,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 0,
    headerMarginTop: 25,
    headerMarginRight: 25,
    headerMarginLeft: 25,
    headerMarginBottom: 5,
    headerHeight: 40,
    footerMarginTop: 0,
    footerMarginRight: 25,
    footerMarginLeft: 25,
    footerMarginBottom: 5,
    footerHeight: 40,
    defaultFont: 'Roboto',
    dontBreakRows: true,
    pageNumbering: true,
    headerForPage2Up: false,
    autoCompressImages: true,
    maxImageSize: 0.5
  },
  tokenAttrs: [],
  colorPalettes: [
    '#000000', '#111827', '#1F2937', '#374151', '#4B5563',
    '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#FFFFFF',
    '#1D4ED8', '#2563EB', '#3B82F6', '#6366F1', '#818CF8',
    '#0E7490', '#06B6D4', '#22D3EE', '#67E8F9',
    '#065F46', '#10B981', '#34D399', '#86EFAC',
    '#B45309', '#F59E0B', '#FBBF24', '#FB923C',
    '#B91C1C', '#EF4444', '#F87171', '#FCA5A5',
    '#BE185D', '#EC4899', '#F472B6', '#8B5CF6', '#A78BFA', '#DDD6FE'
  ]
};

export function createEmptyCell(): Cell {
  return {
    type: 'html',
    value: '',
    attrs: {
      paddingTop: 5,
      paddingRight: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      borderTop: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderColor: 'white',
      backgroundColor: 'transparent'
    }
  };
}

/**
 * Create a blank row. Widths length controls the number of cells.
 * @param widths column widths (one cell per entry)
 * @param height row height
 * @param backgroundColor row background (defaults to page background)
 */
export function createEmptyRow(
  widths: number[] = [100],
  height: number = 50,
  backgroundColor: string = 'white'
): Row {
  return {
    height,
    widths,
    cells: widths.map(() => createEmptyCell()),
    backgroundColor
  };
}
