import React, { useState } from 'react';
import { Card, Table, DatePicker, Select, Button, Typography, Space, Row, Col, Divider, TimePicker } from 'antd';
import type { DatePickerProps, TimePickerProps } from 'antd';
import { Line, Column, Pie, Bar } from '@ant-design/plots';
import type { Dayjs } from 'dayjs';
import { BasicRangePicker, SchooseTime, SwitchablePicker } from '../components/datePicker';
// import { createRoot } from 'react-dom/client';

type PickerType = 'time' | 'date';

interface PickerWithTypeProps {
  type: PickerType;
  onChange: TimePickerProps['onChange'] | DatePickerProps<Dayjs>['onChange'];
}

const PickerWithType: React.FC<PickerWithTypeProps> = ({ type, onChange }) => {
  if (type === 'time') {
    return <TimePicker onChange={onChange} />;
  }

  if (type === 'date') {
    return <DatePicker onChange={onChange} />;
  }

  return <DatePicker picker={type} onChange={onChange} />;
};

const { Title } = Typography;

export default function ReportPage() {
  const [type, setType] = useState<PickerType>('time');

  const DemoLine = () => {
    // const config = {
    //   data: [
    //     { year: "2018", value: 3 },
    //     { year: "2019", value: 4 },
    //     { year: "2020", value: 3.5 },
    //     { year: "2021", value: 5 },
    //     { year: "2022", value: 4.9 },
    //     { year: "2023", value: 6 },
    //   ],
    //   xField: "year",
    //   yField: "value",
    //   smooth: true,
    //   point: {
    //     size: 5,
    //     shape: "circle",
    //   },
    // };

    const config = {
      data: {
        type: 'fetch',
        value: 'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
      },
      xField: d => new Date(d.year),
      yField: 'value',
      sizeField: 'value',
      shapeField: 'trail',
      legend: { size: false },
      colorField: 'category',
    };

    return <Line {...config} />;
  };

  const data = [
    { type: '1-3秒', value: 0.16 },
    { type: '4-10秒', value: 0.125 },
    { type: '11-30秒', value: 0.24 },
    { type: '31-60秒', value: 0.19 },
    { type: '1-3分', value: 0.22 },
    { type: '3-10分', value: 0.05 },
    { type: '10-30分', value: 0.01 },
    { type: '30+分', value: 0.015 },
  ];

  const DemoColumn = () => {
    const config = {
      data,
      xField: 'type',
      yField: 'value',
      shapeField: 'column25D',
      style: {
        fill: 'rgba(126, 212, 236, 0.8)',
      },
    };
    return <Column {...config} />;
  };

  const DemoPie = () => {
    const config = {
      data: {
        type: 'fetch',
        value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/pie-doughnut.json',
      },
      angleField: 'value',
      colorField: 'name',
      legend: false,
      innerRadius: 0.6,
      labels: [
        { text: 'name', style: { fontSize: 10, fontWeight: 'bold' } },
        {
          text: (d, i, data) => (i < data.length - 3 ? d.value : ''),
          style: {
            fontSize: 9,
            dy: 12,
          },
        },
      ],
      style: {
        stroke: '#fff',
        inset: 1,
        radius: 10,
      },
      scale: {
        color: {
          palette: 'spectral',
          offset: t => t * 0.8 + 0.1,
        },
      },
    };
    return <Pie {...config} />;
  };

  const DemoBar = () => {
    const config = {
      data: {
        type: 'fetch',
        value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/bar-bar.json',
      },
      xField: 'letter',
      yField: 'frequency',
      sort: {
        reverse: true,
      },
      label: {
        text: 'frequency',
        formatter: '.1%',
        style: {
          textAlign: d => (+d.frequency > 0.008 ? 'right' : 'start'),
          fill: d => (+d.frequency > 0.008 ? '#fff' : '#000'),
          dx: d => (+d.frequency > 0.008 ? -5 : 5),
        },
      },
      axis: {
        y: {
          labelFormatter: '.0%',
        },
      },
    };
    return <Bar {...config} />;
  };

  // return (
  //   <>
  //     <Card className="shadow-sm rounded-2xl p-4">
  //       {/* <div className="flex items-center justify-between"> */}
  //         <Title level={3} style={{ margin: 0 }}>Report Overview</Title>
  //         <Space>
  //           <h1>Good luck AunPun 👊</h1>
  //         </Space>
  //       {/* </div> */}
  //     </Card>
  //     {/* <Row gutter={16}>
  //       <Col xs={24} md={12}>
  //         <Card className="shadow-sm rounded-2xl p-6">
  //           <DemoLine />
  //         </Card>
  //       </Col>

  //       <Col xs={24} md={12}>
  //         <Card className="shadow-sm rounded-2xl p-6">
  //           <DemoColumn />
  //         </Card>
  //       </Col>

  //     </Row> */}
  //   </>

  // );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <>
        {/* <Card className="shadow-sm rounded-2xl p-4"> */}
        <div className="flex items-center justify-between">
          <Title level={3} style={{ margin: 0 }}>
            Report Overview
          </Title>
        </div>
        {/* </Card> */}
        <Divider></Divider>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card className="shadow-sm rounded-2xl p-6">
              <Space>
                <BasicRangePicker />
                <SwitchablePicker />
                <Button
                  type="primary"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  Serach
                </Button>
              </Space>
              <Divider></Divider>
              <DemoLine />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card className="shadow-sm rounded-2xl p-6">
              <Space>
                <SchooseTime />
                <Button
                  type="primary"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  Serach
                </Button>
              </Space>
              <Divider />
              <DemoColumn />
            </Card>
          </Col>
        </Row>
      </>
    </div>
  );
}
