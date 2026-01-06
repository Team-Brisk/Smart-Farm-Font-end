// utils/exportToCsv.ts
import { ALL_METRIC_KEYS } from './metricSchema';

export function exportToCsv<T extends Record<string, any>>(rows: T[], filename: string) {
  if (!rows.length) return;

  //ดึง Key จาก Row แรก
  const headers = ['timestamp', ...ALL_METRIC_KEYS];
  
  const csvRows = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(key => {
        const value = row[key];
        if (value == null) return '';
        if (value instanceof Date) return value.toISOString();
        return typeof value === 'number' ? value : `"${String(value)}"`;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
