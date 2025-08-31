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

/** Enum of editor types your viewer can host */
export enum EditorType {
  IMPORT        = 'IMPORT',
  PAGE_LAYOUT        = 'PAGE_LAYOUT',
  COLOR_PALETTE = 'COLOR_PALETTE',
  TOKEN         = 'GRID',
  PRESET        = 'PRESET'
}

export enum EditorAction {
  OK            = 'OK',
  CANCEL            = 'CANCEL'
}

/** Shape of the outbound event */
export interface EditorEvent {
  type: EditorType;
  action: EditorAction
  page: Page;
}

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

  @Output() editorEvent = new EventEmitter<EditorEvent>();


  emit(action: EditorAction): void {
    const editorEvent: EditorEvent = {
      type: this.type,
      page: this.page,
      action: action
    }
    this.editorEvent.emit(editorEvent);
  }

  updatePage(page:Page){
    this.page = page;
  }

  /** Footer actions */
  onCancel(): void { this.emit(EditorAction.CANCEL); }
  onOk(): void     { this.emit(EditorAction.OK); }

  protected readonly EditorType = EditorType;
}
