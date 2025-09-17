import {Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { TokenAttribute } from '../../../models/token-attribute';
import { IconService } from '../../../services/icon.service';
import {  Grid, Row, PageAttrs, Cell,} from '../../../models/page';
import {CellStyleToolbarComponent,} from '../toolbar/cell-style-toolbar/cell-style-toolbar.component';
import {CellEditorType} from "../../cell-editor-viewer/cell-editor-viewer.interfaces";
import {PageStateService} from "../../../services/page-state.service";
import {createEmptyCell, createEmptyRow} from "../../../presets/default-page.preset";
import {RowEditorType} from "../../row-editor-viewer/row-editor-viewer.interfaces";
import {GridEventType} from "./grid-editor.interfaces";

@Component({
  selector: 'app-grid-editor',
  standalone: true,
  imports: [CommonModule, MatIconButton, MatIcon, MatTooltip, DragDropModule],
  templateUrl: './grid-editor.component.html',
  styleUrls: ['./grid-editor.component.scss']
})
export class GridEditorComponent implements OnInit, OnDestroy {
  @ViewChild('gridContainer', { static: true }) public gridContainer!: ElementRef<HTMLDivElement>;

  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Input() public pageAttrs: PageAttrs = {};
  @Input() public colorPalettes: string[] | undefined = [];
  @Input() public grid!: Grid;
  @Input() public area!: string;
  @Input() public isAreaActive: boolean;


  @Output() public cellChange: EventEmitter<CellEditorType> = new EventEmitter<CellEditorType>();
  @Output() public rowChange: EventEmitter<RowEditorType> = new EventEmitter<RowEditorType>();

  public isResizing = false;

  public currentRow: number = 0;
  public currentCol: number = 0;

  private destroy$: Subject<void> = new Subject<void>();
  private resizeEmitRAF?: number;

  public constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly iconService: IconService,
    private readonly pageStateService: PageStateService
  ) {
    this.iconService.registerIcons();

    this.pageStateService.grid$
      .pipe()
      .subscribe(gridEvent => {

        if(this.isAreaActive && gridEvent && gridEvent.area != null && gridEvent.area == this.area){
          const type: GridEventType = gridEvent.type;
          switch (type) {
            case GridEventType.ADD_ROW:
              this.addRow();
              break;

            case GridEventType.REMOVE_ROW:
              this.removeRow();
              break;

            case GridEventType.DUPLICATE_ROW:
              this.duplicateCurrentRow();
              break;

            case GridEventType.ADD_COLUMN:
              this.addColumn();
              break;

            case GridEventType.REMOVE_COLUMN:
              this.removeColumn();
              break;

            case GridEventType.ADD_PAGE_BREAK:
              this.addPageBreakRow();
              break;
            default:
              console.warn('Unhandled grid event:', gridEvent);
              break;
          }
        }

      });
  }



  public ngOnInit(): void {

  }


  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.resizeEmitRAF) cancelAnimationFrame(this.resizeEmitRAF);
  }

  public addRow(): void {
    this.grid.rows.splice(this.currentRow + 1, 0, createEmptyRow());
    this.currentRow++;
    this.updateGrid();
  }

  public removeRow(): void {
    if (this.grid.rows.length > 0) {
      this.grid.rows.splice(this.currentRow, 1);
      this.currentRow = Math.max(0, this.currentRow - 1);
      this.currentCol = 0;
    }
    if (this.grid.rows.length === 0) {
      this.grid.rows.push(createEmptyRow());
      this.currentRow = 0;
      this.currentCol = 0;
    }
    this.updateGrid();
  }

  private updateGrid(){
    this.emitCellLocation()
    this.pageStateService.updateGrid(this.grid);
  }


  public addColumn(): void {
    const row: Row = this.grid.rows[this.currentRow];
    const insertAt: number = this.currentCol >= 0 ? this.currentCol + 1 : row.cells.length;
    row.cells.splice(insertAt, 0, createEmptyCell());
    this.redistributeWidths(row);
    this.updateGrid();
  }

  public removeColumn(): void {
    const row = this.grid.rows[this.currentRow];
    if (!row || row.cells.length === 0) return;

    // Clamp currentCol just in case
    this.currentCol = Math.max(0, Math.min(this.currentCol, row.cells.length - 1));

    const removedIndex = this.currentCol;

    // Remove the column + width
    row.cells.splice(removedIndex, 1);
    row.widths.splice(removedIndex, 1);

    if (row.cells.length === 0) {
      // Always keep at least one cell
      row.cells = [createEmptyCell()];
      row.widths = [100];
      this.currentCol = 0;
    } else {
      // Prefer the column that slid into the removed position (the "next" one)
      let nextIndex = removedIndex; // after splice, this is the right/next column
      if (nextIndex >= row.cells.length) {
        // if we removed the last column, go left
        nextIndex = row.cells.length - 1;
      }
      if (nextIndex < 0) nextIndex = 0; // safety clamp
      this.currentCol = nextIndex;

      this.redistributeWidths(row);
    }

    this.updateGrid(); // emits & persists
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
      if (didDrag) {
        this.updateGrid();
      }
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  emitCellLocation(){
    this.pageStateService.updateCurrentCell(this.area, this.currentRow, this.currentCol);
  }

  public onCellClick(rowIndex: number, colIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = colIndex;
    this.emitCellLocation();
  }

  public onCellDoubleClick(rowIndex: number, colIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = colIndex;
    this.openEditorForCell(rowIndex, colIndex);
  }

  public openCellEditorDialog(): void {
    this.emitCellLocation();
    this.cellChange.emit(CellEditorType.HTML);
  }

  public openAddImageDialog(): void {
    this.emitCellLocation();
    this.cellChange.emit(CellEditorType.IMAGE);
  }

  public openAddChartDialog(): void {
    this.emitCellLocation();
    this.cellChange.emit(CellEditorType.CHART);
  }

  public openAddBarcodeDialog(): void {
    this.emitCellLocation();
    this.cellChange.emit(CellEditorType.BARCODE);
  }

  private openEditorForCell(r: number, c: number): void {
    const selected = this.pageStateService.getCurrentCell();
    if (!selected) { console.warn('No cell selected.'); return; }

    if (selected.type === 'html') {
      this.openCellEditorDialog();
    } else if (selected.type === 'image') {
      this.openAddImageDialog();
    } else if (selected.type === 'chart') {
      this.openAddChartDialog();
    }else if (selected.type === 'barcode') {
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
    this.updateGrid();
  }

  public dropRow(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.grid.rows, event.previousIndex, event.currentIndex);
    this.currentRow = event.currentIndex;
    this.updateGrid();
  }

  public duplicateCurrentRow(): void {
    if (this.currentRow < 0 || this.currentRow >= this.grid.rows.length) return;
    const originalRow = this.grid.rows[this.currentRow];
    const clonedRow: Row = structuredClone(originalRow)
    this.grid.rows.splice(this.currentRow + 1, 0, clonedRow);
    this.currentRow++;
    this.updateGrid();
  }

  private redistributeWidths(row: Row): void {
    const colCount = Math.max(1, row.cells.length);
    row.widths = Array(colCount).fill(100 / colCount);
  }

  private sanitizeHtmlInternal(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  public sanitizeHtml(html: string): SafeHtml {
    return this.sanitizeHtmlInternal(html);
  }

  public onRowClick(rowIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = -1;
  }

}
