import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {Cell} from '../../../models/interfaces';
import {MatIcon} from "@angular/material/icon";
import {CellEditorAction, CellEditorEvent, CellEditorType} from "./cell-editor-viewer.interfaces";
import {AddImageEditorComponent} from "./image-editor/image-editor.component";
import {TokenAttribute} from "../../../models/TokenAttribute";

@Component({
  selector: 'app-cell-editor-viewer',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, AddImageEditorComponent],
  templateUrl: './cell-editor-viewer.component.html',
  styleUrls: ['./cell-editor-viewer.component.scss']
})
export class CellEditorViewerComponent {
  @Input() type: CellEditorType = CellEditorType.IMAGE;
  @Input() cell!: Cell;
  @Input() tokens!: TokenAttribute[];

  @Input() okLabel = 'OK';
  @Input() cancelLabel = 'Cancel';

  @Output() editorEvent = new EventEmitter<CellEditorEvent>();


  emit(action: CellEditorAction): void {
    const editorEvent: CellEditorEvent = {
      type: this.type,
      cell: this.cell,
      action: action
    }
    this.editorEvent.emit(editorEvent);
  }



  /** Footer actions */
  onCancel(): void { this.emit(CellEditorAction.CANCEL); }
  onOk(): void     { this.emit(CellEditorAction.OK); }

  protected readonly CellEditorType = CellEditorType;
}
