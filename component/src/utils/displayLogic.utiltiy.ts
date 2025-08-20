// types used below (import yours instead if they already exist)
import { Page, Grid, Row, Cell } from '../models/interfaces';
import { DisplayLogicGroup } from '../models/display-logic.models';

export type DisplayRuleLocation = 'header' | 'content' | 'footer' | 'partial';

export interface DisplayRuleItem {
  location: DisplayRuleLocation;   // which area the rule came from
  gridName?: string;               // for partial grids (or header/footer if you set names)
  rowIndex: number;
  cellIndex: number;
  displayLogic: DisplayLogicGroup; // the rule itself
}

/** Extract all non-empty display rules from a Page */
export function collectDisplayRules(page: Page): DisplayRuleItem[] {
  const results: DisplayRuleItem[] = [];

  const scanGrid = (grid: Grid | undefined, location: DisplayRuleLocation, gridName?: string) => {
    if (!grid?.rows?.length) return;
    grid.rows.forEach((row: Row, rowIndex: number) => {
      row.cells.forEach((cell: Cell, cellIndex: number) => {
        const logic = cell.displayLogic;
        if (logic && !isEmptyLogic(logic)) {
          results.push({
            location,
            gridName,
            rowIndex,
            cellIndex,
            displayLogic: logic
          });
        }
      });
    });
  };

  scanGrid(page.header,  'header',  page.header?.name);
  scanGrid(page.content, 'content', page.content?.name);
  scanGrid(page.footer,  'footer',  page.footer?.name);

  // partialContent: array of Grid
  (page.partialContent ?? []).forEach((g) => scanGrid(g, 'partial', g?.name));

  return results;
}

/** Treat a logic group with no conditions (or empty ones) as empty */
function isEmptyLogic(logic: DisplayLogicGroup | null | undefined): boolean {
  if (!logic) return true;
  const conds = logic.conditions ?? [];
  return conds.length === 0;
}
