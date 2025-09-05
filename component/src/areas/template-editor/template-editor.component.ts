import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {AngularSplitModule} from 'angular-split';
import {GridEditorComponent} from './grid-editor/grid-editor.component';
import {PdfGenerateService, PdfGenerationResult} from '../../services/generators/pdf-generate.service';
import {Page} from '../../models/page';
import {NgIf, NgStyle} from "@angular/common";
import {PdfViewerComponent} from "../../shared/pdf-viewer/pdf-viewer.component";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader,} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {PageStateService} from "../../services/page-state.service";
import {JsonListItem, JsonViewerComponent} from "../../shared/json-viewer/json-viewer.component";
import {IconService} from "../../services/external/icon.service";
import {DEFAULT_PAGE} from "../../presets/default-page.preset";
import {PageTokenValidator} from "../../services/page-token-validator.service";
import {EditorViewerComponent} from "../editor-viewer/editor-viewer.component";
import {EditorType} from "../editor-viewer/editor-viewer.interfaces";
import {CellEditorViewerComponent} from "../cell-editor-viewer/cell-editor-viewer.component";
import {OpenCellEditorEvent} from "./grid-editor/grid-editor.interfaces";
import {DisplayLogicUtility} from "../../utils/display-logic.utility";
import {PanelTypes} from "./template-editor.interfaces";
import {RowEditorViewerComponent} from "../row-editor-viewer/row-editor-viewer.component";
import {CellEditorType} from "../cell-editor-viewer/cell-editor-viewer.interfaces";
import {RowEditorType} from "../row-editor-viewer/row-editor-viewer.interfaces";

@Component({
  standalone: true,
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,

  imports: [
    AngularSplitModule,
    MatExpansionModule,
    GridEditorComponent,
    NgIf,
    PdfViewerComponent,
    MatIcon,
    MatCard,
    MatCardContent,
    MatMiniFabButton,
    MatCardHeader,
    MatTooltip,
    MatCardActions,
    NgStyle,
    JsonViewerComponent,
    EditorViewerComponent,
    CellEditorViewerComponent,
    RowEditorViewerComponent,

  ]
})
export class TemplateEditorComponent implements OnInit,AfterViewInit {
  @Input('page') page: Page = DEFAULT_PAGE;    // ← default value
  @Output('page-change') pageChange = new EventEmitter<Page>();

  currentView: PanelTypes = PanelTypes.PDF_VIEW;
  area: string = null;

  showRightPane: boolean = true;
  showPdfViewPane: boolean = true;
  jsonList: JsonListItem[] = [];

  editorType: EditorType;
  cellEditorType: CellEditorType;
  rowEditorType: RowEditorType;

  pdfGenerationResult: PdfGenerationResult = {
    base64 : '',
    docDefinition: { content: '' },
    page: this.page
  };

  constructor(
      public dialog: MatDialog,
      private pdfService: PdfGenerateService,
      private cdr: ChangeDetectorRef,
      private iconService: IconService,
      private pageTokenValidator : PageTokenValidator,
      private gridStateService : PageStateService,
      private displayLogicUtility : DisplayLogicUtility
  ) {
    this.iconService.registerIcons();

    this.gridStateService.page$.pipe(
    ).subscribe(page => {
      if(page){
        this.page = page;
        this._onPageChange();
      }
    });
  }

  ngAfterViewInit(): void {
    this._onPageChange()
  }

  ngOnInit(): void {
  }

  private async _onPageChange(): Promise<void> {
    this.gridStateService.pushSnapshot(this.page);
    this.pdfGenerationResult = await this.pdfService.generatePdfBase64(this.page, this.page.tokenAttrs);
    this.page = this.pageTokenValidator.validatePage(this.page, this.page.tokenAttrs);
    this.jsonList = this.buildJsonViewerList(this.page, this.pdfGenerationResult);
    this.cdr.detectChanges();
  }

  openEditorViewer(editorType: EditorType){
    this.editorType = editorType;
    this.currentView = PanelTypes.PAGE_EDITOR;
  }

  onCellChange(type: CellEditorType){
    this.cellEditorType = type;
    this.currentView = PanelTypes.CELL_EDITOR;
  }

  onRowChange(type: RowEditorType){
    this.rowEditorType = type;
    this.currentView = PanelTypes.ROW_EDITOR;
  }

  toggleRightPane(): void {
    this.showRightPane = !this.showRightPane;
  }

  togglePdfPane(): void {
    if(this.currentView == PanelTypes.PDF_VIEW){
      this.currentView = PanelTypes.JSON_VIEW;
    }else{
      this.currentView = PanelTypes.PDF_VIEW;
    }
  }

  onPanelOpened(area: string){
    this.area = area;
  }

  closeEditors(){
    this.currentView = PanelTypes.PDF_VIEW;
  }

  undo(): void {
    const previous = this.gridStateService.undo();
    if (previous) {
      this.page = previous;
      this._onPageChange();
    }
  }

  redo(): void {
    const next = this.gridStateService.redo();
    if (next) {
      this.page = next;
      this._onPageChange();
    }
  }

  canUndo(): boolean {
    return this.gridStateService.canUndo()
  }
  canRedo(): boolean {
    return this.gridStateService.canRedo()
  }

  buildJsonViewerList(
    page: Page,
    pdfGenerationResult1: PdfGenerationResult
  ): { name: string; description: string; data: any }[] {

    // Already a clean JS string with inline functions
    let payloadStr: string = this.pdfService.convertToStringPayload(page);

    return [
      {
        name: 'WYSI Page Model',
        description: 'Raw editable layout page',
        data: pdfGenerationResult1.page
      },
      {
        name: 'PDFMake Definition',
        description: 'Converted document definition used to render the PDF',
        data: payloadStr
      },
      {
        name: 'Tokens',
        description: 'Tokens defined that can be used inside a template',
        data: page.tokenAttrs
      },
      {
        name: 'Display Rules',
        description: 'Display Rules used inside the template',
        data: this.displayLogicUtility.collectDisplayRules(page)
      }
    ];
  }


  protected readonly EditorType = EditorType;
  protected readonly PanelTypes = PanelTypes;
}
