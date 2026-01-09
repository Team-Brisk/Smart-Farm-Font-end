import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Typography,
  Select,
  Statistic,
  Divider,
  Space,
  Modal,
  Checkbox,
  Input,
  Spin,
  Alert,
  message,
} from 'antd';
import { ExportOutlined, SlackCircleFilled, DeleteFilled } from '@ant-design/icons';
import AnalysisChart, { AnalysisDataItem } from './components/analysisChart';
import DliWaveChart from './components/DliWaveChart';
import PlantGrowthComparison from './components/PlantGrowthComparison';
import HealthDiseaseChart from './components/HealthDiseaseChart';
import PhEcDualChart from './components/PhEcDualChart';
import NpkLineChart from './components/NpkLineChart';
import { exportToCsv } from '../reports/utils/exportToCsv';
import { normalizeReport } from '../reports/utils/normalizeReport';
import dayjs, { Dayjs } from 'dayjs';

import { metricsOptions, metricsOptionsGroup } from './utils/metricSchema';

const { Title } = Typography;

/* ================= Types ================= */
export type KpiConfig = {
  id: string;
  label: string;
  field: string;
  unit: string;
  color?: string;
  enabled: boolean;
};

/* ================= Initial KPI ================= */
const defaultKpiConfig: KpiConfig[] = [
  { id: 'temp', label: 'AVG TEMP', field: 'temperature', unit: '°C', color: '#13c2c2', enabled: true },
  { id: 'humidity', label: 'AVG HUMIDITY', field: 'humidity', unit: '%', color: '#13c2c2', enabled: true },
  { id: 'vpd', label: 'AVG VPD', field: 'vpd', unit: 'kPa', color: '#13c2c2', enabled: true },
  { id: 'ppfd', label: 'AVG PPFD', field: 'ppfd', unit: 'µmol', color: '#13c2c2', enabled: true },
  { id: 'co2', label: 'AVG CO2', field: 'co2', unit: 'ppm', color: '#13c2c2', enabled: true },
  // { id: 'co2', label: 'AVG CO2', field: 'co2', unit: 'ppm', color: '#13c2c2', enabled: true },
];

/* ================= Metric Options ================= */
// const metricOptions = [
//   { label: 'Temperature', value: 'temperature', unit: '°C' },
//   { label: 'Humidity', value: 'humidity', unit: '%' },
//   { label: 'VPD', value: 'vpd', unit: 'kPa' },
//   { label: 'PPFD', value: 'ppfd', unit: 'µmol' },
//   { label: 'CO2', value: 'co2', unit: 'ppm' },
// ];

const metricOptions = metricsOptions;
const MetricsOptionsGroup = metricsOptionsGroup;

/* ================= KPI Raw Data ================= */
// const rawData = [
//   { temperature: 26, humidity: 68, vpd: 1.2, ppfd: 180, co2: 450 },
//   { temperature: 25.8, humidity: 67, vpd: 1.1, ppfd: 185, co2: 460 },
// ];

/* ================= Utils ================= */
// const calculateAverage = (data: any[], field: string) => {
//   const values = data.map(d => d[field]).filter(v => typeof v === 'number');
//   if (!values.length) return 0;
//   return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
// };

/* ================= Sensor Types ================= */

type SensorRow = {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  vpd?: number;
  ppfd?: number;
  dli?: number;
  co2?: number;
  soil_temp?: number;
  soil_percent?: number;
  soil_n?: number;
  soil_p?: number;
  soil_k?: number;
  soil_ph?: number;
  soil_ec?: number;
  height_A?: number;
  length_A?: number;
  area_A?: number;
  anomaly_A?: number;
  height_B?: number;
  length_B?: number;
  area_B?: number;
  anomaly_B?: number;
  height_C?: number;
  length_C?: number;
  area_C?: number;
  anomaly_C?: number;
  height_D?: number;
  length_D?: number;
  area_D?: number;
  anomaly_D?: number;
  height_E?: number;
  length_E?: number;
  area_E?: number;
  anomaly_E?: number;
  height_F?: number;
  length_F?: number;
  area_F?: number;
  anomaly_F?: number;
};

type MetricKey = Exclude<keyof SensorRow, 'timestamp'>;

/* ================= Metric Meta ================= */

