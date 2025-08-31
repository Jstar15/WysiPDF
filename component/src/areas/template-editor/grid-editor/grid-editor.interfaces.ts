import {CellEditorType} from "../cell-editor-viewer/cell-editor-viewer.interfaces";
import {Cell} from "../../../models/interfaces";

export interface OpenCellEditorEvent {
  cell: Cell;
  row: number;
  column: number;
  area: 'content' | 'footer' | 'header';
  type: CellEditorType;
}
