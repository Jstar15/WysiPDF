import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {Cell, Row} from '../../models/page';
import {MatIcon} from "@angular/material/icon";
import {CellEditorAction, CellEditorType} from "./cell-editor-viewer.interfaces";
import {AddImageEditorComponent} from "./image-editor/image-editor.component";
import {TokenAttribute} from "../../models/TokenAttribute";
import {PageStateService} from "../../services/page-state.service";
import {BarCodeEditorComponent} from "./bar-code-editor/bar-code-editor.component";
import {QuillEditorComponent} from "./quill-editor/quill-editor.component";
import {ChartEditorComponent} from "./chart-editor/chart-editor.component";
import {DisplayLogicEditorComponent} from "./display-logic-editor/display-logic-editor.component";
import {DisplayLogicGroup} from "../../models/display-logic.models";

@Component({
  selector: 'app-cell-editor-viewer',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, AddImageEditorComponent, BarCodeEditorComponent, QuillEditorComponent, ChartEditorComponent, DisplayLogicEditorComponent],
  templateUrl: './cell-editor-viewer.component.html',
  styleUrls: ['./cell-editor-viewer.component.scss']
})
export class CellEditorViewerComponent implements OnInit{
  [x: string]: any;
  @Input() type: CellEditorType = CellEditorType.IMAGE;
  @Input() cell!: Cell;
  @Input() rowIndex!: number;
  @Input() columnIndex!: number;
  @Input() area!: string;
  @Input() tokens!: TokenAttribute[];

  @Output() editorActionEvent = new EventEmitter<CellEditorAction>();

  displayLogic!: DisplayLogicGroup;
  okLabel = 'OK';
  cancelLabel = 'Cancel';

  constructor(private gridStateService: PageStateService) {
  }

  ngOnInit(): void {
    this.loadDisplayLogic();
  }

  onCancel(): void {
    this.editorActionEvent.emit(CellEditorAction.CANCEL);
  }
  onOk(): void     {
    this.gridStateService.updateCell(this.rowIndex, this.columnIndex, this.area, this.cell)
    this.editorActionEvent.emit(CellEditorAction.OK);
  }

  loadDisplayLogic(): void{
    this.displayLogic = this.gridStateService.getDisplayLogicForRow(this.rowIndex, this.area);
  }
  protected readonly CellEditorType = CellEditorType;
}
