import React from 'react';
import { Card, Table, DatePicker, Select, Button, Typography, Space } from 'antd';
const { Title } = Typography;
export default function ReportPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="shadow-sm rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <Title level={3} style={{ margin: 0 }}>Report Overview</Title>
          <Space>
            <h1>Good luck AunPun 👊</h1>
          </Space>
        </div>
      </Card>
    </div>
  );
}
