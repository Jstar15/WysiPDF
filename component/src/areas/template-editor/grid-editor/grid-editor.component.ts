import {
  Component,
  OnInit,
  ViewChild,
  ElementRef, ChangeDetectorRef, Output, EventEmitter, Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenAttribute } from "../../../models/TokenAttribute";
import { QuillEditorDialogComponent } from "../../../dialogs/quill-editor-dialog/quill-editor.dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {Cell, CellAttrs, Grid, Row, PageAttrs, ImageBlock} from "../../../models/interfaces";
import {CellAttributesDialogComponent} from "../../../dialogs/cell-attributes-dialog/cell-attributes-dialog.component";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {AddImageDialogComponent} from "../../../dialogs/add-image-dialog/add-image-dialog.component";
import {
  AddPartialContentDialogComponent,
  AddPartialContentDialogResult
} from "../../../dialogs/add-partial-content-dialog/add-partial-content-dialog.component";
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  DisplayLogicDialogComponent
} from "../../../dialogs/display-logic-dialog/display-logic-dialog.component";
import {DisplayLogicGroup} from "../../../models/display-logic.models";
import {IconService} from "../../../services/icon.service";

@Component({
  selector: 'app-grid-editor',
  standalone: true,
  imports: [CommonModule, MatIconButton, MatIcon, MatToolbar, MatTooltip, DragDropModule],
  templateUrl: './grid-editor.component.html',
  styleUrls: ['./grid-editor.component.scss']
})
export class GridEditorComponent implements OnInit {
  @ViewChild('gridContainer', { static: true }) gridContainer!: ElementRef;
  @Input() tokenAttrs?: TokenAttribute[] = [];
  @Input() partialContentAvailableList?: Grid[];
  @Input() hidePageBreak?: boolean = false;
  @Input() hidePartialContent?: boolean = false;
  @Input() pageAttrs?: PageAttrs = {};
  @Input() grid: Grid;
  @Output() gridChange = new EventEmitter<Grid>();
  selectedPartialId: string | null = null;
  isResizing = false;

  currentRow = 0;
  currentCol = -1;

  constructor(
      private dialog: MatDialog,
      private sanitizer: DomSanitizer,
      private cdr: ChangeDetectorRef,
      private iconService: IconService
  ) {
    this.iconService.registerIcons();
  }

