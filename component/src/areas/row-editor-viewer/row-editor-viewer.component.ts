import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";
import { RowEditorAction, RowEditorType} from "./row-editor-viewer.interfaces";
import {TokenAttribute} from "../../models/token-attribute";
import {PageStateService} from "../../services/page-state.service";
import {DisplayLogicGroup} from "../../models/display-logic.models";
import {Row} from "../../models/page";
import {CellEditorType} from "../cell-editor-viewer/cell-editor-viewer.interfaces";
import {DisplayLogicEditorComponent} from "./display-logic-editor/display-logic-editor.component";

@Component({
  selector: 'app-row-editor-viewer',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, DisplayLogicEditorComponent],
  templateUrl: './row-editor-viewer.component.html',
  styleUrls: ['./row-editor-viewer.component.scss']
})
export class RowEditorViewerComponent implements OnInit{
  @Input() type: RowEditorType = RowEditorType.DISPLAY_RULES;
  @Input() tokens!: TokenAttribute[];

  @Output() editorActionEvent = new EventEmitter<RowEditorAction>();

  row:Row;

  displayLogic!: DisplayLogicGroup;
  okLabel = 'OK';
  cancelLabel = 'Cancel';

  constructor(private gridStateService: PageStateService) {
  }

  ngOnInit(): void {
    this.loadCurrentRow();
    this.loadDisplayLogic();
  }

  onCancel(): void {
    this.editorActionEvent.emit(RowEditorAction.CANCEL);
  }
  onOk(): void     {
    this.gridStateService.updateRow(this.row);
    this.editorActionEvent.emit(RowEditorAction.OK);
  }

  loadDisplayLogic(): void{
    this.displayLogic = this.gridStateService.getDisplayLogicForRow();
  }


  loadCurrentRow(): void{
    this.row = this.gridStateService.getCurrentRow();
  }
  protected readonly RowEditorType = RowEditorType;
  protected readonly CellEditorType = CellEditorType;
}
