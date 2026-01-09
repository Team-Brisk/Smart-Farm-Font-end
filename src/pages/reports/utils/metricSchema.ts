// metricSchema.ts
export const ALL_METRIC_KEYS = [
    // Environment
    'temperature',
    'humidity',
    'vpd',
    'co2',
  
    // Light
    'ppfd',
    'dli',
  
    // Soil
    'soil_temp',
    'soil_percent',
  
    // Nutrients
    'soil_n',
    'soil_p',
    'soil_k',
    'soil_ph',
    'soil_ec',
  
    // AI Growth — Plant A
    'height_A',
    'length_A',
    'area_A',
    'anomaly_A',
  
    // Plant B
    'height_B',
    'length_B',
    'area_B',
    'anomaly_B',
  
    // Plant C
    'height_C',
    'length_C',
    'area_C',
    'anomaly_C',
  
    // Plant D
    'height_D',
    'length_D',
    'area_D',
    'anomaly_D',
  
    // Plant E
    'height_E',
    'length_E',
    'area_E',
    'anomaly_E',
  
    // Plant F
    'height_F',
    'length_F',
    'area_F',
    'anomaly_F',
  ] as const;
  
  export type AllMetricKey = typeof ALL_METRIC_KEYS[number];
  
export const metricsOptions = [
  { label: 'Temperature', value: 'temperature', unit: '°C' },
  { label: 'Humidity', value: 'humidity', unit: '%' },
  { label: 'VPD', value: 'vpd', unit: 'kPa' },
  { label: 'PPFD', value: 'ppfd', unit: 'µmol' },
  { label: 'CO2', value: 'co2', unit: 'ppm' },
  { label: 'DLI', value: 'dli', unit: 'µmol/m²/s' },
  { label: 'Soil Temperature', value: 'soil_temp', unit: '°C' },
  { label: 'Soil Humidity', value: 'soil_percent', unit: '%' },
  { label: 'N', value: 'soil_n', unit: 'mg/kg' },
  { label: 'P', value: 'soil_p', unit: 'mg/kg' },
  { label: 'K', value: 'soil_k', unit: 'mg/kg' },
  { label: 'pH', value: 'soil_ph', unit: 'pH' },
  { label: 'EC', value: 'soil_ec', unit: 'mS/cm' },
  { label: 'Height (A)', value: 'height_A', unit: 'cm' },
  { label: 'Length (A)', value: 'length_A', unit: 'cm' },
  { label: 'Area (A)', value: 'area_A', unit: 'cm²' },
  { label: 'Anomaly (A)', value: 'anomaly_A', unit: '%' },
  { label: 'Height (B)', value: 'height_B', unit: 'cm' },
  { label: 'Length (B)', value: 'length_B', unit: 'cm' },
  { label: 'Area (B)', value: 'area_B', unit: 'cm²' },
  { label: 'Anomaly (B)', value: 'anomaly_B', unit: '%' },
  { label: 'Height (C)', value: 'height_C', unit: 'cm' },
  { label: 'Length (C)', value: 'length_C', unit: 'cm' },
  { label: 'Area (C)', value: 'area_C', unit: 'cm²' },
  { label: 'Anomaly (C)', value: 'anomaly_C', unit: '%' },
  { label: 'Height (D)', value: 'height_D', unit: 'cm' },
  { label: 'Length (D)', value: 'length_D', unit: 'cm' },
  { label: 'Area (D)', value: 'area_D', unit: 'cm²' },
  { label: 'Anomaly (D)', value: 'anomaly_D', unit: '%' },
  { label: 'Height (E)', value: 'height_E', unit: 'cm' },
  { label: 'Length (E)', value: 'length_E', unit: 'cm' },
  { label: 'Area (E)', value: 'area_E', unit: 'cm²' },
  { label: 'Anomaly (E)', value: 'anomaly_E', unit: '%' },
  { label: 'Height (F)', value: 'height_F', unit: 'cm' },
  { label: 'Length (F)', value: 'length_F', unit: 'cm' },
  { label: 'Area (F)', value: 'area_F', unit: 'cm²' },
  { label: 'Anomaly (F)', value: 'anomaly_F', unit: '%' },
] as const;

