import {Cell} from "../../../models/interfaces";

export enum CellEditorType {
  PARTIAL_CONTENT   = 'PARTIAL_CONTENT',
  IMAGE             = 'IMAGE',
  BARCODE           = 'BARCODE',
  CHART             = 'CHART',


}

export enum CellEditorAction {
  OK            = 'OK',
  CANCEL            = 'CANCEL'
}

export interface CellEditorEvent {
  type: CellEditorType;
  action: CellEditorAction
  cell: Cell;
}
