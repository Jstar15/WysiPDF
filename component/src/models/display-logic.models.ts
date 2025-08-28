// display-logic.models.ts
export type Operator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER'
  | 'LESS'
  | 'CONTAINS'
  | 'NOT_NULL'
  | 'IS_EMPTY';

export interface DisplayCondition {
  tokenName: string;
  operator: Operator;
  value?: string; // may be undefined for NOT_NULL / IS_EMPTY
}

export type ChainType = 'AND' | 'OR';

export interface DisplayLogicGroup {
  chainType: ChainType;
  conditions: DisplayCondition[];
}

