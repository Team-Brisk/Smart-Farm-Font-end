import React, { useMemo } from 'react';
import { Card } from 'antd';
import { Liquid } from '@ant-design/plots';
import type { LiquidConfig } from '@ant-design/plots';

type DliWaveChartProps = {
  dli: number;
  target?: number; // default = 17
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function DliWaveChart({ dli, target = 17 }: DliWaveChartProps) {
  const percent = useMemo(() => clamp(dli / target, 0, 1), [dli, target]);

  // Spec: 0-12 = Orange, 13-17 = Green
  const isOrange = dli <= 12;
  const fillColor = isOrange ? '#fa8c16' : '#52c41a'; // orange / green

  const config: LiquidConfig = {
    percent,
    height: 360,
    autoFit: true,

    // ✅ คุมหน้าตา Liquid ผ่าน style (สำคัญมาก)
    style: {
      shape: 'circle',
      fill: fillColor,          // สีคลื่น
      stroke: fillColor,        // สีขอบวง
      outlineBorder: 4,         // ความหนาขอบวง
      outlineDistance: 4,       // ระยะขอบ-คลื่น
      waveLength: 160,
      waveCount: 2,

      // ✅ ปิดข้อความ % default ของ Liquid
      contentText: '',
      contentFill: 'transparent',
      contentFontSize: '0px',
    },

    // กัน tooltip มากวน
    tooltip: false,
  };

  return (
    <Card title="DLI Progress">
      <div style={{ position: 'relative', height: 360 }}>
        <Liquid {...config} />

        {/* ✅ Overlay Text ให้เหมือน Spec */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center', transform: 'translateY(-6px)' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#262626' }}>DLI Accumulation</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#262626', lineHeight: 1.1 }}>
              {Number.isFinite(dli) ? dli.toFixed(2) : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* อันนี้คือ “คำอธิบาย” ใต้กราฟ ไม่ใช่เงื่อนไขอะไร */}
      {/* <div style={{ textAlign: 'center', marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
        <div>Target: {target} mol</div>
        <div>
          <span style={{ color: '#fa8c16', fontWeight: 600 }}>0–12</span> = Orange ·{' '}
          <span style={{ color: '#52c41a', fontWeight: 600 }}>13–{target}</span> = Green
        </div>
      </div> */}
    </Card>
  );
}
