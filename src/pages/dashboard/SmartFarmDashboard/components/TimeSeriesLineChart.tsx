import React, { useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';
import { Empty } from 'antd';

/* ================= Types ================= */

export interface TimeSeriesRecord {
  [key: string]: any;
}

interface Props {
  data: TimeSeriesRecord[];
  timeKey: string;
  seriesKeys: string[];
  height?: number;
}

/* ================= Utils ================= */

const normalizeTime = (ts: any): Date | null => {
  if (typeof ts === 'number') {
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }
  if (ts instanceof Date) {
    return isNaN(ts.getTime()) ? null : ts;
  }
  return null;
};

type ChartRow = {
  time: Date;
  value: number;
  metric: string;
};

/* ================= Component ================= */

const TimeSeriesLineChart: React.FC<Props> = ({
  data,
  timeKey,
  seriesKeys,
  height = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Line | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chartData: ChartRow[] = data.flatMap(d => {
      const time = normalizeTime(d[timeKey]);
      if (!time) return [];

      return seriesKeys
        .map(key => {
          const value = Number(d[key]);
          if (Number.isNaN(value)) return null;

          return { time, value, metric: key };
        })
        .filter((v): v is ChartRow => v !== null);
    });

    console.log('[TimeSeriesLineChart] chartData:', chartData);

    if (chartData.length === 0) return;

    if (chartRef.current) {
      chartRef.current.changeData(chartData);
      return;
    }

    chartRef.current = new Line(containerRef.current, {
      data: chartData,
      xField: 'time',
      yField: 'value',
      seriesField: 'metric',
      smooth: true,
      height,
      animation: false,
      xAxis: {
        type: 'time',
        tickCount: 6,
      },
      legend: { position: 'top-left' },
      slider: { start: 0, end: 1 },
    });

    chartRef.current.render();

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, timeKey, seriesKeys, height]);

  if (!data.length) return <Empty />;

  return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default TimeSeriesLineChart;
