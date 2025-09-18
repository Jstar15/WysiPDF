import { Injectable } from '@angular/core';
import * as echarts from 'echarts/core';
import { PieChart, PieSeriesOption, BarChart, BarSeriesOption } from 'echarts/charts';
import { TitleComponent, TitleComponentOption, TooltipComponent, TooltipComponentOption, LegendComponent, LegendComponentOption, GridComponent, GridComponentOption } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import {ChartBlock} from "../../models/page";

type ECOption = ComposeOption<PieSeriesOption | BarSeriesOption | TitleComponentOption | TooltipComponentOption | LegendComponentOption | GridComponentOption>;
type SupportedChartType = 'pie' | 'doughnut' | 'bar';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, PieChart, BarChart, CanvasRenderer]);

@Injectable({ providedIn: 'root' })
export class ChartGenerationService {
  constructor() {}

  /**
   * Generate a PNG (base64) from a ChartBlock object
   */
  public async generateChartBase64(chartBlock: ChartBlock): Promise<string> {
    // Labels & numeric values
    const labels: string[] = Array.isArray(chartBlock.slices)
      ? chartBlock.slices.map(s => s.label ?? '')
      : [];

    const values: number[] = Array.isArray(chartBlock.slices)
      ? chartBlock.slices.map(s => {
        const n = Number((s as any).value ?? (s as any).attributeName ?? 0);
        return Number.isFinite(n) ? n : 0;
      })
      : [];

    const data = labels.map((name, i) => ({ name, value: values[i] }));

    // Build option
    const option = this.buildOption(chartBlock.chartType, data, labels);

    // Create off-screen div
    const div = document.createElement('div');
    div.style.width = '800px';
    div.style.height = '600px';
    div.style.position = 'absolute';
    div.style.top = '-10000px';
    document.body.appendChild(div);

    const chart = echarts.init(div, undefined, { renderer: 'canvas' });
    chart.setOption(option as ECOption, { notMerge: true, lazyUpdate: true });

    // Wait for chart to finish rendering
    await new Promise<void>((resolve) => {
      chart.on('finished', () => resolve());
      // In case 'finished' never fires, fallback after a short timeout
      setTimeout(() => resolve(), 50);
    });

    // Export PNG
    const dataUrl = chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: 'transparent' });

    chart.dispose();
    div.remove();

    return dataUrl;
  }


  private buildOption(chartType: SupportedChartType, data: Array<{ name: string; value: number }>, labels: string[]): ECOption {
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
        series: [{ type: 'bar', data: data.map(d => d.value), label: { show: true, position: 'right' } }],
      };
    }

    const isDoughnut = chartType === 'doughnut';
    return {
      animation: false,
      color: palette,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { top: '3%', left: 'center' },
      series: [{
        type: 'pie',
        radius: isDoughnut ? ['40%', '70%'] : ['0%', '70%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: true,
        label: { show: true, position: 'outside', fontSize: 12, distanceToLabelLine: 4 },
        labelLine: { show: true, length: 8, length2: 6 },
        data,
      }],
    };
  }
}
