import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ---- ECharts (modular) ----
import * as echarts from 'echarts/core';
import type { EChartsType, ComposeOption } from 'echarts/core';

import {
  PieChart,
  type PieSeriesOption,
  BarChart,
  type BarSeriesOption,
} from 'echarts/charts';

import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  LegendComponent,
  type LegendComponentOption,
  GridComponent,
  type GridComponentOption,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

import type { ChartBlock } from '../../models/page';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  BarChart,
  CanvasRenderer,
]);

type ECOption = ComposeOption<
  PieSeriesOption | BarSeriesOption |
  TitleComponentOption | TooltipComponentOption |
  LegendComponentOption | GridComponentOption
>;

type SupportedChartType = 'pie' | 'doughnut' | 'bar';

@Component({
  selector: 'app-chart-image-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `<div #host class="chart-host"></div>`,
  styles: [`
    :host { display:block; width:100%; }
    .chart-host { width:100%; height:320px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartImageRendererComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

  @Input() chartBlock!: ChartBlock;
  @Output() chartBlockChange = new EventEmitter<ChartBlock>();

  private chart?: EChartsType;
  private viewReady = false;
  private ro?: ResizeObserver;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.applyLayoutFromBlock();
    this.ensureChart();
    this.renderOrUpdate();

    this.ro = new ResizeObserver(() => {
      try { this.chart?.resize(); } catch {}
      this.exportToBlock();
    });
    this.ro.observe(this.hostRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewReady) return;
    if ('chartBlock' in changes) {
      this.applyLayoutFromBlock();
      this.renderOrUpdate();
    }
  }

  ngOnDestroy(): void {
    try { this.ro?.disconnect(); } catch {}
    this.ro = undefined;

    try { this.chart?.dispose(); } catch {}
    this.chart = undefined;
  }

  // ----- internals -----

  private applyLayoutFromBlock(): void {
    if (!this.chartBlock) return;
    const el = this.hostRef?.nativeElement?.parentElement as any | undefined;
    if (!el) return;

    // width is a percentage from the block (fallback 100)
    const widthPct = Number(this.chartBlock.width) || 100;
    el.style.width = `${Math.min(Math.max(widthPct, 1), 100)}%`;

    // alignment controls the container’s text alignment
    const align = this.chartBlock.alignment ?? 'left';
    (el as any).style.textAlign =
      align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';

    // ensure the canvas container itself stays auto-sized inside its wrapper
    const host = this.hostRef?.nativeElement;
    if (host) {
      host.style.display = 'inline-block';
      host.style.verticalAlign = 'top';
      host.style.width = '100%';
    }
  }

  private ensureChart(): void {
    if (!this.chart) {
      this.chart = echarts.init(this.hostRef.nativeElement, undefined, {
        renderer: 'canvas',
        useDirtyRect: true,
      });
      this.chart.on('finished', () => this.exportToBlock());
    }
  }

  private renderOrUpdate(): void {
    const block = this.chartBlock;
    if (!block) return;

    const chartType: SupportedChartType =
      (block as any).chartType ?? block.chartType ?? 'pie';

    // Labels from slices (preferred)
    const labels: string[] = Array.isArray(block.slices)
      ? block.slices.map(s => s.label ?? '')
      : [];

    // Numeric values:
    // 1) if block.values exists (legacy/back-compat), use it
    // 2) else parse from slice.attributeName if numeric
    // 3) else 0
    const legacyValues = (block as any).values as number[] | undefined;
    const values: number[] = Array.isArray(legacyValues) && legacyValues.length === labels.length
      ? legacyValues.map(v => Number(v) || 0)
      : (Array.isArray(block.slices)
          ? block.slices.map(s => {
              const n = Number((s as any).value ?? s.attributeName);
              return Number.isFinite(n) ? n : 0;
            })
          : []);

    const data = labels.map((name, i) => ({ name, value: values[i] ?? 0 }));

    const option = this.buildOption(chartType, data, labels);

    this.ensureChart();
    this.chart!.setOption(option as ECOption, { notMerge: true, lazyUpdate: true });

    // Export PNG shortly after paint
    setTimeout(() => this.exportToBlock(), 0);
  }

  private exportToBlock(): void {
    if (!this.chart || !this.chartBlock) return;
    try {
      const dataUrl = this.chart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: 'transparent',
      });
      if (dataUrl && dataUrl !== this.chartBlock.imageBase64) {
        const updated: ChartBlock = { ...this.chartBlock, imageBase64: dataUrl };
        this.chartBlock = updated;
        this.chartBlockChange.emit(updated);
      }
    } catch (e) {
      console.warn('[ChartImageRenderer] export error', e);
    }
  }

  private buildOption(
    chartType: SupportedChartType,
    data: Array<{ name: string; value: number }>,
    labels: string[],
  ): ECOption {
    const palette = [
      '#ef4444','#f97316','#f59e0b','#22c55e','#06b6d4','#3b82f6',
      '#8b5cf6','#a855f7','#ec4899','#14b8a6','#84cc16','#eab308'
    ];

    if (chartType === 'bar') {
      return {
        animation: false,
        color: palette,
        tooltip: { trigger: 'axis' },
        grid: { top: 48, bottom: 24, left: 80, right: 24 },
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: labels, axisLabel: { fontSize: 12 } },
        series: [
          {
            type: 'bar',
            data: data.map(d => d.value),
            label: { show: true, position: 'right' },
          },
        ],
      };
    }

    const isDoughnut = chartType === 'doughnut';
    return {
      animation: false,
      color: palette,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { top: '3%', left: 'center' },
      series: [
        {
          type: 'pie',
          radius: isDoughnut ? ['40%', '70%'] : ['0%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            position: 'outside',
            fontSize: 12,
            distanceToLabelLine: 4,
          },
          labelLine: { show: true, length: 8, length2: 6 },
          data,
        },
      ],
    };
  }
}
