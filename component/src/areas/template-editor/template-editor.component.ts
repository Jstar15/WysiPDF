import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter, Inject,
  Input, NgZone,
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
import {NgIf} from "@angular/common";
import {PdfViewerComponent} from "../../shared/pdf-viewer/pdf-viewer.component";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader,} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {PageStateService} from "../../services/page-state.service";
import {IconService} from "../../services/icon.service";
import {DEFAULT_PAGE} from "../../presets/default-page.preset";
import {PageTokenValidator} from "../../services/page-token-validator.service";
import {EditorViewerComponent} from "../editor-viewer/editor-viewer.component";
import {EditorType} from "../editor-viewer/editor-viewer.interfaces";
import {CellEditorViewerComponent} from "../cell-editor-viewer/cell-editor-viewer.component";
import {DisplayLogicUtility} from "../../utils/display-logic.utility";
import {PanelTypes} from "./template-editor.interfaces";
import {RowEditorViewerComponent} from "../row-editor-viewer/row-editor-viewer.component";
import {CellEditorType} from "../cell-editor-viewer/cell-editor-viewer.interfaces";
import {RowEditorType} from "../row-editor-viewer/row-editor-viewer.interfaces";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {AceEditorComponent} from "../../shared/ace-editor/ace-editor.component";
import {JsonListItem} from "../../shared/ace-editor/ace-editor.interface";

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
    MatCardHeader,
    MatCardActions,
    EditorViewerComponent,
    CellEditorViewerComponent,
    RowEditorViewerComponent,
    ToolbarComponent,
    AceEditorComponent,

  ]
})
export class TemplateEditorComponent implements OnInit,AfterViewInit {
  @Input('page') page: Page = DEFAULT_PAGE;    // ← default value
  @Output('page-change') pageChange = new EventEmitter<Page>();

  currentView: PanelTypes = PanelTypes.PDF_VIEW;
  area: string;

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
      private displayLogicUtility : DisplayLogicUtility,
      @Inject(ElementRef) private host: ElementRef<any> // 🔹 use @Inject here
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

  dispatchPageEvent(){
    const event = new CustomEvent('page-change', { detail: this.page });
    this.host.nativeElement.dispatchEvent(event);
  }

  ngOnInit(): void {
  }

  private async _onPageChange(): Promise<void> {
    const leftPane = document.querySelector('.left-pane') as any;
    const rightPane = document.querySelector('.right-pane') as any;
    const leftScroll = leftPane?.scrollTop || 0;
    const rightScroll = rightPane?.scrollTop || 0;

    this.gridStateService.pushSnapshot(this.page);

    // Update page in place
    const validatedPage = this.pageTokenValidator.validatePage(this.page, this.page.tokenAttrs);
    Object.assign(this.page, validatedPage);
    if (validatedPage.header) Object.assign(this.page.header, validatedPage.header);
    if (validatedPage.header2) Object.assign(this.page.header2, validatedPage.header2);
    if (validatedPage.content) Object.assign(this.page.content, validatedPage.content);
    if (validatedPage.footer) Object.assign(this.page.footer, validatedPage.footer);


    this.cdr.detectChanges();

    // Generate PDF async
    const pdfResult = await this.pdfService.generatePdfBase64(this.page, this.page.tokenAttrs);

    // Assign PDF result without replacing page
    this.pdfGenerationResult.base64 = pdfResult.base64;
    this.pdfGenerationResult.docDefinition = pdfResult.docDefinition;
    this.pdfGenerationResult.page = pdfResult.page;

    this.jsonList = this.buildJsonViewerList(this.page, this.pdfGenerationResult);

    // Wait for next frame after PDF view has rendered
    requestAnimationFrame(() => {
      if (leftPane) leftPane.scrollTop = leftScroll;
      if (rightPane) rightPane.scrollTop = rightScroll;
    });

    this.dispatchPageEvent();
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

  onPanelOpened(area: string){
    this.area = area;
    this.gridStateService.updateArea(area);
  }

  closeEditors(){
    this.currentView = PanelTypes.PDF_VIEW;
  }


  buildJsonViewerList(
    page: Page,
    pdfGenerationResult1: PdfGenerationResult
  ): { name: string; description: string; data: any }[] {

    // Already a clean JS string with inline functions
    let payloadStr: string = this.pdfService.convertToStringPayload(page);

    return [
      {
        name: 'PDFMake Definition',
        description: 'Converted document definition used to render the PDF',
        data: payloadStr
      },
      {
        name: 'WYSI Page Model',
        description: 'Raw page model',
        data: pdfGenerationResult1.page
      },
      {
        name: 'Tokens',
        description: 'Tokens defined that can be used inside a template',
        data: page.tokenAttrs
      },
      {
        name: 'Display Rules',
        description: 'Display Rules used inside the template',
        data: JSON.stringify(this.displayLogicUtility.collectDisplayRules(page))
      }
    ];
  }

  isEditorOpen(){
    if(this.currentView != PanelTypes.PDF_VIEW && this.currentView != PanelTypes.JSON_VIEW){
      return true;
    }
    return false;
  }
  protected readonly PanelTypes = PanelTypes;
}
