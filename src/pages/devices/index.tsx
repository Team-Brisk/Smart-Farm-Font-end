import React, { useState } from "react";
import { Button, Select, Card, Tag, Divider } from "antd";

const { Option } = Select;

interface Positions {
  [key: string]: string;
}
interface Object_Counts {
  [key: string]: number;  // แก้เป็น number ตรงกับ API จริง
}
interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  req_Id: string;
  positions: Positions;
  object_counts: Object_Counts;
}

const cameraOptions = [
  { label: "Camera 1", value: "http://192.168.0.86/ISAPI/Streaming/channels/101/picture" },
  { label: "Camera 2", value: "http://192.168.0.87/ISAPI/Streaming/channels/101/picture" },
  { label: "Camera 3", value: "http://192.168.0.88/ISAPI/Streaming/channels/101/picture" },
  { label: "Camera 4", value: "http://192.168.0.90/ISAPI/Streaming/channels/101/picture" },
];

const QrResult: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [cameraUrl, setCameraUrl] = useState<string>(cameraOptions[0].value);

  const callApi = async () => {
    try {
      const now = new Date();
      const reqId = `ID${now.getDate().toString().padStart(2, "0")}${
        (now.getMonth() + 1).toString().padStart(2, "0")
      }${now.getFullYear().toString().slice(-2)}${now.getHours().toString().padStart(2, "0")}${
        now.getMinutes().toString().padStart(2, "0")
      }${now.getSeconds().toString().padStart(2, "0")}`;

      const res = await fetch("https://localhost:7220/api/camera/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          camera_url: cameraUrl,
          username: "admin",
          password: "@mwte@mp@55",
          req_id: reqId,
        }),
      });

      const result: ApiResponse = await res.json();
      setData(result);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px 40px", width: "100%" }}>
      
      {/* Camera Selector */}
      <Card style={{ marginBottom: 20 }}>
        <h3>Select Camera</h3>
        <Select
          showSearch
          style={{ width: 400 }}
          placeholder="Select a camera"
          value={cameraUrl}
          onChange={(value) => setCameraUrl(value)}
          optionFilterProp="children"
        >
          {cameraOptions.map((cam) => (
            <Option key={cam.value} value={cam.value}>
              {cam.label}
            </Option>
          ))}
        </Select>

        <br /><br />

        <Button type="primary" onClick={callApi}>
          Detect QR Code
        </Button>
      </Card>
{data && (
  <Card title="QR Detection Result" bordered style={{ marginTop: 20 }}>

    {/* Layout 2 คอลัมน์ */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: "20px",
        width: "100%",
      }}
    >
      {/* LEFT COLUMN — Status */}
      <div>
        <Card size="small" bordered style={{ marginBottom: 20 }}>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Message:</strong> {data.message}</p>
          <p><strong>Req Id:</strong> {data.req_Id}</p>
        </Card>

        {/* Object Counts */}
        <Card size="small" bordered>
          <h3>Object Counts</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: 10 }}>
            {Object.entries(data.object_counts ?? {}).map(([key, value]) => (
              <Tag key={key} color="blue" style={{ fontSize: "14px", padding: "5px 10px" }}>
                {key}: <strong>{value}</strong>
              </Tag>
            ))}
          </div>
        </Card>
      </div>

      {/* RIGHT COLUMN — Positions */}
      <div>
        <Card size="small" bordered title="Positions">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            {Object.entries(data.positions ?? {}).map(([key, value]) => (
              <Card
                key={key}
                size="small"
                style={{
                  background: "#f5f5f5",
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <strong>{key}</strong>
                <br />
                {value}
              </Card>
            ))}
          </div>
        </Card>
      </div>

    </div>
  </Card>
)}

      {/* Result UI */}
     
    </div>
  );
};

export default QrResult;
