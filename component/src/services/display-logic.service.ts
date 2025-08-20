// display-logic.service.ts
import { Injectable } from '@angular/core';
import { TokenAttribute } from '../models/TokenAttribute';
import {
  DisplayCondition,
  DisplayLogicGroup,
  Operator,
} from '../models/display-logic.models';
import { Row, Cell } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class DisplayLogicService {
  /**
   * Returns true if the logic group says the cell should be visible.
   */
  evaluate(
    tokenAttributes: TokenAttribute[],
    logic: DisplayLogicGroup | null
  ): boolean {
    if (!logic || !logic.conditions || logic.conditions.length === 0) {
      return true; // no rules => visible
    }

    const outcomes = logic.conditions.map((cond) =>
      this.evaluateCondition(tokenAttributes, cond)
    );

    return logic.chainType === 'AND'
      ? outcomes.every(Boolean)
      : outcomes.some(Boolean);
  }

  /**
   * Evaluate all cells in given rows. If a cell's displayLogic is false,
   * replace it with an empty cell (attrs preserved so layout stays intact).
   */
  evaulateCells(rows: Row[], tokenAttributes?: TokenAttribute[] | null): Row[] {
    return this.evaluateCells(rows, tokenAttributes);
  }

  // Correctly spelled helper; evaulateCells delegates here
  evaluateCells(rows: Row[], tokenAttributes?: TokenAttribute[] | null): Row[] {
    if (!Array.isArray(rows) || rows.length === 0) return rows;

    const attrs = tokenAttributes ?? [];

    return rows.map((row) => {
      const newCells: Cell[] = row.cells.map((cell) => {
        const visible = this.evaluateCellVisibility(cell, attrs);
        return visible ? cell : this.makeEmptyCell(cell);
      });

      return { ...row, cells: newCells };
    });
  }

  // ---------- internals ----------

  private evaluateCellVisibility(cell: Cell, attrs: TokenAttribute[]): boolean {
    const logic = cell.displayLogic ?? null;
    return this.evaluate(attrs, logic);
  }

  private makeEmptyCell(cell: Cell): Cell {
    // Preserve attrs for sizing/background/etc; clear content & blocks
    return {
      ...cell,
      type: 'html',
      value: '',
      block: undefined,
      imageBlock: undefined,
      // keep attrs & displayLogic (optional). If you'd prefer to strip logic from hidden cells:
      // displayLogic: undefined,
    };
  }

  private getAttribute(
    attrs: TokenAttribute[],
    name: string
  ): TokenAttribute | undefined {
    return attrs.find((a) => a.name === name);
  }

  private evaluateCondition(
    attrs: TokenAttribute[],
    condition: DisplayCondition
  ): boolean {
    const attr = this.getAttribute(attrs, condition.tokenName);
    const op: Operator = condition.operator;
    const rawVal = attr?.value ?? '';

    switch (op) {
      case 'EQUALS':
        return rawVal === (condition.value ?? '');
      case 'NOT_EQUALS':
        return rawVal !== (condition.value ?? '');
      case 'GREATER': {
        const numA = parseFloat(rawVal);
        const numB = parseFloat(condition.value || '0');
        return !isNaN(numA) && !isNaN(numB) && numA > numB;
      }
      case 'LESS': {
        const numA = parseFloat(rawVal);
        const numB = parseFloat(condition.value || '0');
        return !isNaN(numA) && !isNaN(numB) && numA < numB;
      }
      case 'CONTAINS':
        return rawVal.includes(condition.value || '');
      case 'NOT_NULL':
        return rawVal != null && rawVal.toString().trim().length > 0;
      case 'IS_EMPTY':
        return rawVal == null || rawVal.toString().trim().length === 0;
      default:
        return true;
    }
  }
}
