import { Card, Typography, Space } from 'antd';
import { Label } from 'recharts';
import { ReactNode } from 'react';

const { Text } = Typography;

interface Props {
  label: string;
  value: number | string;
  unit?: string;
  icon?: ReactNode; 
  color?: string;
}

const KpiCard: React.FC<Props> = ({ label, value, unit, icon, color }) => {
  return (
    // hoverable style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}
    <Card size="small" hoverable style={{ textAlign: 'center', borderRadius: 10, boxShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
      {/* ===== label + icon ===== */}
      <Space align="center" size={8} style={{ marginBottom: 6 }}>
        {icon ? (
          <span
            style={{
              fontSize: 18,
              color,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        ) : null}

        <Text type="secondary" style={{ fontSize: 16, fontWeight: 500 }}>{label}</Text>
      </Space>
      <div style={{ fontSize: 24, fontWeight: 700 }}>
        {value}
        {unit && <span style={{ fontSize: 14 }}> {unit}</span>}
      </div>
    </Card>
  );
};

export default KpiCard;