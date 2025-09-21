import * as echarts from 'echarts/core';
import { PieChart, PieSeriesOption, BarChart, BarSeriesOption } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import { ChartBlock } from '../../models/page';

type ECOption = ComposeOption<PieSeriesOption | BarSeriesOption | any>;
type SupportedChartType = 'pie' | 'doughnut' | 'bar';

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, PieChart, BarChart, CanvasRenderer]);

export class ChartGenerationService {
  private createCanvas: any;

  constructor() {
    if (typeof window === 'undefined') {
      // Node-only dynamic import
      import('canvas').then((canvasModule) => {
        this.createCanvas = canvasModule.createCanvas;
        echarts.setPlatformAPI({ createCanvas: this.createCanvas });
      });
    }
  }

  public async generateChartBase64(chartBlock: ChartBlock): Promise<string> {
    const labels = chartBlock.slices?.map(s => s.label ?? '') ?? [];
    const values = chartBlock.slices?.map(s => Number((s as any).value ?? 0)) ?? [];
    const data = labels.map((name, i) => ({ name, value: values[i] }));
    const option = this.buildOption(chartBlock.chartType, data, labels);

    if (typeof window === 'undefined') {
      if (!this.createCanvas) {
        // Ensure canvas is loaded
        const canvasModule = await import('canvas');
        this.createCanvas = canvasModule.createCanvas;
        echarts.setPlatformAPI({ createCanvas: this.createCanvas });
      }

      const canvas = this.createCanvas(800, 600);
      const chart = echarts.init(canvas as any, undefined, { renderer: 'canvas', width: 800, height: 600 });
      chart.setOption(option);
      const dataUrl = chart.getDataURL({ type: 'png', pixelRatio: 2 });
      chart.dispose();
      return dataUrl;
    } else {
      const div = document.createElement('div');
      div.style.cssText = 'width:800px;height:600px;position:absolute;top:-10000px';
      document.body.appendChild(div);
      const chart = echarts.init(div, undefined, { renderer: 'canvas' });
      chart.setOption(option);

      await new Promise<void>((resolve) => {
        chart.on('finished', () => resolve());
        setTimeout(() => resolve(), 50);
      });

      const dataUrl = chart.getDataURL({ type: 'png', pixelRatio: 2 });
      chart.dispose();
      div.remove();
      return dataUrl;
    }
  }

  private buildOption(chartType: SupportedChartType, data: Array<{ name: string; value: number }>, labels: string[]) {
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
