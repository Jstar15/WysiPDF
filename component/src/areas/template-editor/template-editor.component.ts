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
import {PdfGenerateService, PdfGenerationResult} from '../../services/pdf-generate.service';
import {TokenAttribute} from '../../models/TokenAttribute';
import {TokenAttributeTypeEnum} from '../../models/TokenAttributeTypeEnum';
import {Cell, Grid, Page} from '../../models/interfaces';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {PdfViewerComponent} from "../../shared/pdf-viewer/pdf-viewer.component";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader,} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {EditPartialContentData, EditPartialContentDialogComponent} from "../../dialogs/edit-partial-content-dialog/edit-partial-content-dialog.component";
import {PageStateService} from "../../services/page-state.service";
import {debounceTime, Subject} from "rxjs";
import {JsonListItem, JsonViewerComponent} from "../../shared/json-viewer/json-viewer.component";
import {IconService} from "../../services/icon.service";
import {DEFAULT_PAGE} from "../../presets/default-page";
import {collectDisplayRules} from "../../utils/displayLogic.utiltiy";
import {PageTokenValidator} from "../../services/page-token-validator.service";
import {JsonTokenParserService} from "../../utils/json-token-parser.service";
import {EditorViewerComponent} from "./editor-viewer/editor-viewer.component";
import {EditorType} from "./editor-viewer/editor-viewer.interfaces";
import {CellEditorViewerComponent} from "../cell-editor-viewer/cell-editor-viewer.component";
import {OpenCellEditorEvent} from "./grid-editor/grid-editor.interfaces";

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
    NgForOf,
    MatIconButton,
    MatCardActions,
    NgStyle,
    JsonViewerComponent,
    EditorViewerComponent,
    CellEditorViewerComponent,

  ]
})
export class TemplateEditorComponent implements OnInit,AfterViewInit {
  @Input('page') page: Page = DEFAULT_PAGE;    // ← default value
  @Output('page-change') pageChange = new EventEmitter<Page>();

  showRightPane: boolean = true;
  showPdfViewPane: boolean = true;
  jsonList: JsonListItem[] = [];

  iEditOpen: boolean = false;
  isCellEditorOpen: boolean = false;
  editorType: EditorType;
  lastCellEditorEvent: OpenCellEditorEvent;

  pdfGenerationResult: PdfGenerationResult = {
    base64 : '',
    docDefinition: { content: '' },
    page: this.page
  };

  private emitChange$ = new Subject<boolean>();

  constructor(
      public dialog: MatDialog,
      private pdfService: PdfGenerateService,
      private cdr: ChangeDetectorRef,
      private iconService: IconService,
      private pageTokenValidator : PageTokenValidator,
      private jsonTokenParserService: JsonTokenParserService,
      private gridStateService : PageStateService
  ) {


    this.iconService.registerIcons();

    this.gridStateService.page$.subscribe(page => {
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

  emitPageChange(): void {
    this.emitChange$.next(true);
  }

  toggleRightPane(): void {
    this.showRightPane = !this.showRightPane;
  }
  togglePdfPane(): void {
    this.showPdfViewPane = !this.showPdfViewPane;
  }

  openEditorViewer(editorType: EditorType){
    this.editorType = editorType;
    this.iEditOpen = true;
    this.isCellEditorOpen = false;
  }

  onCellChange(event: OpenCellEditorEvent){
    this.lastCellEditorEvent = event;
    this.iEditOpen = false;
    this.isCellEditorOpen = true;
  }

  closeEditors(){
    this.iEditOpen = false;
    this.isCellEditorOpen = false;
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
    return [
      {
        name: 'WYSI Page Model',
        description: 'Raw editable layout page with partials and blocks',
        data: page
      },
      {
        name: 'WYSI Page Model (HTML expanded)',
        description: 'Raw editable layout page with partials and blocks',
        data: pdfGenerationResult1.page
      },
      {
        name: 'PDFMake Definition',
        description: 'Converted document definition used to render the PDF',
        data: pdfGenerationResult1.docDefinition
      },
      {
        name: 'Tokens',
        description: 'Tokens defined that can be used inside a template',
        data: page.tokenAttrs
      },
      {
        name: 'Display Rules',
        description: 'Display Rules USed inside the template.',
        data: collectDisplayRules(page)
      }
    ];
  }







  addPartialContent(): void {
    const newGrid: Grid = {
      id: 'partial_' + Date.now(),
      name: 'Partial Content',
      tokenSource: 'root',
      rows: [],
      tokenAttributeList: this.page.tokenAttrs
    };
    this.page.partialContent = [...(this.page.partialContent || []), newGrid];
  }

  removePartialContent(index: number): void {
    if (this.page.partialContent && index >= 0) {
      const updated = [...this.page.partialContent];
      updated.splice(index, 1);
      this.page.partialContent = updated;
    }
  }

  editPartialContent(index: number): void {
    const allowedTypes = [
      TokenAttributeTypeEnum.OBJECT,
      TokenAttributeTypeEnum.STRING_ARRAY,
      TokenAttributeTypeEnum.JSON_ARRAY,
    ];

    const tokenOptions: TokenAttribute[] = this.page.tokenAttrs
      .filter(t => allowedTypes.includes(t.type));

    const dialogRef = this.dialog.open(EditPartialContentDialogComponent, {
      width: '700px',
      data: {
        name: this.page.partialContent[index].name,
        tokenOptions: tokenOptions,
        selectedToken: this.page.partialContent[index].tokenSource || 'root'
      }
    });

    dialogRef.afterClosed().subscribe((result: EditPartialContentData) => {
      if (result !== undefined) {
        debugger;
        this.page.partialContent[index].tokenSource = result.selectedToken.name;
        this.page.partialContent[index].name = result.name;

        if(result.selectedToken.name == 'root'){
          this.page.partialContent[index].tokenAttributeList = this.page.tokenAttrs;
        }else{
          const availableTokens: TokenAttribute[] = this.jsonTokenParserService.getAvailableTokensFromJsonList(result.selectedToken.name, this.page.tokenAttrs);
          this.page.partialContent[index].tokenAttributeList = availableTokens;
          console.log('Available tokens from json[]:', availableTokens);
        }
        this._onPageChange();

      }
    });
  }

  protected readonly EditorType = EditorType;
}
