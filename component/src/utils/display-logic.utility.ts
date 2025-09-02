// display-logic.utility.ts
import { Injectable } from '@angular/core';
import { TokenAttribute } from '../models/TokenAttribute';
import {
  DisplayCondition,
  DisplayLogicGroup,
  Operator,
} from '../models/display-logic.models';
import { Row, Cell } from '../models/page';

@Injectable({ providedIn: 'root' })
export class DisplayLogicUtility {
  /**
   * Returns true if the logic group says the row should be visible.
   * No logic (or empty conditions) => visible by default.
   */
  evaluate(tokenAttributes: TokenAttribute[], logic: DisplayLogicGroup | null | undefined): boolean {
    if (!logic || !Array.isArray(logic.conditions) || logic.conditions.length === 0) {
      return true;
    }

    const outcomes = logic.conditions.map((cond) => this.evaluateCondition(tokenAttributes, cond));
    return (logic.chainType === 'OR') ? outcomes.some(Boolean) : outcomes.every(Boolean);
  }

  /**
   * NEW primary API: evaluate each row against *row.displayLogic*.
   * If a row is not visible, return a copy of the row where all cells are "emptied"
   * (so layout stays intact but content is hidden).
   */
  evaluateRows(rows: Row[], tokenAttributes?: TokenAttribute[] | null): Row[] {
    if (!Array.isArray(rows) || rows.length === 0) return rows;
    const attrs = tokenAttributes ?? [];
    return rows.filter(row => this.evaluate(attrs, row.displayLogic ?? null));
  }

  /**
   * Back-compat alias for older code paths that called "evaluateCells" on rows.
   * This now evaluates *rows* by row.displayLogic (no per-cell logic).
   */
  evaluateAllRows(rows: Row[], tokenAttributes?: TokenAttribute[] | null): Row[] {
    return this.evaluateRows(rows, tokenAttributes);
  }



  private getAttribute(attrs: TokenAttribute[], name: string): TokenAttribute | undefined {
    return attrs.find((a) => a.name === name);
  }

  private evaluateCondition(attrs: TokenAttribute[], condition: DisplayCondition): boolean {
    const attr = this.getAttribute(attrs, condition.tokenName);
    const op: Operator = condition.operator;
    const rawVal = attr?.value ?? '';

    switch (op) {
      case 'EQUALS':
        return String(rawVal) === String(condition.value ?? '');
      case 'NOT_EQUALS':
        return String(rawVal) !== String(condition.value ?? '');
      case 'GREATER': {
        const numA = parseFloat(String(rawVal));
        const numB = parseFloat(String(condition.value ?? ''));
        return Number.isFinite(numA) && Number.isFinite(numB) && numA > numB;
      }
      case 'LESS': {
        const numA = parseFloat(String(rawVal));
        const numB = parseFloat(String(condition.value ?? ''));
        return Number.isFinite(numA) && Number.isFinite(numB) && numA < numB;
      }
      case 'CONTAINS':
        return String(rawVal).includes(String(condition.value ?? ''));
      case 'NOT_NULL':
        return rawVal != null && String(rawVal).trim().length > 0;
      case 'IS_EMPTY':
        return rawVal == null || String(rawVal).trim().length === 0;
      default:
        return true;
    }
  }
}
