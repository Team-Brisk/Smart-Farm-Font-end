import React, { useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';
import { Card, Empty } from 'antd';

export interface DashboardItem {
    
}
interface Props {
  data: DashboardItem[];
}

const ChartDashboard: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
};

export default ChartDashboard;
