import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Page } from '../../models/page';
import {PageLayoutEditorComponent} from "./page-layout-editor/page-layout-editor.component";
import {ImportEditorComponent} from "./import-editor/import-editor.component";
import {ColorPaletteEditorComponent} from "./color-palette-editor/color-palette-editor.component";
import {PresetLoaderComponent} from "./preset-loader/preset-loader.component";
import {TokenEditorComponent} from "./token-editor/token-editor.component";
import {MatIcon} from "@angular/material/icon";
import {EditorAction, EditorType} from "./editor-viewer.interfaces";
import {PageStateService} from "../../services/page-state.service";

@Component({
  selector: 'app-editor-viewer',
  standalone: true,
  imports: [CommonModule, MatButton, PageLayoutEditorComponent, ImportEditorComponent, ColorPaletteEditorComponent, PresetLoaderComponent, TokenEditorComponent, MatIcon],
  templateUrl: './editor-viewer.component.html',
  styleUrls: ['./editor-viewer.component.scss']
})
export class EditorViewerComponent implements OnInit{
  @Input() type: EditorType = EditorType.PAGE_LAYOUT;
  @Input() page!: Page;

  @Input() okLabel = 'OK';
  @Input() cancelLabel = 'Cancel';

  @Output() editorActionEvent: EventEmitter<EditorAction> = new EventEmitter<EditorAction>();

  pageOutput!: Page;

  constructor(private gridStateService: PageStateService) {
  }

  ngOnInit(): void {
    if(this.page){
      this.pageOutput = JSON.parse(JSON.stringify(this.page)) ;
    }
  }

  updatePage(page:Page){
    this.pageOutput = page;
  }

  onCancel(): void {
    this.editorActionEvent.emit(EditorAction.CANCEL);

  }
  onOk(): void     {
    this.gridStateService.pushSnapshot(this.pageOutput)
    this.editorActionEvent.emit(EditorAction.OK);
  }

  protected readonly EditorType = EditorType;
}
