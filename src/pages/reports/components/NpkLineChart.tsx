import React, { useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';
import { Card, Empty } from 'antd';

/* ================= Types ================= */

export type SoilDataItem = {
  timestamp: Date;
  soil_n?: number | null;
  soil_p?: number | null;
  soil_k?: number | null;
};

interface Props {
  data: SoilDataItem[];
}

/* ================= Component ================= */

const NpkLineChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<Line | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // cleanup plot เดิม
    if (plotRef.current) {
      plotRef.current.destroy();
      plotRef.current = null;
    }

    /* ===== transform data ===== */
    const npkData: {
      time: Date;
      value: number;
      type: 'Nitrogen (N)' | 'Phosphorus (P)' | 'Potassium (K)';
    }[] = [];

    data.forEach(row => {
      if (row.soil_n != null) {
        npkData.push({
          time: new Date(row.timestamp),
          value: row.soil_n,
          type: 'Nitrogen (N)',
        });
      }
      if (row.soil_p != null) {
        npkData.push({
          time: new Date(row.timestamp),
          value: row.soil_p,
          type: 'Phosphorus (P)',
        });
      }
      if (row.soil_k != null) {
        npkData.push({
          time: new Date(row.timestamp),
          value: row.soil_k,
          type: 'Potassium (K)',
        });
      }
    });

    if (npkData.length === 0) return;

    /* ===== create plot ===== */
    plotRef.current = new Line(chartRef.current, {
      data: npkData,
      xField: 'time',
      yField: 'value',
      seriesField: 'type',

      xAxis: {
        type: 'time',
        mask: 'MM-DD HH:mm',
      },

      smooth: true,

      legend: {
        position: 'top',
      },

      color: (datum) => {
        switch (datum.type) {
          case 'Nitrogen (N)':
            return '#2ecc71'; // เขียว
          case 'Phosphorus (P)':
            return '#f1c40f'; // เหลือง
          case 'Potassium (K)':
            return '#e74c3c'; // แดง
          default:
            return '#999';
        }
      },
    });

    plotRef.current.render();

    return () => {
      plotRef.current?.destroy();
      plotRef.current = null;
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card title="NPK Levels (mg/kg)">
        <Empty />
      </Card>
    );
  }

  return (
    <Card title="NPK Levels (mg/kg)">
      <div ref={chartRef} style={{ height: 460 }} />
    </Card>
  );
};

export default NpkLineChart;
