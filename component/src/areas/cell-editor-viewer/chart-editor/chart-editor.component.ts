import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

import { Cell, ChartBlock, ChartSlice } from '../../../models/page';
import { TokenAttribute } from '../../../models/token-attribute';
import { TokenAttributeType } from '../../../models/token-attribute-type';
import { ChartImageRendererComponent } from '../../../shared/chart/chart-image-renderer.component';
import {ChartGenerationService} from "../../../services/external/chart-generation.service";

type Align = 'left' | 'center' | 'right';
type ChartKind = 'pie' | 'doughnut' | 'bar';

@Component({
  selector: 'app-chart-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormField, MatInput, MatLabel,
    MatIcon, MatButtonToggleGroup, MatButtonToggle,
    MatSelect, MatOption,
    ChartImageRendererComponent
  ],
  templateUrl: './chart-editor.component.html',
  styleUrls: ['./chart-editor.component.scss']
})
export class ChartEditorComponent implements OnInit, OnChanges {
  @Input() public cell!: Cell;
  @Input() public tokenAttrs: TokenAttribute[] = [];
  @Output() public change = new EventEmitter<Cell>();

  kind: ChartKind = 'pie';
  widthPct = 100;
  align: Align = 'left';
  slices: ChartSlice[] = [];
  selectedNames: string[] = [];
  numericTokens: TokenAttribute[] = [];
  rendererBlock!: ChartBlock & { values?: number[]; updatedAt?: number };

  private hydrating = false;

  constructor(private chartGen: ChartGenerationService) {}

  ngOnInit(): void {
    this.hydrateFromInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cell'] || changes['tokenAttrs']) {
      this.hydrateFromInputs();
    }
  }

  onChartTypeChange(next: ChartKind | { value: ChartKind }): void {
    const v = this.coerceKind(next);
    if (v === this.kind) return;
    this.kind = v;
    this.invalidateAndPush();
  }

  onWidthChanged(v: number | string): void {
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    const clamped = this.clampWidth(n);
    if (clamped === this.widthPct) return;
    this.widthPct = clamped;
    this.invalidateAndPush();
  }

  onAlignmentChanged(next: Align | { value: Align }): void {
    const a = (typeof next === 'string' ? next : next?.value) as Align;
    if (!a || a === this.align) return;
    this.align = a;
    this.invalidateAndPush();
  }

  /** Called when the multi-select of numeric tokens changes */
  onAttributesChange(next: string[] | { value: string[] }): void {
    const names = this.coerceStringArray(next);
    this.selectedNames = names;
    this.slices = this.buildSlices(names, this.slices);
    this.invalidateAndPush();
  }

  /** When a user edits a label in the UI, call this after mutation */
  onSliceLabelChanged(): void {
    this.invalidateAndPush();
  }

  async onRendererBlockChange(updated: ChartBlock): Promise<void> {
    const prev = this.cell?.chartBlock?.imageBase64 ?? '';
    if (updated?.imageBase64 && updated.imageBase64 !== prev) {
      const merged: ChartBlock = {
        chartType: this.kind,
        width: this.widthPct,
        alignment: this.align,
        slices: [...this.slices],
        imageBase64: updated.imageBase64,
        tokenSourceHint: this.cell?.chartBlock?.tokenSourceHint
      };
      const nextCell: Cell = { ...this.cell, chartBlock: merged };
      this.cell = nextCell;
      nextCell.type = 'chart';
      this.change.emit(nextCell);
    }
  }

  private hydrateFromInputs(): void {
    this.hydrating = true;

    // 1) tokens
    this.numericTokens = (this.tokenAttrs ?? []).filter(
      t => t?.type === TokenAttributeType.NUMBER && !!t?.name
    );

    // 2) adopt persisted block (if any)
    const persisted = this.cell?.chartBlock;
    this.kind     = this.coerceKind(persisted?.chartType ?? this.kind);
    this.widthPct = this.clampWidth(persisted?.width ?? this.widthPct);
    this.align    = (persisted?.alignment as Align) ?? this.align;

    // Persisted slices, filtered by currently-available numeric tokens
    const validNames = new Set(this.numericTokens.map(t => t.name));
    const kept = (persisted?.slices ?? []).filter(s => validNames.has(s.attributeName));

    // Default selection (first 3 numeric tokens) if none exist
    if (kept.length === 0) {
      this.selectedNames = this.numericTokens.slice(0, 3).map(t => t.name);
      this.slices = this.buildSlices(this.selectedNames, []);
    } else {
      this.selectedNames = kept.map(s => s.attributeName);
      this.slices = this.buildSlices(this.selectedNames, kept);
    }

    this.pushRendererBlock(false);
    this.hydrating = false;
  }

  private async invalidateAndPush(): Promise<void> {
    this.pushRendererBlock(true);

    const nextPersisted: ChartBlock = {
      chartType: this.kind,
      width: this.widthPct,
      alignment: this.align,
      slices: [...this.slices],
      imageBase64: ''
    };
    const nextCell: Cell = { ...this.cell, chartBlock: nextPersisted };
    this.cell = nextCell;
    if (!this.hydrating) this.change.emit(nextCell);

    // Generate image via service
    const base64 = await this.chartGen.generateChartBase64(nextPersisted);
    this.rendererBlock.imageBase64 = base64;
    this.cell.chartBlock.imageBase64 = base64;
    if (!this.hydrating) this.change.emit({ ...this.cell });
  }

  private pushRendererBlock(invalidateImage: boolean): void {
    const values = this.selectedNames.map(n => this.parseNumeric(this.lookupTokenValue(n)));
    const imageBase64 = invalidateImage ? '' : (this.cell?.chartBlock?.imageBase64 ?? '');

    // Build a clean block for the renderer, with handy extras:
    this.rendererBlock = {
      chartType: this.kind,
      width: this.widthPct,
      alignment: this.align,
      slices: [...this.slices],
      imageBase64,
      values,
      updatedAt: Date.now()
    } as any;
  }

  private buildSlices(names: string[], preserveFrom: ChartSlice[]): ChartSlice[] {
    const preserve = new Map(preserveFrom.map(s => [s.attributeName, s]));
    return names.map(name => {
      const prev = preserve.get(name);
      return { attributeName: name, label: this.safeLabel(prev?.label ?? this.pretty(name)) } as ChartSlice;
    });
  }

  private lookupTokenValue(name: string): unknown {
    return this.numericTokens.find(t => t.name === name)?.value;
  }

  private parseNumeric(v: unknown): number {
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    const s = String(v ?? '').replace(/[^0-9.\-eE]/g, '');
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
    // If you want negatives clamped to zero for charts, use: return Math.max(0, n)
  }

  private clampWidth(n: number): number {
    // Keep between 1–100% to prevent overflow/stretching
    return Math.min(100, Math.max(1, Math.round(n)));
  }

  private coerceKind(v: any): ChartKind {
    const k = typeof v === 'string' ? v : v?.value;
    return k === 'pie' || k === 'doughnut' || k === 'bar' ? k : 'pie';
  }

  private coerceStringArray(v: any): string[] {
    if (Array.isArray(v)) return v as string[];
    if (Array.isArray(v?.value)) return v.value as string[];
    return [];
  }

  private pretty(name: string): string {
    return (name ?? '')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_\-.]+/g, ' ')
      .trim()
      .replace(/^./, c => c.toUpperCase());
  }

  private safeLabel(label?: string): string {
    const s = (label ?? '').trim();
    return s || 'Value';
  }
}
