// src/reports/utils/normalizeReport.ts
import dayjs from 'dayjs';

export type SensorRow = {
  timestamp: string;
  [key: string]: any;
};

export function normalizeReport(rows: any[]): SensorRow[] {
  return rows
    .filter(r => r.timestamp)
    .map(r => ({
      ...r,
      timestamp: dayjs(r.timestamp).toISOString(),
    }));
}
