import React, { useEffect, useRef } from 'react';
import { DualAxes } from '@antv/g2plot';
import { Card, Empty } from 'antd';

export interface SoilDataItem {
  timestamp: string | Date;
  soil_ph?: number | null;
  soil_ec?: number | null;
}

interface Props {
  data: SoilDataItem[];
}

const PhEcDualChart: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<DualAxes | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // cleanup chart ก่อน
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const filtered = data
      .filter(d => d.soil_ph != null || d.soil_ec != null)
      .map(d => ({
        ...d,
        timestamp: new Date(d.timestamp),
      }));
    if (filtered.length === 0) return;

    chartRef.current = new DualAxes(containerRef.current, {
      data: [filtered, filtered],
      xField: 'timestamp',
      yField: ['soil_ph', 'soil_ec'],

      xAxis: {
        type: 'time',
        mask: 'MM-DD HH:mm',
      },

      yAxis: {
        soil_ph: {
          min: 4,
          max: 9,
          title: { text: 'pH' },
        },
        soil_ec: {
          min: 0,
          title: { text: 'EC (µS/cm)' },
        },
      },

      geometryOptions: [
        {
          geometry: 'line',
          color: '#3498db',
          smooth: true,
        },
        {
          geometry: 'line',
          color: '#9b59b6',
          smooth: true,
        },
      ],

      legend: {
        position: 'top',
        custom: true,
        items: [
          {
            name: 'pH',
            value: 'soil_ph',
            marker: { symbol: 'square', style: { fill: '#3498db' } },
          },
          {
            name: 'EC',
            value: 'soil_ec',
            marker: { symbol: 'square', style: { fill: '#9b59b6' } },
          },
        ],
      },

      // smooth: true,
      autoFit: true,
    });

    chartRef.current.render();

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card title="pH & EC Status">
        <Empty />
      </Card>
    );
  }

  return (
    <Card title="pH & EC Status">
      <div ref={containerRef} style={{ height: 460 }} />
    </Card>
  );
};

export default PhEcDualChart;
