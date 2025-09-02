import {Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, take, takeUntil } from 'rxjs';
import { TokenAttribute } from '../../../models/TokenAttribute';
import {AddPartialContentDialogComponent, AddPartialContentDialogResult} from '../../../dialogs/add-partial-content-dialog/add-partial-content-dialog.component';
import { IconService } from '../../../services/external/icon.service';
import {Cell, CellAttrs, Grid, Row, PageAttrs,} from '../../../models/page';
import {CellStyleToolbarComponent,} from './cell-style-toolbar/cell-style-toolbar.component';
import {OpenCellEditorEvent} from "./grid-editor.interfaces";
import {CellEditorType} from "../../cell-editor-viewer/cell-editor-viewer.interfaces";
import {PageStateService} from "../../../services/page-state.service";
import {createEmptyCell, createEmptyRow} from "../../../presets/default-page.preset";

@Component({
  selector: 'app-grid-editor',
  standalone: true,
  imports: [CommonModule, MatIconButton, MatIcon, MatTooltip, DragDropModule, CellStyleToolbarComponent],
  templateUrl: './grid-editor.component.html',
  styleUrls: ['./grid-editor.component.scss']
})
export class GridEditorComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('gridContainer', { static: true }) public gridContainer!: ElementRef<HTMLDivElement>;

  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Input() public partialContentAvailableList?: Grid[];
  @Input() public hidePageBreak: boolean = false;
  @Input() public hidePartialContent: boolean = false;
  @Input() public hideChart: boolean = false;
  @Input() public hideBarcode: boolean = false;
  @Input() public pageAttrs: PageAttrs = {};
  @Input() public colorPalettes: string[] | undefined = [];
  @Input() public grid!: Grid;
  @Input() public area!: string;

  @Output() public cellChange: EventEmitter<OpenCellEditorEvent> = new EventEmitter<OpenCellEditorEvent>();

  public selectedPartialId: string | null = null;
  public isResizing = false;

  public currentCell: Cell | null = null;
  public currentRow: number = 0;
  public currentCol: number = -1;
  private destroy$: Subject<void> = new Subject<void>();
  private resizeEmitRAF?: number;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly sanitizer: DomSanitizer,
    private readonly iconService: IconService,
    private  readonly pageStateService : PageStateService
  ) {
    this.iconService.registerIcons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.addRowIfNone();
  }

  public ngOnInit(): void {
    this.addRowIfNone();
    if (this.partialContentAvailableList?.length && !this.selectedPartialId) {
      this.selectedPartialId = this.partialContentAvailableList[0]?.id ?? null;
    }
  }

  private addRowIfNone(){
    if (!this.grid?.rows || this.grid.rows.length === 0) {
      this.grid.rows = [createEmptyRow()];
    }
    this.selectFirstRowIfNoneSelected();
  }

  private selectFirstRowIfNoneSelected(){
    if(!this.currentRow){
      this.currentRow = 0;
      this.currentCol = 0;
      this.updateCurrentCell();
    }
  }

  public updateCurrentCell(): void{
    if (
      this.currentRow >= 0 &&
      this.currentCol >= 0 &&
      this.grid?.rows?.[this.currentRow]?.cells?.[this.currentCol]
    ) {
      this.currentCell = this.grid?.rows?.[this.currentRow]?.cells?.[this.currentCol];
    }else{
      this.currentCell = null;
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.resizeEmitRAF) cancelAnimationFrame(this.resizeEmitRAF);
  }

  public addRow(): void {
    this.grid.rows.splice(this.currentRow + 1, 0, createEmptyRow());
    this.currentRow++;
    this.updateCurrentCell();
    this.emitChange();
  }

  public removeRow(): void {
    if (this.grid.rows.length > 0) {
      this.grid.rows.splice(this.currentRow, 1);
      this.currentRow = Math.max(0, this.currentRow - 1);
    }
    if (this.grid.rows.length === 0) {
      this.grid.rows.push(createEmptyRow());
      this.currentRow = 0;
    }
    this.updateCurrentCell();
    this.emitChange();
  }

  public addColumn(): void {
    const row: Row = this.grid.rows[this.currentRow];
    const insertAt: number = this.currentCol >= 0 ? this.currentCol + 1 : row.cells.length;
    row.cells.splice(insertAt, 0, createEmptyCell());
    this.redistributeWidths(row);
    this.emitChange();
  }

  public removeColumn(): void {
    const row = this.grid.rows[this.currentRow];
    if (this.currentCol >= 0) {
      row.cells.splice(this.currentCol, 1);
      row.widths.splice(this.currentCol, 1);
      this.currentCol = -1;
      if (row.cells.length === 0) {
        row.cells = [createEmptyCell()];
        row.widths = [100];
      } else {
        this.redistributeWidths(row);
      }
      this.emitChange();
    }
  }

  public onColResizeMouseDown(e: MouseEvent, rowIndex: number, colIndex: number): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.grid?.rows?.[rowIndex] || this.grid.rows[rowIndex].widths?.[colIndex + 1] == null) return;

    this.isResizing = true;

    // prevent text selection while dragging
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const startX = e.clientX;
    const row = this.grid.rows[rowIndex];
    const initialWidths = [...row.widths];
    const containerWidth = Math.max(1, this.gridContainer?.nativeElement?.clientWidth ?? 1);
    const minPercent = 5; // keep columns usable
    let didDrag = false;

    const mouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      if (dx !== 0) didDrag = true;

      const delta = (dx / containerWidth) * 100;
      const sum = initialWidths[colIndex] + initialWidths[colIndex + 1];

      // candidate new sizes
      let a = initialWidths[colIndex] + delta;
      let b = sum - a;

      // clamp to min bounds while preserving the pair sum
      if (a < minPercent) { a = minPercent; b = sum - minPercent; }
      if (b < minPercent) { b = minPercent; a = sum - minPercent; }

      // optional: round for stability
      row.widths[colIndex]     = Math.max(minPercent, Math.min(sum - minPercent, +a.toFixed(2)));
      row.widths[colIndex + 1] = Math.max(minPercent, Math.min(sum - minPercent, +b.toFixed(2)));
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
      this.isResizing = false;

      // restore selection
      document.body.style.userSelect = prevUserSelect;

      // cancel any pending RAF from older code paths
      if (this.resizeEmitRAF) {
        cancelAnimationFrame(this.resizeEmitRAF);
        this.resizeEmitRAF = 0 as any;
      }
    };

    const mouseUp = () => {
      cleanup();
      // emit only if there was an actual drag
      if (didDrag) this.emitChange();
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  public onCellClick(rowIndex: number, colIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = colIndex;
    this.updateCurrentCell();
  }

  public onCellDoubleClick(rowIndex: number, colIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = colIndex;
    this.currentCell =  this.grid?.rows?.[this.currentRow]?.cells?.[this.currentCol];
    this.openEditorForCell(rowIndex, colIndex);
  }

  public openCellEditorDialog(): void {
    this.cellChange.emit({
      cell: this.currentCell,
      rowIndex: this.currentRow,
      columnIndex: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',
      type: CellEditorType.HTML
    })
  }

  public openAddImageDialog(): void {
    this.cellChange.emit({
      cell: this.currentCell,
      rowIndex: this.currentRow,
      columnIndex: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',
      type: CellEditorType.IMAGE
    })
  }

  public openAddChartDialog(): void {
    this.cellChange.emit({
      cell: this.currentCell,
      rowIndex: this.currentRow,
      columnIndex: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',
      type: CellEditorType.CHART
    })
  }

  public openAddBarcodeDialog(): void {
    this.cellChange.emit({
      cell: this.currentCell,
      rowIndex: this.currentRow,
      columnIndex: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',
      type: CellEditorType.BARCODE
    })
  }

  public displayRulesDialog(): void {
    this.cellChange.emit({
      cell: this.currentCell,
      rowIndex: this.currentRow,
      columnIndex: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',
      type: CellEditorType.DISPLAY_RULES
    })
  }

  private openEditorForCell(r: number, c: number): void {
    const selected = this.currentCell;
    if (!selected) { console.warn('No cell selected.'); return; }

    if (this.currentCell.type === 'html') {
      this.openCellEditorDialog();
    } else if (this.currentCell.type === 'image') {
      this.openAddImageDialog();
    } else if (this.currentCell.type === 'chart') {
      this.openAddChartDialog();
    }else if (this.currentCell.type === 'barcode') {
      this.openAddBarcodeDialog();
    }
  }

  public addPageBreakRow(): void {
    const row: Row = {
      type: 'page-break',
      height: 10,
      widths: [],
      cells: [],
      backgroundColor: 'transparent'
    };
    this.grid.rows.splice(this.currentRow + 1, 0, row);
    this.currentRow++;
    this.emitChange();
  }

  public dropRow(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.grid.rows, event.previousIndex, event.currentIndex);
    this.currentRow = event.currentIndex;
    this.emitChange();
  }

  public duplicateCurrentRow(): void {
    if (this.currentRow < 0 || this.currentRow >= this.grid.rows.length) return;
    const originalRow = this.grid.rows[this.currentRow];
    const clonedRow: Row = structuredClone(originalRow)
    this.grid.rows.splice(this.currentRow + 1, 0, clonedRow);
    this.currentRow++;
    this.emitChange();
  }

  private redistributeWidths(row: Row): void {
    const colCount = Math.max(1, row.cells.length);
    row.widths = Array(colCount).fill(100 / colCount);
  }

  public emitChange(): void {
    this.pageStateService.updateGrid(this.area, this.grid)
  }

  public setCellAttribute(cellAttrs: CellAttrs): void {
    this.grid.rows[this.currentRow].cells[this.currentCol].attrs = cellAttrs;
    this.pageStateService.updateGrid(this.area, this.grid)
  }

  private sanitizeHtmlInternal(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  public sanitizeHtml(html: string): SafeHtml {
    return this.sanitizeHtmlInternal(html);
  }

  public addPartialRow(): void {
    if (!this.partialContentAvailableList?.length) {
      console.warn('No partial content available');
      return;
    }

    this.dialog.open<AddPartialContentDialogComponent, { partials: Grid[] }, AddPartialContentDialogResult | undefined>(
        AddPartialContentDialogComponent,
        { width: '700px', data: { partials: this.partialContentAvailableList! } }
      ).afterClosed().pipe(take(1), takeUntil(this.destroy$))
      .subscribe((result: AddPartialContentDialogResult | undefined) => {
        if (!result?.selectedPartial) return;

        const row: Row = {
          type: 'partial-content',
          height: 50,
          widths: [],
          cells: [],
          backgroundColor: this.pageAttrs?.backgroundColor || 'transparent',
          partialContent: result.selectedPartial
        };

        this.grid.rows.splice(this.currentRow + 1, 0, row);
        this.currentRow++;
        this.emitChange();
      });
  }

  public onPartialRowClick(rowIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = -1;
  }

  public getPartialTemplateName(rowIndex: number): string {
    return this.grid.rows[rowIndex]?.partialContent?.name ?? '';
  }
}
