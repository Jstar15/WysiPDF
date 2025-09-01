import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, take, takeUntil } from 'rxjs';
import { TokenAttribute } from '../../../models/TokenAttribute';
import {
  AddPartialContentDialogComponent,
  AddPartialContentDialogResult
} from '../../../dialogs/add-partial-content-dialog/add-partial-content-dialog.component';
import { IconService } from '../../../services/icon.service';
import {
  Cell,
  CellAttrs,
  Grid,
  Row,
  PageAttrs,
} from '../../../models/interfaces';
import {
  CellStyleToolbarComponent,
} from './cell-style-toolbar/cell-style-toolbar.component';
import {OpenCellEditorEvent} from "./grid-editor.interfaces";
import {CellEditorType} from "../../cell-editor-viewer/cell-editor-viewer.interfaces";
import {PageStateService} from "../../../services/page-state.service";

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
  public currentRow = 0;
  public currentCol = -1;
  private activeDialog: MatDialogRef<any, any> | null = null;
  private lastDialogOpenAt = 0;
  private destroy$ = new Subject<void>();
  private resizeEmitRAF?: number;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly sanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
    private readonly iconService: IconService,
    private  readonly pageStateService : PageStateService
  ) {
    this.iconService.registerIcons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.addRowIfNone();
  }
  // ---------------- lifecycle ----------------


  public ngOnInit(): void {
    this.addRowIfNone();
    if (this.partialContentAvailableList?.length && !this.selectedPartialId) {
      this.selectedPartialId = this.partialContentAvailableList[0]?.id ?? null;
    }
  }

  private addRowIfNone(){
    if (!this.grid?.rows || this.grid.rows.length === 0) {
      this.grid.rows = [this.createEmptyRow()];
    }
    this.selectFirstRowIfNoneSelected();
  }

  private selectFirstRowIfNoneSelected(){
    if(!this.currentRow){
      this.currentRow = 0;
      this.currentCol = 0;
      this.currentCell = this.grid.rows[this.currentRow].cells[this.currentCol];
    }
  }
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    try { this.activeDialog?.close(); } catch {}
    this.activeDialog = null;
    if (this.resizeEmitRAF) cancelAnimationFrame(this.resizeEmitRAF);
  }

  // ---------------- add/remove rows/cols ----------------

  public addRow(): void {
    this.grid.rows.splice(this.currentRow + 1, 0, this.createEmptyRow());
    this.currentRow++;
    this.currentCell = this.grid.rows[this.currentRow].cells[this.currentCol];
    this.emitChange();
  }

  public removeRow(): void {
    if (this.grid.rows.length > 0) {
      this.grid.rows.splice(this.currentRow, 1);
      this.currentRow = Math.max(0, this.currentRow - 1);
    }
    if (this.grid.rows.length === 0) {
      this.grid.rows.push(this.createEmptyRow());
      this.currentRow = 0;
    }
    this.currentCell = this.grid.rows[this.currentRow].cells[this.currentCol];
    this.emitChange();
  }

  public addColumn(): void {
    const row = this.grid.rows[this.currentRow];
    const insertAt = this.currentCol >= 0 ? this.currentCol + 1 : row.cells.length;
    row.cells.splice(insertAt, 0, this.createEmptyCell());
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
        row.cells = [this.createEmptyCell()];
        row.widths = [100];
      } else {
        this.redistributeWidths(row);
      }
      this.emitChange();
    }
  }

  // ---------------- resizing ----------------

  public onColResizeMouseDown(e: MouseEvent, rowIndex: number, colIndex: number): void {
    this.isResizing = true;
    e.preventDefault();

    const startX = e.clientX;
    const row = this.grid.rows[rowIndex];
    const initialWidths = [...row.widths];
    const containerWidth = Math.max(1, this.gridContainer.nativeElement.clientWidth);

    const mouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const delta = (dx / containerWidth) * 100;

      let a = initialWidths[colIndex] + delta;
      let b = initialWidths[colIndex + 1] - delta;

      const sum = initialWidths[colIndex] + initialWidths[colIndex + 1];
      if (a < 5) { a = 5; b = sum - 5; }
      if (b < 5) { b = 5; a = sum - 5; }

      row.widths[colIndex] = a;
      row.widths[colIndex + 1] = b;

      if (this.resizeEmitRAF) cancelAnimationFrame(this.resizeEmitRAF);
      this.resizeEmitRAF = requestAnimationFrame(() => this.emitChange());
    };

    const mouseUp = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
      this.emitChange();
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  // ---------------- selection & actions ----------------

  public onCellClick(rowIndex: number, colIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = colIndex;
    if (
      this.currentRow >= 0 &&
      this.currentCol >= 0 &&
      this.grid?.rows?.[this.currentRow]?.cells?.[this.currentCol]
    ) {
      this.currentCell =  this.grid?.rows?.[this.currentRow]?.cells?.[this.currentCol];
    }else{
      this.currentCell = null;
    }
  }

  public onCellDoubleClick(r: number, c: number): void {
    this.currentRow = r;
    this.currentCol = c;
    this.openEditorForCell(r, c);
  }

  public openCellEditorDialog(): void {
    const selected = this.currentCell;
    if (!selected) { console.warn('No cell selected.'); return; }
    this.cellChange.emit({
      cell: selected,
      row: this.currentRow,
      column: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',
      type: CellEditorType.HTML
    })
  }

  public openAddImageDialog(): void {
    const selected: Cell = this.currentCell;
    if (!selected) { console.warn('No cell selected.'); return; }

    // call parent fucntion here
    this.cellChange.emit({
      cell: selected,
      row: this.currentRow,
      column: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',      type: CellEditorType.IMAGE
    })
  }

  public openAddChartDialog(): void {
    const selected = this.currentCell;
    if (!selected) { console.warn('No cell selected.'); return; }

    this.cellChange.emit({
      cell: selected,
      row: this.currentRow,
      column: this.currentCol,
      area: (this.area) as 'content' | 'footer' | 'header',      type: CellEditorType.CHART
    })
  }

  public openAddBarcodeDialog(): void {
    const selected = this.currentCell;
    if (!selected) { console.warn('No cell selected.'); return; }

    this.cellChange.emit({
      cell: selected,
      row: this.currentRow,
      column: this.currentCol,
      area: 'content',
      type: CellEditorType.BARCODE
    })
  }
  public displayRulesDialog(): void {
    const selected = this.currentCell;
    if (!selected) { console.warn('No cell selected.'); return; }

    this.cellChange.emit({
      cell: selected,
      row: this.currentRow,
      column: this.currentCol,
      area: 'content',
      type: CellEditorType.DISPLAY_RULES
    })
  }




  public addPartialRow(): void {
    if (!this.partialContentAvailableList?.length) {
      console.warn('No partial content available');
      return;
    }

    const ref = this.openDialogOnce(() =>
      this.dialog.open<
        AddPartialContentDialogComponent,
        { partials: Grid[] },
        AddPartialContentDialogResult | undefined
      >(
        AddPartialContentDialogComponent,
        { width: '700px', data: { partials: this.partialContentAvailableList! } }
      )
    );
    if (!ref) return;

    ref.afterClosed().pipe(take(1), takeUntil(this.destroy$))
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
    const clonedRow: Row = (typeof structuredClone === 'function')
      ? structuredClone(originalRow)
      : this.clone(originalRow);
    this.grid.rows.splice(this.currentRow + 1, 0, clonedRow);
    this.currentRow++;
    this.emitChange();
  }



  // ---------------- private helpers ----------------

  private sanitizeHtmlInternal(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  public sanitizeHtml(html: string): SafeHtml {
    return this.sanitizeHtmlInternal(html);
  }

  private openEditorForCell(r: number, c: number): void {
    const row = this.grid.rows[r];
    const cell = row?.cells?.[c];
    this.currentRow = r;
    this.currentCol = c;

    if (!cell) { console.warn('Cell not found at', r, c); return; }

    if (cell.type === 'html') {
      this.openCellEditorDialog();
    } else if (cell.type === 'image') {
      this.openAddImageDialog();
    } else if (cell.type === 'chart') {
      this.openAddChartDialog();
    }else if (cell.type === 'barcode') {
      this.openAddBarcodeDialog();
    }
  }

  private openDialogOnce<T, R>(
    makeDialog: () => MatDialogRef<T, R>,
    debounceMs: number = 250
  ): MatDialogRef<T, R> | null {
    const now = Date.now();
    if (this.activeDialog) return null;
    if (now - this.lastDialogOpenAt < debounceMs) return null;
    this.lastDialogOpenAt = now;

    const ref = makeDialog();
    this.activeDialog = ref;

    // Ensure proper teardown and re-entry safety
    ref.beforeClosed().pipe(takeUntil(this.destroy$)).subscribe({ next: () => {} });

    ref.afterClosed().pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: () => (this.activeDialog = null),
        error: () => (this.activeDialog = null),
        complete: () => (this.activeDialog = null)
      });

    return ref;
  }


  private createEmptyCell(): Cell {
    return {
      type: 'html',
      value: '',
      attrs: {
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        borderTop: 0,
        borderRight: 0,
        borderBottom: 0,
        borderLeft: 0,
        borderColor: 'white',
        backgroundColor: 'transparent'
      }
    };
  }

  private createEmptyRow(): Row {
    return {
      height: 50,
      widths: [100],
      cells: [this.createEmptyCell()],
      backgroundColor: this.pageAttrs?.backgroundColor
    };
  }

  private redistributeWidths(row: Row): void {
    const colCount = Math.max(1, row.cells.length);
    row.widths = Array(colCount).fill(100 / colCount);
  }

  public emitChange(): void {
    this.pageStateService.updateGrid(this.area, this.grid)
  }

  public setCellAttribute(cellAttrs: CellAttrs): void {
    this.currentCell.attrs = cellAttrs;
    this.pageStateService.updateGrid(this.area, this.grid)
  }

  private clone<T>(obj: T): T {
    if (obj == null) return obj as T;
    try {
      // @ts-ignore runtime only
      if (typeof structuredClone === 'function') return structuredClone(obj);
    } catch {}
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch {
      if (Array.isArray(obj)) return ([...obj] as unknown) as T;
      if (typeof obj === 'object') return ({ ...(obj as any) } as unknown) as T;
      return obj;
    }
  }
}
