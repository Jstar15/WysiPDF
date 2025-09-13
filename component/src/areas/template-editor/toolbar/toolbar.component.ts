import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {EditorType} from "../../editor-viewer/editor-viewer.interfaces";
import {PanelTypes} from "../template-editor.interfaces";
import {MatDialog} from "@angular/material/dialog";
import {PageStateService} from "../../../services/page-state.service";
import {Page} from "../../../models/page";
import {RowEditorType} from "../../row-editor-viewer/row-editor-viewer.interfaces";
import {CellEditorType} from "../../cell-editor-viewer/cell-editor-viewer.interfaces";
import {GridEventType} from "../grid-editor/grid-editor.interfaces";
import {CellStyleToolbarComponent} from "./cell-style-toolbar/cell-style-toolbar.component";


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatIcon, MatTooltip, DragDropModule, MatMiniFabButton, MatIconButton, CellStyleToolbarComponent],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input('hide-editors') hideEditors: boolean;

  @Input('page') page: Page;
  @Output('page-change') pageChange = new EventEmitter<Page>();

  @Input('panel-type') panelType: PanelTypes;
  @Output('panel-type-change') panelTypeChange = new EventEmitter<PanelTypes>();

  @Input('editor-type') editorType: EditorType;
  @Output('editor-type-change') editorTypeChange = new EventEmitter<EditorType>();

  @Input('row-editor-type') rowEditorType: RowEditorType;
  @Output('row-editor-type-change') rowEditorTypeChange = new EventEmitter<RowEditorType>();

  @Input('cell-editor-type') cellEditorType: CellEditorType;
  @Output('cell-editor-type-change') cellEditorTypeChange = new EventEmitter<CellEditorType>();

  constructor(
    public dialog: MatDialog,
    private gridStateService : PageStateService,
  ) {}
    ngOnInit(): void {

    }

    undo(): void {
      const previous = this.gridStateService.undo();
      if (previous) {
        this.page = previous;
      }
    }

    redo(): void {
      const next = this.gridStateService.redo();
      if (next) {
        this.page = next;
      }
    }

    canUndo(): boolean {
      return this.gridStateService.canUndo()
    }

    canRedo(): boolean {
      return this.gridStateService.canRedo()
    }

    togglePdfPane(): void {
      if(this.panelType == PanelTypes.PDF_VIEW){
        this.panelType = PanelTypes.JSON_VIEW;
      }else{
        this.panelType = PanelTypes.PDF_VIEW;
      }
      this.panelTypeChange.emit(this.panelType);
    }

    onEditorTypeChange(editorType: EditorType){
      this.editorType = editorType;
      this.editorTypeChange.emit(this.editorType);
    }

    onRowTypeChange(rowEditorType: RowEditorType){
      this.rowEditorType = rowEditorType;
      this.rowEditorTypeChange.emit(this.rowEditorType);
    }

    onCellTypeChange(cellEditorType: CellEditorType){
      this.cellEditorType = cellEditorType;
      this.cellEditorTypeChange.emit(this.cellEditorType);
    }

    onGridEvent(gridEvent: GridEventType) {
      this.gridStateService.emitGridEvent(gridEvent);
    }



  protected readonly EditorType = EditorType;
  protected readonly PanelTypes = PanelTypes;
  protected readonly RowEditorType = RowEditorType;
  protected readonly CellEditorType = CellEditorType;
  protected readonly GridEventType = GridEventType;
}
