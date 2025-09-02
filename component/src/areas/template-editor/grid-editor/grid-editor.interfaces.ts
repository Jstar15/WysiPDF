import {CellEditorType} from "../../cell-editor-viewer/cell-editor-viewer.interfaces";
import {Cell} from "../../../models/page";

export interface OpenCellEditorEvent {
  cell: Cell;
  rowIndex: number;
  columnIndex: number;
  area?: 'content' | 'footer' | 'header';
  type: CellEditorType;
  gridIndex?: number
}
