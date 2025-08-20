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
import {Grid, Page, PageAttrs} from '../../models/interfaces';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {PdfViewerComponent} from "../../shared/pdf-viewer/pdf-viewer.component";
import {PageAttributesDialogComponent} from "../../dialogs/page-attributes-dialog/page-attributes-dialog.component";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import { MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {TokenEditorDialogComponent} from "../../dialogs/token-editor-dialog/token-editor-dialog.component";
import {
  EditPartialContentData,
  EditPartialContentDialogComponent
} from "../../dialogs/edit-partial-content-dialog/edit-partial-content-dialog.component";
import {GridHistoryService} from "../../services/grid-history.service";
import {debounceTime, Subject} from "rxjs";
import {JsonListItem, JsonViewerComponent} from "../../shared/json-viewer/json-viewer.component";
import {IconService} from "../../services/icon.service";
import {DEFAULT_PAGE} from "../../models/default-page";
import {collectDisplayRules} from "../../utils/displayLogic.utiltiy";

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
    JsonViewerComponent
  ]
})
export class TemplateEditorComponent implements OnInit,AfterViewInit {
  showRightPane: boolean = true;
  showPdfViewPane: boolean = true;
  jsonList: JsonListItem[] = [];

  @Input('page') page: Page = DEFAULT_PAGE;    // ← default value
  @Output('page-change') pageChange = new EventEmitter<Page>();

  pdfGenerationResult: PdfGenerationResult = {
    base64 : '',
    docDefinition: {
      content: ''
    },
    page: this.page
  };

  private emitChange$ = new Subject<boolean>();


  constructor(
      public dialog: MatDialog,
      private pdfService: PdfGenerateService,
      private gridHistoryService: GridHistoryService,
      private cdr: ChangeDetectorRef,
      private iconService: IconService,
  ) {

    this.iconService.registerIcons();

    // ✅ Debounced PDF update logic
    this.emitChange$.pipe(
      debounceTime(500) // 1 second debounce
    ).subscribe(push => {
      this._emitGridChange(push);
    });
  }

  ngAfterViewInit(): void {
    this._emitGridChange()
  }

  ngOnInit(): void {

  }

  openTokenEditorDialog(): void {
    const dialogRef = this.dialog.open(TokenEditorDialogComponent, {
      width: '1000px',
      height: '100%',
      panelClass: 'app-dialog',
      data: {attributes: this.page.tokenAttrs}
    });

    dialogRef.afterClosed().subscribe((result: TokenAttribute[] | null) => {
      if (result) {
        this.page.tokenAttrs = result;
        this._emitGridChange();

      }
    });
  }

  toggleRightPane(): void {
    this.showRightPane = !this.showRightPane;
  }
  togglePdfPane(): void {
    this.showPdfViewPane = !this.showPdfViewPane;
  }

  openPageEditorDialog(): void {
    const dialogRef = this.dialog.open(PageAttributesDialogComponent, {
      width: '1000px',
      height: '100%',
      panelClass: 'app-dialog',

      data: { ...this.page.pageAttrs }
    });

    dialogRef.afterClosed().subscribe((updatedAttrs: PageAttrs | undefined) => {
      if (updatedAttrs) {
        this.page.pageAttrs = updatedAttrs;
        this._emitGridChange();
      }
    });
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
          const availableTokens = this.getAvailableTokensFromJsonList(result.selectedToken.name);
          this.page.partialContent[index].tokenAttributeList = availableTokens;
          console.log('Available tokens from json[]:', availableTokens);
        }

      }
    });
  }

  getAvailableTokensFromJsonList(sourceName: string): TokenAttribute[] {
    const root = this.page.tokenAttrs.find(attr =>
        attr.name === sourceName && attr.type === TokenAttributeTypeEnum.JSON_ARRAY
    );

    if (!root) return [];

    try {
      const parsed = JSON.parse(root.value);
      if (!Array.isArray(parsed) || parsed.length === 0 || typeof parsed[0] !== 'object') {
        return [];
      }

      const firstItem = parsed[0];
      return Object.keys(firstItem).map(key => {
        const value = firstItem[key];
        let type: TokenAttributeTypeEnum;

        switch (typeof value) {
          case 'string':
            type = TokenAttributeTypeEnum.TEXT;
            break;
          case 'number':
            type = TokenAttributeTypeEnum.NUMBER;
            break;
          case 'boolean':
            type = TokenAttributeTypeEnum.BOOLEAN;
            break;
          case 'object':
            type = Array.isArray(value)
                ? TokenAttributeTypeEnum.STRING_ARRAY
                : TokenAttributeTypeEnum.OBJECT;
            break;
          default:
            type = TokenAttributeTypeEnum.TEXT;
        }

        return new TokenAttribute(`${sourceName}.${key}`, '', type);
      });
    } catch (err) {
      console.warn('Failed to parse json[] value:', root?.value);
      return [];
    }
  }


  private async _emitGridChange(push = true): Promise<void> {
    if (push) {
      this.gridHistoryService.pushSnapshot(this.page);
    }
    this.pdfGenerationResult = await this.pdfService.generatePdfBase64(this.page, this.page.tokenAttrs);
    this.jsonList = this.buildJsonViewerList(this.page, this.pdfGenerationResult);
    this.cdr.detectChanges();

    // ✅ Emit externally for consumers using onPageChange()
    this.pageChange.emit(this.page);
  }

  emitGridChange(push = true): void {
    this.emitChange$.next(push);
  }

  // ✅ New: Add partial content grid
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

  // ✅ New: Remove partial content grid by index
  removePartialContent(index: number): void {
    if (this.page.partialContent && index >= 0) {
      const updated = [...this.page.partialContent];
      updated.splice(index, 1);
      this.page.partialContent = updated;
    }
  }

  undo(): void {
    const previous = this.gridHistoryService.undo();
    if (previous) {
      this.page = previous;
      this._emitGridChange(false); // Don't push snapshot on undo
    }
  }

  redo(): void {
    const next = this.gridHistoryService.redo();
    if (next) {
      this.page = next;
      this._emitGridChange(false); // Don't push snapshot on redo
    }
  }

  canUndo(): boolean {
    return this.gridHistoryService.canUndo()
  }
  canRedo(): boolean {
    return this.gridHistoryService.canRedo()
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
        name: 'Injected Payload',
        description: 'Json data for partial/template injection (Test)',
        data: JSON.parse(page.tokenInjectionJson ? page.tokenInjectionJson : '{}')
      },{
        name: 'Tokens',
        description: 'Tokens defined that can be used inside a template',
        data: page.tokenAttrs
      },{
        name: 'Display Rules',
        description: 'Display Rules USed inside the template.',
        data: collectDisplayRules(page)
      }
    ];
    this.emitGridChange();

  }


}
