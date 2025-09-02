// models/ValidationCondition.ts
export interface ValidationCondition {
  tokenName: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER' | 'LESS' | 'CONTAINS' | 'NOT_NULL' | 'IS_EMPTY';
  value?: string;
}

export interface ValidationLogicGroup {
  conditions: ValidationCondition[];
  chainType: 'AND' | 'OR';
}

export interface ValidationConfigDialogData {
  tokenAttrs: { name: string; type: string }[]; // available token options
  initialConfig?: ValidationLogicGroup;         // optional pre-loaded config
}
