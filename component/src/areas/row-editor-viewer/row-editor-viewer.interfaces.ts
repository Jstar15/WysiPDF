import {Cell} from "../../models/page";

export enum RowEditorType {
  DISPLAY_RULES              = 'DISPLAY_RULES',
  REPEATABLE                 = 'REPEATABLE'
}

export enum RowEditorAction {
  OK            = 'OK',
  CANCEL            = 'CANCEL'
}

export interface RowEditorEvent {
  type: RowEditorType;
  action: RowEditorAction
  cell: Cell;
}
