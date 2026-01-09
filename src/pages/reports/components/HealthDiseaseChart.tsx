import React, { useMemo } from 'react';
import { Column } from '@ant-design/plots';
import { Card, Empty } from 'antd';

export type HealthSnapshot = {
  anomaly_A: number;
  anomaly_B: number;
  anomaly_C: number;
  anomaly_D: number;
  anomaly_E: number;
  anomaly_F: number;
};

interface HealthDiseaseChartProps {
  snapshot: HealthSnapshot | null;
}

const COLOR_NORMAL = '#52c41a'; // เขียว
const COLOR_ANOMALY = '#ff4d4f'; // แดง

const HealthDiseaseChart: React.FC<HealthDiseaseChartProps> = ({ snapshot }) => {
  const data = useMemo(() => {
    if (!snapshot) return [];

    const rows = [
      { plant: 'Plant A', count: snapshot.anomaly_A },
      { plant: 'Plant B', count: snapshot.anomaly_B },
      { plant: 'Plant C', count: snapshot.anomaly_C },
      { plant: 'Plant D', count: snapshot.anomaly_D },
      { plant: 'Plant E', count: snapshot.anomaly_E },
      { plant: 'Plant F', count: snapshot.anomaly_F },
    ];

    return rows.map(d => ({
      ...d,
      status: d.count > 0 ? 'Anomaly' : 'Normal',
    }));
  }, [snapshot]);

  if (!data.length) {
    return (
      <Card title="Health & Disease Detection">
        <Empty />
      </Card>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));
  const yMax = Math.max(5, maxCount); // ในภาพแกนประมาณถึง 5

  const config: any = {
    data,
    height: 460,
    autoFit: true,

    xField: 'plant',
    yField: 'count',

    // ✅ ให้สี/legend ทำงาน “นิ่ง” และไม่หลุด default
    colorField: 'status',
    scale: {
      color: {
        domain: ['Normal', 'Anomaly'],
        range: [COLOR_NORMAL, COLOR_ANOMALY],
      },
    },

    legend: {
      position: 'top',
    },

    // ✅ label โชว์เฉพาะแท่งที่มีค่า > 0 (เหมือนภาพตัวอย่าง)
    label: {
      text: (d: any) => (d.count > 0 ? String(d.count) : ''),
      position: 'middle',
      style: {
        fill: '#fff',
        fontWeight: 600,
      },
    },

    // ✅ tooltip ให้แสดง “spots” และชื่อซีรีส์ตาม status
    tooltip: {
      formatter: (d: any) => ({
        name: d.status,
        value: `${d.count} spots`,
      }),
    },

    yAxis: {
      min: 0,
      max: yMax,
      tickInterval: 1,
    },

    // (optional) ให้แท่งดูนุ่มขึ้นคล้ายตัวอย่าง
    // style: {
    //   radiusTopLeft: 6,
    //   radiusTopRight: 6,
    // },

    // (optional) hover ให้เหมือนมี highlight
    state: {
      active: { opacity: 0.9 },
      inactive: { opacity: 0.35 },
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <Card title="Health & Disease Detection">
      <div style={{ marginTop: -6, marginBottom: 8, color: '#8c8c8c', fontSize: 12 }}>
        Anomaly Count
      </div>

      <Column {...config} />
    </Card>
  );
};

export default HealthDiseaseChart;