  ngOnInit() {


    if (!this.grid.rows || this.grid.rows.length === 0) {
      this.grid.rows.push(this.createEmptyRow());
    }

    if (this.partialContentAvailableList?.length && !this.selectedPartialId) {
      this.selectedPartialId = this.partialContentAvailableList[0]?.id || null;
    }
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
      backgroundColor: this.pageAttrs.backgroundColor
    };
  }


  addRow() {
    this.grid.rows.splice(this.currentRow + 1, 0, this.createEmptyRow());
    this.currentRow++;
  }

  removeRow() {
    if (this.grid.rows.length > 0) {
      this.grid.rows.splice(this.currentRow, 1);
      this.currentRow = Math.max(0, this.currentRow - 1);
    }

    if (this.grid.rows.length === 0) {
      this.grid.rows.push(this.createEmptyRow());
      this.currentRow = 0;
    }

    this.emitChange();
  }

  addColumn() {
    const row = this.grid.rows[this.currentRow];
    const insertAt = this.currentCol >= 0 ? this.currentCol + 1 : row.cells.length;

    row.cells.splice(insertAt, 0, this.createEmptyCell());

    // Evenly distribute new widths
    const colCount = row.cells.length;
    row.widths = Array(colCount).fill(100 / colCount);
  }

  removeColumn() {
    const row = this.grid.rows[this.currentRow];
    if (this.currentCol >= 0 ) {
      row.cells.splice(this.currentCol, 1);
      row.widths.splice(this.currentCol, 1);

      const colCount = row.cells.length;
      row.widths = Array(colCount).fill(100 / colCount);
      this.currentCol = -1;
    }

    if (row.cells.length === 0) {
      row.cells = [this.createEmptyCell()];
      row.widths = [100];
    }

    this.emitChange();
  }

  onColResizeMouseDown(e: MouseEvent, rowIndex: number, colIndex: number) {
    this.isResizing = true;
    e.preventDefault();
    const startX = e.clientX;
    const row = this.grid.rows[rowIndex];
    const initialWidths = [...row.widths];
    const containerWidth = this.gridContainer.nativeElement.clientWidth;

    const mouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const delta = (dx / containerWidth) * 100;

      let a = initialWidths[colIndex] + delta;
      let b = initialWidths[colIndex + 1] - delta;

      if (a < 5) { a = 5; b = initialWidths[colIndex] + initialWidths[colIndex + 1] - 5; }
      if (b < 5) { b = 5; a = initialWidths[colIndex] + initialWidths[colIndex + 1] - 5; }

      row.widths[colIndex] = a;
      row.widths[colIndex + 1] = b;
      this.emitChange()
    };

    const mouseUp = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  onCellClick(rowIndex: number, colIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = colIndex;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private openEditorForCell(r: number, c: number): void {
    const row = this.grid.rows[r];
    const cell = row?.cells?.[c];
    if (!cell) {
      console.warn('Cell not found at', r, c);
      return;
    }

    if (cell.type === 'html') {
      const dialogRef = this.dialog.open(QuillEditorDialogComponent, {
        width: '1000px',
        minHeight: '500px',
        panelClass: 'app-dialog',
        data: {
          html: cell.value,
          attributes: this.tokenAttrs
        }
      });

      dialogRef.afterClosed().subscribe((result: string | undefined) => {
        if (result !== undefined) {
          // preserve your debug logging
          for (const char of result) {
            // eslint-disable-next-line no-console
            console.log(`'${char}' => U+${char.charCodeAt(0).toString(16).toUpperCase()}`);
          }
          this.grid.rows[r].cells[c].value = result;
          this.emitChange();
        }
      });
    } else if (cell.type === 'image') {
      // ensure selection for image dialog
      this.currentRow = r;
      this.currentCol = c;
      this.openAddImageDialog();
    }
  }


  onCellDoubleClick(r: number, c: number): void {
    this.currentRow = r;
    this.currentCol = c;
    this.openEditorForCell(r, c);
  }

  openCellEditorDialog(): void {
    const selectedCell = this.getSelectedCell();
    if (!selectedCell) {
      console.warn('No cell selected.');
      return;
    }
    this.openEditorForCell(selectedCell.rowIndex, selectedCell.colIndex);
  }

  emitChange(){
    this.gridChange.emit(this.grid);
  }


    openCellStyleEditorDialog(): void {
      // Replace with your actual cell selection logic
      const selectedCell = this.getSelectedCell(); // Assume this returns { cell: Cell, rowIndex: number, colIndex: number }

      if (!selectedCell) {
        console.warn('No cell selected.');
        return;
      }

      const dialogRef = this.dialog.open(CellAttributesDialogComponent, {
        width: '1000px',
        height: '600px',
        panelClass: 'app-dialog',
        data: selectedCell.cell.attrs  // Pass current attributes to dialog
      });

      dialogRef.afterClosed().subscribe((updatedAttrs: CellAttrs | undefined) => {
        if (updatedAttrs) {
          Object.assign(selectedCell.cell.attrs, updatedAttrs);
          this.emitChange()
        }
      });
  }

  openAddImageDialog(): void {
    const selectedCell = this.getSelectedCell(); // Assume this returns { cell: Cell, rowIndex: number, colIndex: number }

    if (!selectedCell) {
      console.warn('No cell selected.');
      return;
    }

    const { rowIndex, colIndex } = selectedCell;


    const dialogRef = this.dialog.open(AddImageDialogComponent, {
      width: '1000px',
      height: '600px',
      panelClass: 'app-dialog',
      data: selectedCell.cell.imageBlock
    });

    dialogRef.afterClosed().subscribe((result: ImageBlock | undefined) => {
      if (result) {
        console.log('Image inserted:', result);

        // Reassign the entire cell object to ensure reactivity
        const oldCell = this.grid.rows[rowIndex].cells[colIndex];
        this.grid.rows[rowIndex].cells[colIndex] = {
          ...oldCell,
          imageBlock: result,
          type: 'image'
        };

        this.cdr.detectChanges();  // Force view update
        this.emitChange();
      }
    });
  }


  private getSelectedCell(): { cell: Cell, rowIndex: number, colIndex: number } | null {
    if (this.currentRow >= 0 && this.currentCol >= 0) {
      const cell = this.grid.rows[this.currentRow].cells[this.currentCol];
      return {
        cell,
        rowIndex: this.currentRow,
        colIndex: this.currentCol
      };
    }
    return null;
  }

  addPartialRow(): void {
    if (!this.partialContentAvailableList?.length) {
      console.warn('No partial content available');
      return;
    }

    const dialogRef = this.dialog.open(AddPartialContentDialogComponent, {
      width: '700px',
      data: { partials: this.partialContentAvailableList }
    });

    dialogRef.afterClosed().subscribe((result: AddPartialContentDialogResult | undefined) => {
      if (result && result.selectedPartial) {
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
      }
    });
  }


  displayRulesDialog(): void {
    const selectedCell = this.getSelectedCell(); // Assume this returns { cell: Cell, rowIndex: number, colIndex: number }

    if (!selectedCell) {
      console.warn('No cell selected.');
      return;
    }

    const dialogRef = this.dialog.open(DisplayLogicDialogComponent, {
      width: '1000px',
      height: '600px',
      panelClass: 'app-dialog',
      data: {
        tokenAttrs: this.tokenAttrs,
        initialConfig: selectedCell.cell.displayLogic,
      },
    });

    dialogRef.afterClosed().subscribe((result: DisplayLogicGroup | undefined) => {
      if (result) {
        selectedCell.cell.displayLogic = result;
        this.emitChange();
      }
    });
  }

  onPartialRowClick(rowIndex: number): void {
    this.currentRow = rowIndex;
    this.currentCol = -1;
  }

  getPartialTemplateName(rowIndex: number): string {
    return this.grid.rows[rowIndex].partialContent.name;
  }

  addPageBreakRow() {
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

  dropRow(event: CdkDragDrop<any[]>) {
      moveItemInArray(this.grid.rows, event.previousIndex, event.currentIndex);
      this.currentRow = event.currentIndex;
      this.emitChange();
  }

  duplicateCurrentRow(): void {
    if (this.currentRow >= 0 && this.currentRow < this.grid.rows.length) {
      const originalRow = this.grid.rows[this.currentRow];

      const clonedRow: Row = structuredClone(originalRow);
      this.grid.rows.splice(this.currentRow + 1, 0, clonedRow);
      this.currentRow++; // Select the new one

      this.emitChange();
    }
  }

}
