import React from 'react';
import { Table, Tooltip, Space, Checkbox, Typography, Tag } from 'antd';
import { 
  PlusOutlined, ReloadOutlined, SearchOutlined, 
  DownloadOutlined, ShareAltOutlined, RollbackOutlined, 
  UserOutlined, EditOutlined, DeleteOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const mockData = [
  { key: 'SmartFarmDashboard', time: '2025-11-25 11:13:49', title: 'Smartfarm 1', public: false, customers: 0 },
  { key: 'SmartFarmDashboard', time: '2025-09-30 16:44:36', title: 'Smartfarm 2', public: false, customers: 2 },
  { key: 'SmartFarmDashboard', time: '2025-09-08 09:50:18', title: 'Smartfarm.3', public: false, customers: 1 },
  { key: 'SmartFarmDashboard', time: '2025-08-26 13:12:18', title: 'Smartfarm 4', public: true, customers: 5 },
  { key: 'SmartFarmDashboard', time: '2025-08-13 14:31:32', title: 'Smartfarm 5', public: false, customers: 0 },
  { key: 'SmartFarmDashboard', time: '2025-07-08 16:12:58', title: 'Smartfarm 6', public: false, customers: 10 },
];

const DashboardList = () => {
  const navigate = useNavigate();

  const handleDashboardClick = (record) => {
    navigate(`/dashboard/${record.key}`, { state: { title: record.title } });
  };

  const columns = [
    {
      title: 'Created time ↓',
      dataIndex: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
      width: 220,
      render: (text) => <span style={{ color: '#888' }}>{text}</span> // สีเทาสำหรับวันที่
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text, record) => (
        <Space>
           {/* ไอคอนหน้าชื่อ เพื่อความสวยงาม */}
          <div style={{ backgroundColor: '#e6f7ff', padding: '5px', borderRadius: '4px' }}>
            <FileTextOutlined style={{ color: '#1890ff' }} />
          </div>
          <a onClick={() => handleDashboardClick(record)} style={{ color: '#1890ff', fontWeight: 600, fontSize: '15px' }}>
            {text}
          </a>
        </Space>
      ),
    },
    {
      title: 'Assigned to customers',
      dataIndex: 'customers',
      align: 'center',
      width: 200,
      render: (count) => (
         // ใช้ Tag สี เพื่อบอกจำนวนลูกค้า
         count > 0 
         ? <Tag color="purple">{count} Users</Tag> 
         : <span style={{ color: '#ccc' }}>-</span>
      ),
    },
    {
      title: 'Public',
      dataIndex: 'public',
      width: 100,
      align: 'center',
      render: (isPublic) => (
        // เปลี่ยน Checkbox เป็น Tag สถานะสวยๆ
        isPublic 
        ? <Tag color="success">Public</Tag> 
        : <Tag color="default">Private</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 250,
      render: () => (
        <Space size="middle">
          <Tooltip title="Export"><DownloadOutlined className="icon-btn icon-green" /></Tooltip>
          <Tooltip title="Share"><ShareAltOutlined className="icon-btn icon-blue" /></Tooltip>
          <Tooltip title="Edit"><EditOutlined className="icon-btn icon-orange" /></Tooltip>
          <Tooltip title="Delete"><DeleteOutlined className="icon-btn icon-red" /></Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
    },
  };

  return (
    <div style={{ padding: '30px', background: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Container หลัก ใส่เงา (Box Shadow) ให้ดูลอยเด่น */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        
        {/* Header Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#333' }}>Dashboards</Title>
          <Space size="middle">
             {/* ปุ่มเครื่องมือด้านขวา */}
             <Tooltip title="Create New">
                <div className="toolbar-btn"><PlusOutlined /></div>
             </Tooltip>
             <Tooltip title="Refresh">
                <div className="toolbar-btn"><ReloadOutlined /></div>
             </Tooltip>
             <Tooltip title="Search">
                <div className="toolbar-btn"><SearchOutlined /></div>
             </Tooltip>
          </Space>
        </div>

        {/* Table Area */}
        <Table
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={columns}
          dataSource={mockData}
          pagination={{ 
            pageSize: 5, 
            showSizeChanger: true, 
            showTotal: (total) => `Total ${total} items` 
          }}
          // เพิ่ม Class ให้ CSS ข้างล่างทำงาน
          className="custom-table"
        />
      </div>

   
    </div>
  );
};

export default DashboardList;