// const METRIC_META: Record<MetricKey, { label: string }> = {
//   temperature: { label: 'Temperature' },
//   humidity: { label: 'Humidity' },
//   vpd: { label: 'Vpd' },
//   ppfd: { label: 'Ppfd' },
//   dli: { label: 'Dli' },
//   co2: { label: 'CO2' },
//   soil_temp: { label: 'Soil Temperature' },
//   soil_percent: { label: 'Soil Humidity' },
//   soil_n: { label: 'N' },
//   soil_p: { label: 'P' },
//   soil_k: { label: 'K' },
//   soil_ph: { label: 'pH' },
//   soil_ec: { label: 'EC' },
// };

/* ================= Page ================= */

export default function ReportPage() {
  const [kpiConfig, setKpiConfig] = useState<KpiConfig[]>(defaultKpiConfig);
  const [open, setOpen] = useState(false);
  // const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['temperature', 'humidity']);
  const [startAt, setStartAt] = useState<Dayjs | null>(null);
  const [endAt, setEndAt] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [sensorRows, setSensorRows] = useState<SensorRow[]>([]);
  // Soil & Nutrients
  const [npkRows, setNpkRows] = useState<SensorRow[]>([]);
  const [phEcRows, setPhEcRows] = useState<SensorRow[]>([]);

  // Light
  const [dliRows, setDliRows] = useState<SensorRow[]>([]);

  // AI Growth
  // const [plantGrowthRows, setPlantGrowthRows] = useState<SensorRow[]>([]);
  // Health / Disease
  const [healthRows, setHealthRows] = useState<SensorRow[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<{
    startAt: Dayjs;
    endAt: Dayjs;
    metrics: MetricKey[];
  } | null>(null);

  /* ================= GenerateChart, Export CSV ================= */
  // const handleGenerateChart = () => {
  //   if (!startAt || !endAt) {
  //     message.warning('Please. Select DateTime!');
  //     return;
  //   };

  //   setLoading(true);

  //   setTimeout(() => {
  //     setAppliedFilter({
  //       startAt,
  //       endAt,
  //       metrics: selectedMetrics,
  //     });

  //     setLoading(false);
  //   }, 800);
  // };

  // const handleGenerateChart = async () => {
  //   if (!startAt || !endAt) {
  //     message.warning('Please select start & end datetime');
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await fetch(
  //       `http://localhost:5000/api/report?start=${startAt.toISOString()}&end=${endAt.toISOString()}`,
  //     );

  //     const json = await res.json();

  //     const normalizedRows = normalizeReport(json.data);

  //     setSensorRows(normalizedRows);

  //     setAppliedFilter({
  //       startAt,
  //       endAt,
  //       metrics: selectedMetrics,
  //     });
  //   } catch (err) {
  //     message.error('Failed to load report data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGenerateChart = async () => {
    if (!startAt || !endAt) {
      message.warning('Please select start & end datetime');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/report?start=${startAt.toISOString()}&end=${endAt.toISOString()}`,
      );

      const json = await res.json();

      const normalizedRows = normalizeReport(json.data);

      setSensorRows(normalizedRows);

      setAppliedFilter({
        startAt,
        endAt,
        metrics: selectedMetrics,
      });

      // แตกข้อมูล
      setNpkRows(normalizedRows.filter(r => r.soil_n != null || r.soil_p != null || r.soil_k != null));
      setPhEcRows(normalizedRows.filter(r => r.soil_ph != null || r.soil_ec != null));
      setDliRows(normalizedRows.filter(r => r.ppfd != null || r.dli != null));

      // setPlantGrowthRows(
      //   normalizedRows.filter(r => Object.keys(r).some(k => k.startsWith('height_') || k.startsWith('area_'))),
      // );

      // setHealthRows(normalizedRows.filter(r => Object.keys(r).some(k => k.startsWith('anomaly_'))));
    } catch (err) {
      message.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  /* ================= KPI Actions ================= */
  const updateKpi = (id: string, patch: Partial<KpiConfig>) => {
    setKpiConfig(prev => prev.map(kpi => (kpi.id === id ? { ...kpi, ...patch } : kpi)));
  };

  const removeKpi = (id: string) => {
    setKpiConfig(prev => prev.filter(kpi => kpi.id !== id));
  };

  const addKpi = () => {
    const newMetric = metricOptions[0];
    setKpiConfig(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        label: `AVG ${newMetric.label.toUpperCase()}`,
        field: newMetric.value,
        unit: newMetric.unit,
        color: '#13c2c2',
        enabled: true,
      },
    ]);
  };

  /* ================= Sensor Time Series ================= */
  const filteredRows = useMemo(() => {
    if (!appliedFilter) return [];

    const { startAt, endAt } = appliedFilter;
    const s = startAt.valueOf();
    const e = endAt.valueOf();

    return sensorRows.filter(r => {
      const t = dayjs(r.timestamp).valueOf();
      return t >= s && t <= e;
    });
  }, [appliedFilter, sensorRows]);
  console.log('filteredRows[0]', filteredRows[0]);
  console.log('DLI DEBUG last row:', filteredRows[filteredRows.length - 1]);

  const avgFromRows = (rows: SensorRow[], field: keyof SensorRow) => {
    const values = rows.map(r => r[field]).filter(v => typeof v === 'number') as number[];
    if (!values.length) return 0;
    return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
  };

  /* ================= Analysis Chart Data ================= */
  const analysisData = useMemo<AnalysisDataItem[]>(() => {
    if (!appliedFilter) return [];

    return filteredRows.flatMap(
      row =>
        appliedFilter.metrics
          .map(metric => {
            const value = row[metric];
            if (typeof value !== 'number') return null;

            return {
              timestamp: new Date(row.timestamp),
              metricKey: metric,
              value,
            };
          })
          .filter(Boolean) as AnalysisDataItem[],
    );
  }, [filteredRows, appliedFilter]);

  /* ================= DLI Progress ================= */
  const latestDli = useMemo(() => {
    if (!filteredRows.length) return 0;

    // สมมติ ppfd ทุก 5 นาที
    const intervalHours = 5 / 60;

    const dli = filteredRows.reduce((sum, r) => {
      if (typeof r.ppfd !== 'number') return sum;
      return sum + (r.ppfd * intervalHours * 3600) / 1_000_000;
    }, 0);

    return Number(dli.toFixed(2));
  }, [filteredRows]);

  // const latestDli = 10.57;

  /* ================= Plant Growth Comparison ================= */
  const plantGrowthSnapshot = useMemo(() => {
    if (!filteredRows.length) return [];

    const last = filteredRows[filteredRows.length - 1];

    const plants: Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'> = ['A', 'B', 'C', 'D', 'E', 'F'];

    return plants
      .map(p => ({
        plant: p,
        height_mm: last[`height_${p}` as keyof SensorRow] as number,
        length_mm: last[`length_${p}` as keyof SensorRow] as number,
        area_mm2: last[`area_${p}` as keyof SensorRow] as number,
      }))
      .filter(d => [d.height_mm, d.length_mm, d.area_mm2].some(v => typeof v === 'number'));
  }, [filteredRows]);

  /* ================= Health & Disease Detection ================= */
  const healthSnapshot = useMemo(() => {
    if (!filteredRows.length) return null;

    const last = filteredRows[filteredRows.length - 1];

    const snapshot = {
      anomaly_A: last.anomaly_A,
      anomaly_B: last.anomaly_B,
      anomaly_C: last.anomaly_C,
      anomaly_D: last.anomaly_D,
      anomaly_E: last.anomaly_E,
      anomaly_F: last.anomaly_F,
    };

    const hasAny = Object.values(snapshot).some(v => typeof v === 'number');

    return hasAny ? snapshot : null;
  }, [filteredRows]);

  return (
    <div style={{ padding: 24 }}>
      <Card>
        {/* ================= Header ================= */}
        <Title level={3}>Report Overview</Title>

        {/* ================= Date & Action ================= */}
        <Row gutter={16} align="middle">
          <Col>
            <DatePicker showTime placeholder="Start Date/Time" onChange={v => setStartAt(v)} />
          </Col>
          <Col>
            <DatePicker showTime placeholder="End Date/Time" onChange={v => setEndAt(v)} />
          </Col>
          <Col>
            <Button type="primary" onClick={handleGenerateChart}>
              <span>
                <SlackCircleFilled />
              </span>
              Generate Chart
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              style={{ background: '#52c41a', border: 'none' }}
              onClick={() => {
                if (!filteredRows.length) {
                  message.error('Error Export CSV!');
                  return;
                }
                // exportToCsv(filteredRows, `report_${dayjs().format('YYYYMMDD_HHmm')}.csv`);
                exportToCsv(filteredRows, `smart_farm_report.csv`);
              }}
            >
              <span>
                <ExportOutlined />
              </span>
              Export CSV
            </Button>
          </Col>
        </Row>

        <Divider />

        <div style={{ position: 'relative' }}>
          <Spin spinning={loading} tip="Loading data..." size="large">
            {/* ================= KPI Header ================= */}
            <Row justify="space-between" align="middle">
              <Title level={4}>KPI Summary</Title>
              <Button onClick={() => setOpen(true)}>Manage KPI</Button>
            </Row>

            {/* ================= KPI Cards ================= */}
            <div
              style={{
                overflowX: 'auto',
                paddingBottom: 12,
              }}
            >
              <Row gutter={16} wrap={false}>
                {kpiConfig
                  .filter(k => k.enabled)
                  .map(kpi => (
                    <Col span={4} key={kpi.id}>
                      {/* WRAPPER: ไม่ transform */}
                      <div
                        style={{
                          paddingTop: 4, // กันพื้นที่ให้ยกขึ้น
                        }}
                      >
                        {/* TRANSFORM HERE */}
                        <Card
                          bordered={false}
                          style={{
                            position: 'relative',
                            border: '1px solid #e6e8ec',
                            borderRadius: 8,
                            boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.transform = 'translateY(-2px)';
                            el.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.transform = 'translateY(0)';
                            el.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.1)';
                          }}
                        >
                          {/* TOP BAR */}
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: 4,
                              backgroundColor: kpi.color,
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                            }}
                          />

                          <div style={{ paddingTop: 16 }}>
                            <Statistic
                              title={kpi.label}
                              value={avgFromRows(filteredRows, kpi.field as keyof SensorRow)}
                              suffix={kpi.unit}
                            />
                          </div>
                        </Card>
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>

            {/* ================= Manage KPI Modal ================= */}
            <Modal title="Manage KPI Summary" open={open} onCancel={() => setOpen(false)} footer={null}>
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                {kpiConfig.map(kpi => (
                  <div
                    key={kpi.id}
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      background: '#fafafa',
                    }}
                  >
                    <Row align="middle" gutter={12}>
                      {/* Enable */}
                      <Col flex="32px">
                        <Checkbox
                          checked={kpi.enabled}
                          onChange={e => updateKpi(kpi.id, { enabled: e.target.checked })}
                        />
                      </Col>

                      {/* Label */}
                      <Col flex="auto">
                        <Input value={kpi.label} onChange={e => updateKpi(kpi.id, { label: e.target.value })} />
                      </Col>

                      {/* Metric */}
                      <Col flex="160px">
                        <Select
                          style={{ width: '100%' }}
                          value={kpi.field}
                          options={metricOptions}
                          onChange={val => {
                            const meta = metricOptions.find(m => m.value === val);
                            updateKpi(kpi.id, { field: val, unit: meta?.unit });
                          }}
                        />
                      </Col>

                      {/* Delete */}
                      <Col flex="40px">
                        <Button danger type="text" title='Delete' icon={<DeleteFilled />} onClick={() => removeKpi(kpi.id)} />
                      </Col>
                    </Row>
                  </div>
                ))}

                {/* Add KPI */}
                <Button type="dashed" onClick={addKpi} block style={{ marginTop: 8 }}>
                  + Add KPI
                </Button>
              </Space>
            </Modal>

            <Divider />

            {/* <Divider /> */}

            <div style={{ maxWidth: 400, marginBottom: 4 }}>
              <Title level={4}>Select Metrics to Plot:</Title>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                value={selectedMetrics}
                onChange={setSelectedMetrics}
                placeholder="Select metrics"
                optionFilterProp="label"
                options={metricsOptionsGroup}
                // options={[
                //   {
                //     label: 'Environment',
                //     options: [
                //       { label: 'Temperature', value: 'temperature' },
                //       { label: 'Humidity', value: 'humidity' },
                //       { label: 'VPD', value: 'vpd' },
                //       { label: 'CO2', value: 'co2' },
                //     ],
                //   },
                //   {
                //     label: 'Light',
                //     options: [
                //       { label: 'PPFD', value: 'ppfd' },
                //       { label: 'DLI', value: 'dli' },
                //     ],
                //   },
                //   {
                //     label: 'Soil',
                //     options: [
                //       { label: 'Soil Temperature', value: 'soil_temp' },
                //       { label: 'Soil Humidity', value: 'soil_percent' },
                //     ],
                //   },
                //   {
                //     label: 'Nutrients',
                //     options: [
                //       { label: 'N', value: 'soil_n' },
                //       { label: 'P', value: 'soil_p' },
                //       { label: 'K', value: 'soil_k' },
                //       { label: 'pH', value: 'soil_ph' },
                //       { label: 'EC', value: 'soil_ec' },
                //     ],
                //   },
                //   {
                //     label: 'AI Growth — Plant A',
                //     options: [
                //       { label: 'Height (A)', value: 'height_A' },
                //       { label: 'Length (A)', value: 'length_A' },
                //       { label: 'Area (A)', value: 'area_A' },
                //       { label: 'Anomaly (A)', value: 'anomaly_A' },
                //     ],
                //   },
                //   {
                //     label: 'AI Growth — Plant B',
                //     options: [
                //       { label: 'Height (B)', value: 'height_B' },
                //       { label: 'Length (B)', value: 'length_B' },
                //       { label: 'Area (B)', value: 'area_B' },
                //       { label: 'Anomaly (B)', value: 'anomaly_B' },
                //     ],
                //   },
                //   {
                //     label: 'AI Growth — Plant C',
                //     options: [
                //       { label: 'Height (C)', value: 'height_C' },
                //       { label: 'Length (C)', value: 'length_C' },
                //       { label: 'Area (C)', value: 'area_C' },
                //       { label: 'Anomaly (C)', value: 'anomaly_C' },
                //     ],
                //   },
                //   {
                //     label: 'AI Growth — Plant D',
                //     options: [
                //       { label: 'Height (D)', value: 'height_D' },
                //       { label: 'Length (D)', value: 'length_D' },
                //       { label: 'Area (D)', value: 'area_D' },
                //       { label: 'Anomaly (D)', value: 'anomaly_D' },
                //     ],
                //   },
                //   {
                //     label: 'AI Growth — Plant E',
                //     options: [
                //       { label: 'Height (E)', value: 'height_E' },
                //       { label: 'Length (E)', value: 'length_E' },
                //       { label: 'Area (E)', value: 'area_E' },
                //       { label: 'Anomaly (E)', value: 'anomaly_E' },
                //     ],
                //   },
                //   {
                //     label: 'AI Growth — Plant F',
                //     options: [
                //       { label: 'Height (F)', value: 'height_F' },
                //       { label: 'Length (F)', value: 'length_F' },
                //       { label: 'Area (F)', value: 'area_F' },
                //       { label: 'Anomaly (F)', value: 'anomaly_F' },
                //     ],
                //   },
                // ]}
              />
            </div>

            {/* ================= Analysis + DLI ================= */}
            <Row gutter={16}>
              <Col span={16}>
                <AnalysisChart data={analysisData} />
              </Col>
              <Col span={8}>
                <DliWaveChart dli={filteredRows.length ? latestDli : 0} />
              </Col>
            </Row>

            <Divider />

            {/* ================= Growth & Health ================= */}
            <Row gutter={16}>
              <Col span={12}>
                <PlantGrowthComparison data={plantGrowthSnapshot} />
              </Col>
              <Col span={12}>
                <HealthDiseaseChart snapshot={healthSnapshot} />
              </Col>
            </Row>

            <Divider />

            {/* ================= Soil & Nutrients ================= */}
            <Card title="Soil & Nutrients">
              <Row gutter={16}>
                <Col span={12}>
                  <NpkLineChart data={npkRows} />
                </Col>
                <Col span={12}>
                  <PhEcDualChart data={phEcRows} />
                </Col>
              </Row>
            </Card>
          </Spin>
        </div>
      </Card>
    </div>
  );
}