export type MetricOption = typeof metricsOptions[number];

export const metricsOptionsGroup = [
  { label: 'Environment', options: [
    { label: 'Temperature', value: 'temperature', unit: '°C' },
    { label: 'Humidity', value: 'humidity', unit: '%' },
    { label: 'VPD', value: 'vpd', unit: 'kPa' },
    { label: 'CO2', value: 'co2', unit: 'ppm' },
  ] },
  { label: 'Light', options: [
    { label: 'PPFD', value: 'ppfd', unit: 'µmol' },
    { label: 'DLI', value: 'dli', unit: 'µmol/m²/s' },
  ] },
  { label: 'Soil', options: [
    { label: 'Soil Temperature', value: 'soil_temp', unit: '°C' },
    { label: 'Soil Humidity', value: 'soil_percent', unit: '%' },
  ] },
  { label: 'Nutrients', options: [
    { label: 'N', value: 'soil_n', unit: 'mg/kg' },
    { label: 'P', value: 'soil_p', unit: 'mg/kg' },
    { label: 'K', value: 'soil_k', unit: 'mg/kg' },
    { label: 'pH', value: 'soil_ph', unit: 'pH' },
    { label: 'EC', value: 'soil_ec', unit: 'mS/cm' },
  ] },
  { label: 'AI Growth — Plant A', options: [
    { label: 'Height (A)', value: 'height_A', unit: 'cm' },
    { label: 'Length (A)', value: 'length_A', unit: 'cm' },
    { label: 'Area (A)', value: 'area_A', unit: 'cm²' },
    { label: 'Anomaly (A)', value: 'anomaly_A', unit: '%' },
  ] },
  { label: 'AI Growth — Plant B', options: [
    { label: 'Height (B)', value: 'height_B', unit: 'cm' },
    { label: 'Length (B)', value: 'length_B', unit: 'cm' },
    { label: 'Area (B)', value: 'area_B', unit: 'cm²' },
    { label: 'Anomaly (B)', value: 'anomaly_B', unit: '%' },
  ] },
  { label: 'AI Growth — Plant C', options: [
    { label: 'Height (C)', value: 'height_C', unit: 'cm' },
    { label: 'Length (C)', value: 'length_C', unit: 'cm' },
    { label: 'Area (C)', value: 'area_C', unit: 'cm²' },
    { label: 'Anomaly (C)', value: 'anomaly_C', unit: '%' },
  ] },
  { label: 'AI Growth — Plant D', options: [
    { label: 'Height (D)', value: 'height_D', unit: 'cm' },
    { label: 'Length (D)', value: 'length_D', unit: 'cm' },
    { label: 'Area (D)', value: 'area_D', unit: 'cm²' },
    { label: 'Anomaly (D)', value: 'anomaly_D', unit: '%' },
  ] },
  { label: 'AI Growth — Plant E', options: [
    { label: 'Height (E)', value: 'height_E', unit: 'cm' },
    { label: 'Length (E)', value: 'length_E', unit: 'cm' },
    { label: 'Area (E)', value: 'area_E', unit: 'cm²' },
    { label: 'Anomaly (E)', value: 'anomaly_E', unit: '%' },
  ] },
  { label: 'AI Growth — Plant F', options: [
    { label: 'Height (F)', value: 'height_F', unit: 'cm' },
    { label: 'Length (F)', value: 'length_F', unit: 'cm' },
    { label: 'Area (F)', value: 'area_F', unit: 'cm²' },
    { label: 'Anomaly (F)', value: 'anomaly_F', unit: '%' },
  ] },
] as const;

export type MetricsOptionsGroup = typeof metricsOptionsGroup[number];