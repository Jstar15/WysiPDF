import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Cell, CellAttrs, Grid, Page, Row} from '../models/page';
import {DisplayLogicGroup} from "../models/display-logic.models";
import {TokenAttribute} from "../models/token-attribute";
import {GridEvent, GridEventType} from "../areas/template-editor/grid-editor/grid-editor.interfaces";
import {TokenAttributeType} from "../models/token-attribute-type";

@Injectable({ providedIn: 'root' })
export class PageStateService {
  private history: Page[] = [];
  private currentIndex = -1;
  private maxHistory = 50;

  private readonly _pageSubject = new BehaviorSubject<Page | null>(null);
  public readonly page$ = this._pageSubject.asObservable();

  private readonly _gridSubject = new BehaviorSubject<GridEvent | null>(null);
  public readonly grid$ = this._gridSubject.asObservable();

  private readonly _cellChangeSubject = new BehaviorSubject<Cell | null>(null);
  public readonly cellChange$ = this._cellChangeSubject.asObservable();

  private currentArea: string = null
  private currentRow: number = null
  private currentCol: number = null


  public updateCurrentCell(area: string, row: number, col: number){
    this.currentArea = area;
    this.currentRow = row;
    this.currentCol = col;

    const currentCell: Cell  =  this.getCurrentCell();
    this._cellChangeSubject.next(currentCell);
  }

  /** Emit current page (clone so subscribers can’t mutate history) */
  private emitCurrent(): void {
    const page = this.currentIndex >= 0 ? this.history[this.currentIndex] : null;
    this._pageSubject.next(page ? structuredClone(page) : null);
  }

  public emitGridEvent(gridEventType: GridEventType): void {
    const gridEvent: GridEvent = {
      type: gridEventType,
      area: this.currentArea,
      uuid: crypto.randomUUID()
    };
    this._gridSubject.next(gridEvent);
  }

  /** Avoid pushing identical consecutive snapshots */
  private isSameAsCurrent(next: Page): boolean {
    if (this.currentIndex < 0) return false;
    try {
      return JSON.stringify(this.history[this.currentIndex]) === JSON.stringify(next);
    } catch {
      return false;
    }
  }

  /** Push a new snapshot into history and emit */
  pushSnapshot(snapshot: Page): void {
    if (!snapshot) return;
    const clone = structuredClone(snapshot);

    // If no change, skip
    if (this.isSameAsCurrent(clone)) {
      return;
    }

    // Trim any forward history
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Enforce cap
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
      this.currentIndex = Math.max(-1, this.currentIndex - 1);
    }

    this.history.push(clone);
    this.currentIndex = this.history.length - 1;
    this.emitCurrent();
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  undo(): Page | null {
    if (!this.canUndo()) return null;
    this.currentIndex--;
    this.emitCurrent();
    return structuredClone(this.history[this.currentIndex]);
  }

  redo(): Page | null {
    if (!this.canRedo()) return null;
    this.currentIndex++;
    this.emitCurrent();
    return structuredClone(this.history[this.currentIndex]);
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this._pageSubject.next(null);
  }


  getDisplayLogicForRow(): DisplayLogicGroup{
    const current = this.getCurrentPage();
    if (!current) return null;

    return current[this.currentArea]?.rows[this.currentRow]?.displayLogic;
  }

  getRepeatableTokenForRow(): TokenAttribute{
    const current = this.getCurrentPage();
    if (!current) return null;

    return current[this.currentArea]?.rows[this.currentRow]?.repeatableToken;
  }

  getCurrentCell(): Cell{
    const current = this.getCurrentPage();
    if (!current) return null;

    let grid: Grid = current[this.currentArea];
    return grid?.rows[this.currentRow]?.cells[this.currentCol];
  }

  getTokenAttributes(): TokenAttribute[]{
    const current = this.getCurrentPage();
    if (!current) return null;

    let grid: Grid = current[this.currentArea];
    let isRepeatable: TokenAttribute = grid?.rows[this.currentRow].repeatableToken;
    if(isRepeatable){
      if(isRepeatable.type == TokenAttributeType.STRING_ARRAY){
        isRepeatable.type = TokenAttributeType.TEXT
        return [isRepeatable];
      }
      return isRepeatable.tokenAttributes;
    }
    return current.tokenAttrs;
  }

