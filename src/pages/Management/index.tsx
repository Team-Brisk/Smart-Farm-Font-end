import { useEffect, useState } from "react";
import { Card, Avatar, Typography, Space } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import "./index.less";

const { Title, Text } = Typography;

const MyProfile = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  if (!user) return null;

  return (
    <div className="profile-wrapper">
      <Card className="profile-card" bordered={false}>

        {/* HEADER */}
        <div className="profile-header">
          <Avatar size={90} icon={<UserOutlined />} className="profile-avatar" />

          <Title level={2} className="profile-name">
            {user.username}
          </Title>

          <span className="profile-role">{user.role}</span>
        </div>

        {/* CONTENT */}
        <div className="profile-section">
          <Title level={4} className="section-title">Account Information</Title>

          <Space direction="vertical" size="large" className="info-list">

            <div className="info-card">
              <div className="info-left purple">
                <IdcardOutlined />
              </div>
             <div>
            <Text strong style={{ display: "block", fontSize: 15 }}>
              Username:
            </Text>
            <Text style={{ fontSize: 15 }}>{user.username}</Text>
          </div>

            </div>

            <div className="info-card">
              <div className="info-left pink">
                <UserOutlined />
              </div>
              <div className="info-right">
                <Text strong style={{ display: "block", fontSize: 15 }}>
                  Role
                  </Text>
                <Text className="info-value">{user.role}</Text>
              </div>
            </div>

            {/* 
            ปลดคอมเมนต์ถ้ามี email 

            <div className="info-card">
              <div className="info-left blue">
                <MailOutlined />
              </div>
              <div className="info-right">
                <Text className="info-label">Email</Text>
                <Text className="info-value">{user.email}</Text>
              </div>
            </div>
            */}

          </Space>
        </div>

      </Card>
    </div>
  );
};

export default MyProfile;
