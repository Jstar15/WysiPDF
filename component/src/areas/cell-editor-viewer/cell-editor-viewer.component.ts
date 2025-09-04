import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {Cell} from '../../models/page';
import {MatIcon} from "@angular/material/icon";
import {CellEditorAction, CellEditorType} from "./cell-editor-viewer.interfaces";
import {AddImageEditorComponent} from "./image-editor/image-editor.component";
import {TokenAttribute} from "../../models/token-attribute";
import {PageStateService} from "../../services/page-state.service";
import {BarCodeEditorComponent} from "./bar-code-editor/bar-code-editor.component";
import {QuillEditorComponent} from "./quill-editor/quill-editor.component";
import {ChartEditorComponent} from "./chart-editor/chart-editor.component";

@Component({
  selector: 'app-cell-editor-viewer',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, AddImageEditorComponent, BarCodeEditorComponent, QuillEditorComponent, ChartEditorComponent],
  templateUrl: './cell-editor-viewer.component.html',
  styleUrls: ['./cell-editor-viewer.component.scss']
})
export class CellEditorViewerComponent implements OnInit{
  @Input() type: CellEditorType = CellEditorType.IMAGE;
  @Input() tokens!: TokenAttribute[];
  @Input() colorPalettes: string[] = [];

  @Output() editorActionEvent = new EventEmitter<CellEditorAction>();

  cell: Cell
  okLabel = 'OK';
  cancelLabel = 'Cancel';

  constructor(private gridStateService: PageStateService) {
  }

  ngOnInit(): void {
    this.loadCurrentCell();
  }

  onCancel(): void {
    this.editorActionEvent.emit(CellEditorAction.CANCEL);
  }
  onOk(): void     {
    this.gridStateService.updateCell(this.cell);
    this.editorActionEvent.emit(CellEditorAction.OK);
  }

  loadCurrentCell(): void{
    this.cell = this.gridStateService.getCurrentCell();
  }

  protected readonly CellEditorType = CellEditorType;
}
