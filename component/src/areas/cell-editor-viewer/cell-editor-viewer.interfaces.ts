import {Cell} from "../../models/interfaces";

export enum CellEditorType {
  IMAGE             = 'IMAGE',
  BARCODE           = 'BARCODE',
  CHART             = 'CHART',
  HTML              = 'HTML',

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
