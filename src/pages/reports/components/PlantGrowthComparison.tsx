import React, { useMemo } from 'react';
import { Column } from '@ant-design/plots';
import { Card, Empty } from 'antd';

export type PlantSnapshot = {
  plant: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  height_mm: number;
  length_mm: number;
  area_mm2: number;
};

interface PlantGrowthComparisonProps {
  data: PlantSnapshot[];
}

/**
 * Plant Growth Comparison Chart
 * - Grouped bar plot comparing Height, Length, Area
 * - Convert Area from mm² → cm²
 */
const PlantGrowthComparison: React.FC<PlantGrowthComparisonProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.flatMap((d) => [
      { plant: `Plant ${d.plant}`, metric: 'Height (mm)', value: d.height_mm },
      { plant: `Plant ${d.plant}`, metric: 'Length (mm)', value: d.length_mm },
      { plant: `Plant ${d.plant}`, metric: 'Area (cm²)', value: Number((d.area_mm2 / 100).toFixed(2)) },
    ]);
  }, [data]);

  if (chartData.length === 0)
    return (
      <Card title="Plant Growth Comparison">
        <Empty />
      </Card>
    );

  const config = {
    data: chartData,
    xField: 'plant',
    yField: 'value',
    colorField: 'metric',
    group: true,

    // ✅ ใช้ scale.color.range (syntax G2Plot v5)
    scale: {
      color: {
        range: ['#5B8FF9', '#5AD8A6', '#5D7092'], // ฟ้า, เขียว, เทา
      },
    },

    // ✅ กำหนด radius ให้โค้งบน
    style: {
      radiusTopLeft: 6,
      radiusTopRight: 6,
      inset: 1, // ระยะห่างระหว่างแท่ง
    },

    legend: {
      position: 'top',
      itemMarker: 'square',
    },

    axis: {
      x: { title: null },
      y: { title: null },
    },

    tooltip: {
      shared: true,
    },
  };

  return (
    <Card
      title="Plant Growth Comparison"
      extra={<span style={{ color: '#8c8c8c', fontSize: 12 }}>Note: Area หน่วยเป็น cm²</span>}
    >
      <Column {...config} />
    </Card>
  );
};

export default PlantGrowthComparison;
