import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';

import { TokenAttribute } from '../../models/TokenAttribute';
import { TokenAttributeTypeEnum } from '../../models/TokenAttributeTypeEnum';
import { ChartBlock, ChartSlice } from '../../models/interfaces';
import { ChartImageRendererComponent } from '../../shared/chart/chart-image-renderer.component';

interface DialogData {
  tokens: TokenAttribute[];
  existing?: ChartBlock;
}

type ChartKind = 'pie' | 'doughnut' | 'bar';

@Component({
  selector: 'app-add-pie-chart-dialog',
  standalone: true,
  templateUrl: './add-pie-chart-dialog.component.html',
  styleUrls: ['./add-pie-chart-dialog.component.scss'],
  imports: [
    CommonModule, FormsModule,
    MatDialogTitle, MatDialogContent, MatDialogActions,
    MatFormField, MatLabel, MatInput,
    MatSelect, MatOption,
    MatButton, MatButtonToggle, MatButtonToggleGroup, MatIcon,
    NgFor, NgIf,
    ChartImageRendererComponent
  ]
})
export class AddPieChartDialogComponent implements OnInit {
  // Form state
  title = '';
  width = 100;  // %
  alignment: 'left' | 'center' | 'right' = 'left';
  chartKind: ChartKind = 'pie'; // NEW: selected chart type

  // Tokens
  numericTokens: TokenAttribute[] = [];
  selectedAttributeNames: string[] = [];
  slices: ChartSlice[] = [];

  // Preview (for UI only)
  previewLabels: string[] = [];
  previewData: number[] = [];
  saveEnabled = false;

  // The single input/output for the renderer
  chartBlock!: ChartBlock;

  constructor(
    public dialogRef: MatDialogRef<AddPieChartDialogComponent, ChartBlock>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.numericTokens = (this.data.tokens || []).filter(
      t => t.type === TokenAttributeTypeEnum.NUMBER
    );

    if (this.data.existing) {
      // Clone existing to avoid mutating input reference
      this.chartBlock = { ...this.data.existing, slices: [...(this.data.existing.slices || [])] };
      this.title = this.chartBlock.title ?? '';
      this.width = this.chartBlock.width ?? 100;
      this.alignment = this.chartBlock.alignment ?? 'left';
      this.chartKind = (this.data.existing as any).chartType; //what si this
                  

      this.slices = [...this.chartBlock.slices];
      this.selectedAttributeNames = this.slices.map(s => s.attributeName);
    } else {
      this.slices = [];
      this.selectedAttributeNames = this.numericTokens.slice(0, 3).map(t => t.name);
      this.syncSlicesFromSelection();

      // Create a fresh block
      this.chartKind = 'pie';
      this.chartBlock = {
        // IMPORTANT: write to your interface key
        chartType: this.chartKind,
        imageBase64: '',
        width: this.width,
        alignment: this.alignment,
        title: this.title,
        slices: [...this.slices]
      } as ChartBlock;
    }

    this.rebuildPreview(); // also updates chartBlock
  }

  // --- UI handlers ---
  onChartTypeChange(kind: ChartKind): void {
    this.chartKind = kind;
    this.rebuildPreview();
  }

  onAttributesChange(names: string[]): void {
    this.selectedAttributeNames = names;
    this.syncSlicesFromSelection();
    this.rebuildPreview();
  }

  onLabelChange(): void {
    this.rebuildPreview();
  }

  onTitleChange(): void {
    this.rebuildPreview();
  }

  // Keep slices aligned with selected attributes; preserve labels when possible
  private syncSlicesFromSelection(): void {
    const existingByName = new Map(this.slices.map(s => [s.attributeName, s]));
    this.slices = this.selectedAttributeNames.map(name => {
      const existing = existingByName.get(name);
      return {
        attributeName: name,
        label: existing?.label ?? this.prettyLabelFromName(name)
      };
    });
  }

  /** Recompute preview arrays and keep chartBlock in sync.
   *  Also attaches ad-hoc `labels` and `data` arrays on the block
   *  so the chart component can read them.
   */
  rebuildPreview(): void {
    const values: number[] = [];
    const labels: string[] = [];

    for (const slice of this.slices) {
      const t = this.numericTokens.find(x => x.name === slice.attributeName);
      if (!t) continue;

      const v = Number(t.value);
      if (isFinite(v)) {
        values.push(v);
        labels.push(slice.label || this.prettyLabelFromName(slice.attributeName));
      }
    }

    this.previewData = [...values];
    this.previewLabels = [...labels];

    // Sync block
    this.chartBlock = {
      ...this.chartBlock,
      title: this.title,
      width: this.width,
      alignment: this.alignment,
      slices: [...this.slices],
      // keep selected type on the model
      chartType: this.chartKind
    } as ChartBlock;

    // Attach ad-hoc arrays for renderer (not part of model)
    (this.chartBlock as any).labels = this.previewLabels;
    (this.chartBlock as any).data = this.previewData;

    // Toggle save button (defer to avoid ExpressionChanged)
    queueMicrotask(() => {
      this.saveEnabled = this.previewData.length > 0;
    });
  }

  // ---- Dialog buttons ----
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.saveEnabled) return;
    // The renderer will already have refreshed imageBase64 via [(chartBlock)].
    this.dialogRef.close(this.chartBlock);
  }

  private prettyLabelFromName(name: string): string {
    const spaced = name
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_\-.]+/g, ' ')
      .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }
}
