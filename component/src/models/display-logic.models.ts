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

// Token attribute from your domain
export class TokenAttribute {
  constructor(name: string, value: string, type: TokenAttributeTypeEnum) {
    this.name = name;
    this.value = value;
    this.type = type;
  }
  name: string;
  value: string;
  type: TokenAttributeTypeEnum;
}

export enum TokenAttributeTypeEnum {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON_ARRAY = 'json_array',
  STRING_ARRAY = 'string_array',
  OBJECT = 'object',
}