  getCurrentRow(): Row{
    const current = this.getCurrentPage();
    if (!current) return null;

    let grid: Grid = current[this.currentArea];
    return grid.rows[this.currentRow];
  }

  /** Safely replace a single cell and record it as a new snapshot */
  updateCell(cell: Cell): void {
    const current = this.getCurrentPage();
    if (!current) return;

    // Defensive bounds checks
    let grid: Grid = current[this.currentArea];

    if (!grid?.rows?.[this.currentRow]?.cells?.[this.currentCol]) return;

    if (cell?.type == 'html') {
      grid.rows[this.currentRow].cells[this.currentCol].type = 'html';
      grid.rows[this.currentRow].cells[this.currentCol].value = cell.value;
      grid.rows[this.currentRow].cells[this.currentCol].barcodeBlock = null;
      grid.rows[this.currentRow].cells[this.currentCol].chartBlock = null;
      grid.rows[this.currentRow].cells[this.currentCol].imageBlock = null;
    }

    if (cell?.type == 'image') {
      grid.rows[this.currentRow].cells[this.currentCol].type = 'image';
      grid.rows[this.currentRow].cells[this.currentCol].imageBlock = cell.imageBlock;
      grid.rows[this.currentRow].cells[this.currentCol].value = '';
      grid.rows[this.currentRow].cells[this.currentCol].barcodeBlock = null;
      grid.rows[this.currentRow].cells[this.currentCol].chartBlock = null;
    }

    if (cell?.type == 'barcode') {
      grid.rows[this.currentRow].cells[this.currentCol].type = 'barcode';
      grid.rows[this.currentRow].cells[this.currentCol].barcodeBlock = cell.barcodeBlock;
      grid.rows[this.currentRow].cells[this.currentCol].value = '';
      grid.rows[this.currentRow].cells[this.currentCol].imageBlock = null;
      grid.rows[this.currentRow].cells[this.currentCol].chartBlock = null;
    }

    if (cell?.type == 'chart') {
      grid.rows[this.currentRow].cells[this.currentCol].type = 'chart';
      grid.rows[this.currentRow].cells[this.currentCol].chartBlock = cell.chartBlock;
      grid.rows[this.currentRow].cells[this.currentCol].value = '';
      grid.rows[this.currentRow].cells[this.currentCol].imageBlock = null;
      grid.rows[this.currentRow].cells[this.currentCol].barcodeBlock = null;
    }

    this.pushSnapshot(current);
  }


  updateRow(row: Row): void {
    const current = this.getCurrentPage();
    if (!current) return;

    // Defensive bounds checks
    let grid: Grid = current[this.currentArea];

    if (!grid?.rows?.[this.currentRow]?.cells?.[this.currentCol]) return;

    debugger;
    grid.rows[this.currentRow].displayLogic = row.displayLogic;
    grid.rows[this.currentRow].repeatableToken = row.repeatableToken;

    this.pushSnapshot(current);
  }

  updateArea(area: string): void {
    this.currentArea = area;
    this.currentRow = 0;
    this.currentCol = 0;
  }


  updateCellAttributes(cellAttrs: CellAttrs): void {
    const current = this.getCurrentPage();
    if (!current) return;

    let grid: Grid = current[this.currentArea];

    if (!grid?.rows?.[this.currentRow]?.cells?.[this.currentCol]) return;

    grid.rows[this.currentRow].cells[this.currentCol].attrs = cellAttrs;

    this.pushSnapshot(current);
  }

  updateGrid(grid: Grid): void {
    console.log("Update Grid")
    const current = this.getCurrentPage();
    if (!current) return;

    current[this.currentArea] = grid;

    this.pushSnapshot(current);
  }


  /** Get a clone of the current page */
  getCurrentPage(): Page | null {
    if (this.currentIndex < 0) return null;
    return structuredClone(this.history[this.currentIndex]);
  }

}
