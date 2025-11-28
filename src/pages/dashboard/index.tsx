import React, { useState } from 'react';
import { Table, Tooltip, Space, Checkbox, Typography, Tag, Button, Dropdown, Modal, Input, Upload, message, Spin } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  RollbackOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ContactsOutlined,
  UndoOutlined,
  UploadOutlined,
  FileAddOutlined,
  CloseOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface DashboardRow {
  key: string;
  time: string;
  title: string;
  public: boolean;
  customers: number;
}

const { Title } = Typography;

const mockData = [
   { key: 'SmartFarmDashboard', time: '2025-11-25 11:13:49', title: 'Smartfarm 1', public: false, customers: 0 },
  { key: '2', time: '2025-09-30 16:44:36', title: 'Smartfarm 2', public: false, customers: 2 },
  { key: '3', time: '2025-09-08 09:50:18', title: 'Smartfarm.3', public: false, customers: 1 },
  { key: '4', time: '2025-08-26 13:12:18', title: 'Smartfarm 4', public: true, customers: 5 },
  { key: '5', time: '2025-08-13 14:31:32', title: 'Smartfarm 5', public: false, customers: 0 },
  { key: '6', time: '2025-07-08 16:12:58', title: 'Smartfarm 6', public: false, customers: 10 },
];

