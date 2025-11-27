import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Badge, Space, Typography } from 'antd';
import { 
  ThunderboltOutlined, 
  DashboardOutlined, 
  ExperimentOutlined,
  CloudOutlined,
  FireOutlined,
  ApiOutlined
} from '@ant-design/icons';
import io from 'socket.io-client';
import { COLORS } from "@/components/colors";

interface MqttPayload {
  topic: string;
  message: any;
}

const socket = io("http://localhost:5000");
const { Title, Text } = Typography;

// Simulated IoT data
const SmartFarmDashboard = () => {
  const [deviceData, setDeviceData] = useState<any>(null); 
  const [plotData, setPlotData] = useState<any>(null);     
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState(true);

  // Simulate real-time updates
 useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // รับข้อมูลแบบมี Type กำกับ
    socket.on("mqtt_feed", (data: MqttPayload) => {
      
      if (data.topic === "/smartfarm/v2/device_health") {
        setDeviceData(data.message);
      } 
      else if (data.topic === "/smartfarm/v2/plot_data") {
        setPlotData(data.message);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("mqtt_feed");
    };
  }, []);

  const getStatusColor = (value, thresholds) => {
    if (value < thresholds.good) return '#52c41a';
    if (value < thresholds.warning) return '#faad14';
    return '#ff4d4f';
  };

  const getCpuStatus = (cpu) => {
    if (cpu < 60) return { text: 'Optimal', color: '#52c41a' };
    if (cpu < 80) return { text: 'Moderate', color: '#faad14' };
    return { text: 'High', color: '#ff4d4f' };
  };

  const cpuStatus = getCpuStatus(deviceData?.cpu_percent  ? deviceData.cpu_percent
      : "รอข้อมูล"
  );

  return (
    <div style={{ 
      padding: '24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Space align="center" size="large">
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}>
            <ThunderboltOutlined style={{ fontSize: '32px', color: '#fff' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, color: '#fff' }}>
              Smart Farm Monitor
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
              Real-time IoT Dashboard
            </Text>
          </div>
        </Space>
        
        <Badge 
          status={isOnline ? "processing" : "error"} 
          text={
            <span style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>
              {isOnline ? 'Live' : 'Offline'}
            </span>
          } 
        />
      </div>

      <Row gutter={[24, 24]}>
        {/* Device Health Section */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DashboardOutlined style={{ fontSize: '24px', color: '#fff' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0 }}>Device Health</Title>
                  <Text type="secondary">System Performance</Text>
                </div>
              </div>

              <Row gutter={[16, 24]}>
                <Col span={12}>
                  <Card 
                    bordered={false}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                      borderRadius: '12px'
                    }}
                  >
                    <Statistic
                      title={<Text strong style={{ fontSize: '14px' }}>CPU Usage</Text>}
                      value={ deviceData?.cpu_percent
                        ?deviceData.cpu_percent.toFixed(1)
                        : "รอข้อมูล"}
                      suffix="%"
                      valueStyle={{ 
                        color: cpuStatus.color,
                        fontSize: '32px',
                        fontWeight: 700
                      }}
                    />
                    <Progress 
                      
                      strokeColor={{
                        '0%': cpuStatus.color,
                        '100%': cpuStatus.color
                      }}
                      showInfo={false}
                      style={{ marginTop: '12px' }}
                    />
                    <Badge 
                      color={cpuStatus.color} 
                      text={cpuStatus.text}
                      style={{ marginTop: '8px' }}
                    />
                  </Card>
                </Col>

                <Col span={12}>
                  <Card 
                    bordered={false}
                    style={{ 
                      background: 'linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%)',
                      borderRadius: '12px'
                    }}
                  >
                    <Statistic
                      title={<Text strong style={{ fontSize: '14px' }}>Temperature</Text>}
                     value={
                              deviceData?.cpu_temp
                                ? deviceData.cpu_temp.toFixed(1)
                                : "รอข้อมูล"
                            }
                      suffix="°C"
                      prefix={<FireOutlined />}
                      valueStyle={{ 
                        // color: getStatusColor(deviceData.cpu_temp, { good: 60, warning: 70 }),
                        fontSize: '32px',
                        fontWeight: 700
                      }}
                    />
                    <Progress 
                      // percent={ (deviceData.cpu_temp / 80) * 100} 
                      strokeColor={{
                        '0%': '#52c41a',
                        '50%': '#faad14',
                        '100%': '#ff4d4f'
                      }}
                      showInfo={false}
                      style={{ marginTop: '12px' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Card 
                bordered={false}
                style={{ 
                  background: '#f6f9fc',
                  borderRadius: '12px'
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text strong><ApiOutlined /> Status</Text>
                    <Badge status="success" text="Healthy" />
                  </Space>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text type="secondary">Uptime</Text>
                    <Text strong>99.8%</Text>
                  </Space>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text type="secondary">Last Update</Text>
                    <Text strong>{new Date().toLocaleTimeString()}</Text>
                  </Space>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>

        {/* Environmental Data Section */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ExperimentOutlined style={{ fontSize: '24px', color: '#fff' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0 }}>Environmental Data</Title>
                  <Text type="secondary">Sensor Readings</Text>
                </div>
              </div>

              <Card 
                bordered={false}
                style={{ 
                  background: 'linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%)',
                  borderRadius: '16px',
                  marginBottom: '16px'
                }}
              >
                <Row align="middle" gutter={16}>
                  <Col flex="auto">
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">Water Level</Text>
                      <Title level={2} style={{ margin: 0, color: COLORS.primary }}>
                        {
                          plotData?.water_level_percent_1
                          ?plotData.water_level_percent_1.toFixed(1)
                        : "รอข้อมูล"}%
                      </Title>
                      <Text type="secondary">Water Volume</Text>
                      <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                        {
                          plotData?.water_volume_ml_1
                          ?plotData.water_volume_ml_1.toFixed(1)
                        : "รอข้อมูล"} ML
                      </Title>
                    </Space>
                  </Col>
                  <Col>
                    <Progress
                      type="circle"
                      percent={plotData?.water_level_percent_1
                          ?plotData.water_level_percent_1.toFixed(1)
                        : "รอข้อมูล"}
                      strokeColor={{
                        '0%': '#4facfe',
                        '100%': '#00f2fe'
                      }}
                      width={100}
                      strokeWidth={8}
                    />
                  </Col>
                </Row>
              </Card>
{/* 
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card 
                    bordered={false}
                    style={{ 
                      background: 'linear-gradient(135deg, #fa709a15 0%, #fee14015 100%)',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <FireOutlined style={{ fontSize: '32px', color: '#ff6b6b', marginBottom: '12px' }} />
                    <Statistic
                      title="Temperature"
                      value={plotData.temperature.toFixed(1)}
                      suffix="°C"
                      valueStyle={{ 
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#ff6b6b'
                      }}
                    />
                  </Card>
                </Col>

                <Col span={12}>
                  <Card 
                    bordered={false}
                    style={{ 
                      background: 'linear-gradient(135deg, #a8edea15 0%, #fed6e315 100%)',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <CloudOutlined style={{ fontSize: '32px', color: '#48dbfb', marginBottom: '12px' }} />
                    <Statistic
                      title="Humidity"
                      value={plotData.humidity.toFixed(1)}
                      suffix="%"
                      valueStyle={{ 
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#48dbfb'
                      }}
                    />
                  </Card>
                </Col>
              </Row> */}

              <Card 
                bordered={false}
                style={{ 
                  background: '#f6f9fc',
                  borderRadius: '12px'
                }}
              >
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <Space direction="vertical" size={2}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Status</Text>
                      <Badge status="processing" text="Active" />
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size={2}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Sensors</Text>
                      <Text strong>4 Online</Text>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats Bar */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        {[
          { label: 'Avg CPU', value: '48%', color: '#667eea' },
          { label: 'Avg Temp', value: '26°C', color: '#ff6b6b' },
          { label: 'Water Usage', value: '1.2L', color: '#4facfe' },
          { label: 'Efficiency', value: '94%', color: '#52c41a' }
        ].map((stat, idx) => (
          <Col xs={12} sm={6} key={idx}>
            <Card
              bordered={false}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                textAlign: 'center',
                border: 'none'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title={<Text type="secondary">{stat.label}</Text>}
                value={stat.value}
                valueStyle={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SmartFarmDashboard;