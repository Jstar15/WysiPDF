import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Cell, Grid, Page} from '../models/interfaces';
import {DisplayLogicGroup} from "../models/display-logic.models";

@Injectable({ providedIn: 'root' })
export class PageStateService {
  private history: Page[] = [];
  private currentIndex = -1;
  private maxHistory = 50;

  private readonly _pageSubject = new BehaviorSubject<Page | null>(null);
  public readonly page$ = this._pageSubject.asObservable();

  /** Emit current page (clone so subscribers can’t mutate history) */
  private emitCurrent(): void {
    const page = this.currentIndex >= 0 ? this.history[this.currentIndex] : null;
    this._pageSubject.next(page ? structuredClone(page) : null);
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

  /** Safely replace a single cell and record it as a new snapshot */
  updateCell(row: number, column: number, area: string, cell: Cell): void {
    const current = this.getCurrentPage();
    if (!current) return;
    debugger;

    // Defensive bounds checks
    const grid = current[area];
    if (!grid?.rows?.[row]?.cells?.[column]) return;

    grid.rows[row].cells[column].displayLogic = cell.displayLogic;
    grid.rows[row].displayLogic = cell.displayLogic;

    if (cell?.value) {
      grid.rows[row].cells[column].type = 'html';
      grid.rows[row].cells[column].value = cell.value;
    }

    if (cell?.imageBlock) {
      grid.rows[row].cells[column].type = 'image';
      grid.rows[row].cells[column].imageBlock = cell.imageBlock;
      grid.rows[row].cells[column].value = '';
    }

    if (cell?.barcodeBlock) {
      grid.rows[row].cells[column].type = 'barcode';
      grid.rows[row].cells[column].barcodeBlock = cell.barcodeBlock;
      grid.rows[row].cells[column].value = '';
    }

    if (cell?.chartBlock) {
      grid.rows[row].cells[column].type = 'chart';
      grid.rows[row].cells[column].chartBlock = cell.chartBlock;
      grid.rows[row].cells[column].value = '';
    }



    this.pushSnapshot(current);
  }


  updateGrid(area: string, grid: Grid): void {
    console.log("Update Grid")
    const current = this.getCurrentPage();
    if (!current) return;

    current[area] = grid;

    this.pushSnapshot(current);
  }

  /** Get a clone of the current page */
  getCurrentPage(): Page | null {
    if (this.currentIndex < 0) return null;
    return structuredClone(this.history[this.currentIndex]);
  }

}
