import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Page } from '../../../models/interfaces';
import {PageLayoutEditorComponent} from "./page-layout-editor/page-layout-editor.component";
import {ImportEditorComponent} from "./import-editor/import-editor.component";
import {ColorPaletteEditorComponent} from "./color-palette-editor/color-palette-editor.component";
import {PresetLoaderComponent} from "./preset-loader/preset-loader.component";
import {TokenEditorComponent} from "./token-editor/token-editor.component";
import {MatIcon} from "@angular/material/icon";
import {EditorAction, EditorType} from "./editor-viewer.interfaces";
import {PageStateService} from "../../../services/page-state.service";

@Component({
  selector: 'app-editor-viewer',
  standalone: true,
  imports: [CommonModule, MatButton, PageLayoutEditorComponent, ImportEditorComponent, ColorPaletteEditorComponent, PresetLoaderComponent, TokenEditorComponent, MatIcon],
  templateUrl: './editor-viewer.component.html',
  styleUrls: ['./editor-viewer.component.scss']
})
export class EditorViewerComponent {
  @Input() type: EditorType = EditorType.PAGE_LAYOUT;
  @Input() page!: Page;

  @Input() okLabel = 'OK';
  @Input() cancelLabel = 'Cancel';

  @Output() editorActionEvent: EventEmitter<EditorAction> = new EventEmitter<EditorAction>();

  constructor(private gridStateService: PageStateService) {
  }

  updatePage(page:Page){
    this.page = page;
  }

  onCancel(): void {
    this.editorActionEvent.emit(EditorAction.CANCEL);

  }
  onOk(): void     {
    this.gridStateService.pushSnapshot(this.page)
    this.editorActionEvent.emit(EditorAction.OK);
  }

  protected readonly EditorType = EditorType;
}
