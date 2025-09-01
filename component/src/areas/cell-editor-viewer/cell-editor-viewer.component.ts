import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {Cell} from '../../models/interfaces';
import {MatIcon} from "@angular/material/icon";
import {CellEditorAction, CellEditorType} from "./cell-editor-viewer.interfaces";
import {AddImageEditorComponent} from "./image-editor/image-editor.component";
import {TokenAttribute} from "../../models/TokenAttribute";
import {PageStateService} from "../../services/page-state.service";
import {BarCodeEditorComponent} from "./bar-code-editor/bar-code-editor.component";
import {QuillEditorComponent} from "./quill-editor/quill-editor.component";

@Component({
  selector: 'app-cell-editor-viewer',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, AddImageEditorComponent, BarCodeEditorComponent, QuillEditorComponent],
  templateUrl: './cell-editor-viewer.component.html',
  styleUrls: ['./cell-editor-viewer.component.scss']
})
export class CellEditorViewerComponent {
  @Input() type: CellEditorType = CellEditorType.IMAGE;
  @Input() cell!: Cell;
  @Input() row!: number;
  @Input() column!: number;
  @Input() area!: string;
  @Input() tokens!: TokenAttribute[];

  @Output() editorActionEvent = new EventEmitter<CellEditorAction>();

  okLabel = 'OK';
  cancelLabel = 'Cancel';

  constructor(private gridStateService: PageStateService) {
  }

  onCancel(): void {
    this.editorActionEvent.emit(CellEditorAction.CANCEL);
  }
  onOk(): void     {
    this.gridStateService.updateCell(this.row, this.column, this.area, this.cell)
    debugger;
    this.editorActionEvent.emit(CellEditorAction.OK);
  }

  protected readonly CellEditorType = CellEditorType;
}
