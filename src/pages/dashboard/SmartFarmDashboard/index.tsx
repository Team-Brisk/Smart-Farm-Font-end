import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

// ✅ ประกาศ Interface ได้แล้ว (เพราะเป็นไฟล์ .tsx)
interface MqttPayload {
  topic: string;
  message: any;
}

// ถ้าทราบโครงสร้างข้อมูลที่แน่นอน จะสร้าง Interface แยกให้ DeviceData ด้วยก็ได้
// แต่ถ้าไม่แน่ใจ ใช้ any ไปก่อนได้ครับ

const socket = io("http://localhost:5000");

const SmartFarmDashboard: React.FC = () => {
  const navigate = useNavigate();
  // รับค่า id จาก URL (กำหนด type ให้ useParams)
  const { id } = useParams<{ id: string }>(); 

  // ✅ กำหนด Type ให้ State (ใช้ any หรือ Interface ที่สร้างไว้)
  const [deviceData, setDeviceData] = useState<any>(null); 
  const [plotData, setPlotData] = useState<any>(null);     
  const [isConnected, setIsConnected] = useState<boolean>(false);

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

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* ส่วนหัว */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        {/* <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')} 
            style={{ marginRight: 15 }}
        >
            Back
        </Button> */}
        <h1 style={{ margin: 0 }}>Dashboard </h1>
       
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        
        {/* กล่องที่ 1: Device Health */}
        <div style={{ border: "1px solid green", padding: "20px", borderRadius: "8px", width: "50%", background: '#f6ffed' }}>
            <h2 style={{ color: "green", marginTop: 0 }}>Device Health</h2>
            {deviceData ? (
                <div>
                    <h1>CPU: {deviceData.cpu_percent}%</h1>
                    <h3>Temp: {deviceData.cpu_temp}°C</h3>
                </div>
            ) : <p>...รอข้อมูล...</p>}
        </div>

        {/* กล่องที่ 2: Plot Data */}
        <div style={{ border: "1px solid blue", padding: "20px", borderRadius: "8px", width: "50%", background: '#e6f7ff' }}>
            <h2 style={{ color: "blue", marginTop: 0 }}>Plot Data</h2>
            {plotData ? (
               <div>
                    <h1>Level: {plotData.water_level_percent_1}%</h1>
                    <h3>Volume: {plotData.water_volume_ml_1} ml</h3>
                </div>
            ) : <p>...รอข้อมูล...</p>}
        </div>

      </div>
    </div>
  );
}

export default SmartFarmDashboard;