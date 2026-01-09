import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Divider } from 'antd';
import { SunFilled, FireOutlined, CloudOutlined, ExperimentOutlined, DashboardOutlined } from '@ant-design/icons';
import io from 'socket.io-client';

import TimeSeriesLineChart from './components/TimeSeriesLineChart';
import KpiCard from './components/KpiCard';

const { Title } = Typography;

/* ================= Types ================= */

interface DashboardItem {
  timestamp: number;

  temperature?: number;
  humidity?: number;
  lux?: number;
  soil_percent?: number;
  soil_Raw?: number;

  deviceName?: string;
}

/* ================= Socket ================= */

const socket = io('http://localhost:5000');

/* ================= Page ================= */

const SmartFarmDashboard: React.FC = () => {
  const [timeseriesData, setTimeseriesData] = useState<DashboardItem[]>([]);
  const [latestData, setLatestData] = useState<DashboardItem>({
    timestamp: Date.now(),
  });

  useEffect(() => {
    socket.on('mqtt_feed', payload => {
      if (payload.topic === '/smartfarm_Auto/v2/plot_data') {
        const normalized: DashboardItem = {
          ...payload.message,

          timestamp: Date.now(),
        };

        // setLatestData(normalized);
        setLatestData(prev => ({
          ...prev,
          ...normalized,
        }));

        setTimeseriesData(
          prev => [...prev, normalized].slice(-180),
        );
      }
    });

    return () => {
      socket.off('mqtt_feed');
    };
  }, []);

  return (
    <div
      style={{
        padding: 24,
        // background: '#f5f7fa',
        // minHeight: '100vh',
      }}
    >
      <Card
        style={{
          // background: '#f5f7fa',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Title level={3}>Smart Farm Dashboard</Title>
        <Divider></Divider>

        {/* ================= Charts Row ================= */}
        <Row gutter={12}>
          <Col span={12}>
            <Card title="Line chart" extra="Realtime - last 30 minutes">
              <TimeSeriesLineChart
                data={timeseriesData}
                timeKey="timestamp"
                seriesKeys={['temperature', 'humidity', 'soil_percent']}
                height={320}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Line chart" extra="History - last 30 minutes">
              <TimeSeriesLineChart data={timeseriesData} timeKey="timestamp" seriesKeys={['lux']} height={320} />
            </Card>
          </Col>
        </Row>

        {/* ================= KPI Row ================= */}
        <Row gutter={12} style={{ marginTop: 16 }} justify="space-between">
          <Col flex="1">
            <KpiCard label="Lux" value={latestData?.lux ?? '-'} icon={<SunFilled />} color="#faad14" />
          </Col>

          <Col flex="1">
            <KpiCard
              label="Temperature"
              value={latestData?.temperature ?? '-'}
              unit="°C"
              icon={<FireOutlined />}
              color="#ff4d4f"
            />
          </Col>

          <Col flex="1">
            <KpiCard
              label="Humidity"
              value={latestData?.humidity ?? '-'}
              unit="%"
              icon={<CloudOutlined />}
              color="#1677ff"
            />
          </Col>

          <Col flex="1">
            <KpiCard
              label="Soil %"
              value={latestData?.soil_percent ?? '-'}
              unit="%"
              icon={<ExperimentOutlined />}
              color="#52c41a"
            />
          </Col>

          <Col flex="1">
            <KpiCard
              label="Soil Raw"
              value={latestData?.soil_Raw ?? '-'}
              icon={<DashboardOutlined />}
              color="#722ed1"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SmartFarmDashboard;
