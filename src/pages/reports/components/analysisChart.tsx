import React, { useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';
import { Card, Empty } from 'antd';

// export type MetricKey =
//   | 'temperature'
//   | 'humidity'
//   | 'vpd'
//   | 'ppfd'
//   | 'dli'
//   | 'co2';
export type MetricKey = string;

export interface AnalysisDataItem {
  timestamp: string | Date;
  metricKey: MetricKey;
  value: number;
}

interface Props {
  data: AnalysisDataItem[];
}

let chart: Line | null = null;

const AnalysisChart: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!data || data.length === 0) return;

    // 🔥 destroy old chart
    if (chart) {
      chart.destroy();
      chart = null;
    }

    /* ================= Smart scale ================= */

    let min: number | null = null;
    let max: number | null = null;

    data.forEach(d => {
      if (typeof d.value === 'number') {
        min = min === null ? d.value : Math.min(min, d.value);
        max = max === null ? d.value : Math.max(max, d.value);
      }
    });

    let forcedMin = min;
    let forcedMax = max;

    const extend = (v: number) => {
      if (forcedMin === null || v < forcedMin) forcedMin = v;
      if (forcedMax === null || v > forcedMax) forcedMax = v;
    };

    const metric = data[0].metricKey;
    const annotations: any[] = [];

    /* ================= Targets (SPEC 2.2) ================= */

    if (metric === 'vpd') {
      annotations.push({
        type: 'region',
        start: ['min', 0.8],
        end: ['max', 1.2],
        style: { fill: '#52c41a', fillOpacity: 0.15 },
      });
      extend(0);
      extend(1.5);
    }

    if (metric === 'co2') {
      annotations.push({
        type: 'region',
        start: ['min', 800],
        end: ['max', 1200],
        style: { fill: '#52c41a', fillOpacity: 0.15 },
      });
      extend(700);
      extend(1300);
    }

    if (metric === 'ppfd') {
      annotations.push({
        type: 'line',
        start: ['min', 400],
        end: ['max', 400],
        style: { stroke: '#ff4d4f', lineDash: [4, 4] },
      });
      extend(0);
      extend(450);
    }

    if (metric === 'dli') {
      annotations.push({
        type: 'line',
        start: ['min', 17],
        end: ['max', 17],
        style: { stroke: '#ff4d4f', lineDash: [4, 4] },
      });
      extend(0);
      extend(20);
    }

    if (forcedMax !== null) forcedMax *= 1.05;
    if (forcedMin !== null && forcedMin > 0) forcedMin *= 0.95;

    /* ================= Render ================= */

    chart = new Line(containerRef.current, {
      data,
      xField: 'timestamp',
      yField: 'value',
      seriesField: 'metricKey',
      smooth: true,
      xAxis: {
        type: 'time',
        mask: 'MM-DD HH:mm',
      },
      yAxis: {
        min: forcedMin ?? undefined,
        max: forcedMax ?? undefined,
      },
      legend: { position: 'top' },
      annotations,
    });

    chart.render();

    return () => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    };
  }, [data]);
  if (!data.length) {
    return (
      <Card title="Analysis Chart">
        <Empty />
      </Card>
    );
  }

  // return <div ref={containerRef} style={{ width: '100%', height: 380 }} />;

  return (
    <Card title="Analysis Chart" style={{ height: 500 }}>
      <div ref={containerRef} style={{ height: 400 }} />
    </Card>
  );
};

export default AnalysisChart;
