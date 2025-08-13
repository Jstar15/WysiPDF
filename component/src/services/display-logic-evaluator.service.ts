// display-logic-evaluator.service.ts
import { Injectable } from '@angular/core';
import { TokenAttribute } from '../models/TokenAttribute';
import {
  DisplayCondition,
  DisplayLogicGroup,
  Operator,
} from '../models/display-logic.models';

@Injectable({ providedIn: 'root' })
export class DisplayLogicEvaluatorService {
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

    if (logic.chainType === 'AND') {
      return outcomes.every(Boolean);
    } else {
      // OR
      return outcomes.some(Boolean);
    }
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