const DashboardList = () => {
  const navigate = useNavigate();

  //State
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  // const { loading } = useSelector(state => state.global);

  // Ant
  const { Dragger } = Upload

  // Function
  const rowSelection = {
    selectedRowKeys,
    onChange: (newKeys: React.Key[]) => {
      setSelectedRowKeys(newKeys);
    },
  };
  const handleDashboardClick = record => {
    navigate(`/dashboard/${record.key}`, { state: { title: record.title } });
  };

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const columns = [
    {
      title: 'Created time ↓',
      dataIndex: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
      width: 220,
      render: text => <span style={{ color: '#888' }}>{text}</span>, // สีเทาสำหรับวันที่
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
          <a
            onClick={() => handleDashboardClick(record)}
            style={{ color: '#1890ff', fontWeight: 600, fontSize: '15px' }}
          >
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
      render: count =>
        // ใช้ Tag สี เพื่อบอกจำนวนลูกค้า
        count > 0 ? <Tag color="purple">{count} Users</Tag> : <span style={{ color: '#ccc' }}>-</span>,
    },
    {
      title: 'Public',
      dataIndex: 'public',
      width: 100,
      align: 'center',
      render: isPublic =>
        // เปลี่ยน Checkbox เป็น Tag สถานะสวยๆ
        isPublic ? <Tag color="success">Public</Tag> : <Tag color="default">Private</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 250,
      render: () => (
        <Space size="middle">
          <Tooltip title="Export">
            <DownloadOutlined className="icon-btn icon-green" style={{ fontSize: 18 }} />
          </Tooltip>
          <Tooltip title="Share">
            <ShareAltOutlined className="icon-btn icon-blue" style={{ fontSize: 18 }} />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlined className="icon-btn icon-orange" style={{ fontSize: 18 }} />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined className="icon-btn icon-red" style={{ fontSize: 18 }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`);
  //   },
  // };

  return (
    <div style={{ padding: '30px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header แบบ Full Width */}
      {selectedRowKeys.length === 0 ? (
        <div
          style={{
            background: '#fff',
            padding: '20px 24px',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={3} style={{ margin: 0, color: '#333' }}>
            Dashboards
          </Title>

          <Space size="small">
            {/* ปุ่ม + พร้อม Dropdown */}
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              menu={{
                onClick: ({ key }) => {
                  if (key === 'create') {
                    setAddModalOpen(true);
                  } else if (key === 'import') {
                    setImportModalOpen(true);
                  }
                },
                items: [
                  {
                    key: 'create',
                    label: (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 4 }}>
                        <FileAddOutlined /> Create new dashboard
                      </span>
                    ),
                  },
                  {
                    key: 'import',
                    label: (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <UploadOutlined /> Import dashboard
                      </span>
                    ),
                  },
                ],
              }}
            >
              <Button type="text" className="toolbar-btn" style={{ padding: 6 }}>
                <PlusOutlined title='Add Dashboard' style={{ fontSize: 18 }} />
              </Button>
            </Dropdown>

            {/* ปุ่ม Refresh */}
            <Button type="text" className="toolbar-btn" style={{ padding: 6 }} onClick={handleRefresh}>
              <ReloadOutlined title="Refresh" style={{ fontSize: 18 }} />
            </Button>

            {/* ปุ่ม Search
            <Button type="text" className="toolbar-btn" style={{ padding: 6 }}>
              <SearchOutlined style={{ fontSize: 18 }} />
            </Button> */}

            <div
              className="tb-search"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                background: '#fff',
                padding: '0px',
                borderRadius: '0 0 0 0'
              }}
            >
              <Input.Search
                placeholder="Search dashboard…"
                allowClear
                style={{ width: 300 }}
              />
            </div>
          </Space>
        </div>
      ) : (
        <div
          style={{
            background: '#e6fffb',
            padding: '20px 24px',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // border: "1px solid #b5f5ec",
          }}
        >
          <Title level={3} style={{ margin: 0, color: '#13c2c2' }}>
            ({selectedRowKeys.length}) dashboard selected
          </Title>

          <Space size="middle">
            <Button type="text" className="toolbar-btn" style={{ padding: 6 }}>
              <ContactsOutlined title='Assign Dashboard' style={{ fontSize: 18, }} />
            </Button>
            <Button type="text" className="toolbar-btn" style={{ padding: 6 }}>
              <UndoOutlined title='UnAssign Dashboard' style={{ fontSize: 18 }} />
            </Button>
            <Button type="text" className="toolbar-btn" style={{ padding: 6 }}>
              <DeleteOutlined title='Delete' style={{ fontSize: 18 }} />
            </Button>
          </Space>
        </div>
      )}

      {/* <div
        className="tb-search"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#fff',
          padding: '0 24px 0px 24px',
          borderRadius: '0 0 0 0'
        }}
      >
        <Input.Search
          placeholder="Search dashboard…"
          allowClear
          style={{ width: 300 }}
        />
      </div> */}


      <Spin spinning={loading} style={{ backgroundColor: "#fff" }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '0px 0px 8px 8px' }}>
          <Table
            rowSelection={{ type: 'checkbox', ...rowSelection }}
            columns={columns}
            dataSource={mockData}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: total => `Total ${total} items`,
            }}
            className="custom-table"
          />
        </div>
      </Spin>


      {/* Modal Add Dashboard */}
      <Modal
        open={isAddModalOpen}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
        width={700}
        className="tb-modal"
        centered
      >
        <div className="tb-modal-header">
          <span style={{ fontSize: "26px", fontWeight: 500 }}>Add dashboard</span>
          {/* <CloseOutlined onClick={() => setAddModalOpen(false)} className="tb-close" /> */}
        </div>

        <div className="tb-modal-body">
          <div className="tb-field">
            <label style={{ fontSize: "16px" }}>Title*</label>
            <Input placeholder="Dashboard Title" style={{ marginBottom: "12px" }} />
          </div>

          <div className="tb-field">
            <label style={{ fontSize: "16px" }}>Description</label>
            <Input.TextArea rows={3} placeholder="Description" style={{ marginBottom: "12px" }} />
          </div>

          <div className="tb-field">
            <label style={{ fontSize: "16px" }}>Assigned customers</label>
            <Input placeholder="Assign customers" style={{ marginBottom: "12px" }} />
          </div>

          <div className="tb-section-title" style={{ marginBottom: "12px", fontSize: "16px" }}>Mobile application settings</div>

          <Checkbox style={{ marginBottom: "12px", fontSize: "16px" }}>Hide dashboard in mobile application</Checkbox>

          <div className="tb-field">
            <Input placeholder="Dashboard order in mobile application" style={{ marginBottom: "12px" }} />
          </div>

          {/* <div className="tb-section-title">Dashboard image</div>

          <div className="tb-image-row">
            <div className="tb-image-card">Browse from gallery</div>
            <div className="tb-image-card">Set link</div>
          </div> */}

          <div className="tb-footer" style={{ display: 'flex', justifyContent: "flex-end", gap: "10px", marginTop: "14px" }}>
            <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button type="primary">Add</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Import Dashboard */}
      <Modal open={isImportModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={null}
        width={600}
        className="tb-modal"
        centered
      >
        <div className="tb-modal-header">
          <span style={{ fontSize: "26px", fontWeight: 500 }}>Import dashboard</span>
          {/* <CloseOutlined onClick={() => setAddModalOpen(false)} className="tb-close" /> */}
        </div>

        <div className="tb-modal-body">
          <div className="tb-field">
            <label className="tb-label" style={{ fontSize: "16px" }}>Dashboard file*</label>

            {/* Drag & Drop Upload Component */}
            <Dragger {...uploadProps} style={{ padding: 20 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#1677ff" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for single dashboard import. Only JSON files are allowed.
              </p>
            </Dragger>

          </div>
          <div className="tb-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button onClick={() => setImportModalOpen(false)}>Cancel</Button>
            <Button type="primary">Import</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardList;