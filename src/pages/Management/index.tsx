import { useEffect, useState } from "react";
import { Card, Avatar, Typography, Space, Table, Tag, Divider, Row, Col, Skeleton, Button, Form, message, Modal, Input } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./index.less";
import form from "antd/es/form";

const { Title, Text } = Typography;

const MyProfile = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingUser, setEditingUser] = useState<any>(null);
const [form] = Form.useForm();
  useEffect(() => {
    // ดึงข้อมูล User จาก LocalStorage
    const u = localStorage.getItem("user");
    if (u) setCurrentUser(JSON.parse(u));

    // ดึงรายชื่อผู้ใช้ทั้งหมด
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/users/usersData");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  
const handleEdit = (record: any) => {
  setEditingUser(record);
  form.setFieldsValue(record); // นำข้อมูลเดิมใส่ในฟอร์ม
  setIsModalOpen(true);
};
  // แสดง Skeleton ระหว่างรอข้อมูล currentUser
  if (!currentUser) return <div style={{ padding: '24px' }}><Skeleton active paragraph={{ rows: 10 }} /></div>;
const handleSave = async () => {
  try {
    const values = await form.validateFields();
    // สมมติว่า API ของคุณคือ PUT /api/auth/users/:id
    const res = await fetch(`http://localhost:5000/api/update/users/${editingUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
  message.success("แก้ไขข้อมูลสำเร็จ");
  setIsModalOpen(false);

  // 🔄 Reload หน้าเว็บ
  window.location.reload();
}
  } catch (err) {
    console.error("Save failed", err);
  }
};
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: 'center' as const,
      render: (role: string) => (
        <Tag color={role === "admin" ? "volcano" : "geekblue"}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: 'right' as const,
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString("th-TH", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      ),
    },
    {
    title: "Action",
    key: "action",
    align: 'center' as const,
    render: (_: any, record: any) => (
      <Button type="link" onClick={() => handleEdit(record)}>
        Edit
      </Button>
    ),
  },
  ];

  return (
    <div className="profile-container">
      <Row gutter={[24, 24]}>
        {/* ส่วนด้านซ้าย: ข้อมูลส่วนตัว */}
        <Col xs={24} md={8}>
          <Card className="profile-side-card" bordered={false}>
            <div className="profile-avatar-wrapper">
              <Avatar size={100} icon={<UserOutlined />} className="main-avatar" />
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                {currentUser.user}
              </Title>
              <Tag color="blue" style={{ borderRadius: 12 }}>{currentUser.role}</Tag>
            </div>

            <Divider />

            <div className="profile-info-list">
              <div className="info-item">
                <IdcardOutlined className="info-icon" />
                <div className="info-content">
                  <Text type="secondary" style={{ fontSize: '12px' }}>Username</Text>
                  <Text strong style={{ display: 'block' }}>{currentUser.username}</Text>
                </div>
              </div>
              {/* 
              <div className="info-item">
                <MailOutlined className="info-icon" />
                <div className="info-content">
                  <Text type="secondary" style={{ fontSize: '12px' }}>Email</Text>
                  <Text strong style={{ display: 'block' }}>{currentUser.email || "no-email@example.com"}</Text>
                </div>
              </div> */}
            </div> 
          </Card>
        </Col>

        {/* ส่วนด้านขวา: ตารางรายชื่อผู้ใช้ */}
        {/* ส่วนด้านขวา: ตารางรายชื่อผู้ใช้ (เฉพาะ admin) */}
        {currentUser.role === "admin" && (
          <Col xs={24} md={16}>
            <Card
              title={
                <Space>
                  <TeamOutlined />
                  <span>User Management</span>
                </Space>
              }
              bordered={false}
              className="profile-main-card"
            >
              <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 6 }}
                size="middle"
              />
            </Card>
          </Col>
        )}

      </Row>
      <Modal
        title="Edit User Information"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input disabled /> {/* ล็อกไว้ไม่ให้แก้ Role ถ้าไม่ใช่ Admin */}
          </Form.Item>
          {/* เพิ่มช่องอื่นๆ เช่น Email ได้ตามต้องการ */}
        </Form>
      </Modal>
    </div>
  );
   
  
};

export default MyProfile;