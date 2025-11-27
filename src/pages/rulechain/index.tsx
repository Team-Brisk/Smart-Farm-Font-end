import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  SaveOutlined, 
  PlayCircleOutlined, 
  ApiOutlined,
  FilterOutlined,
  CodeOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Button, Card, Space, Badge, Tooltip, Modal, Form, Input, Select, message } from 'antd';

const nodeTypes = [
  { type: 'input', label: 'Input Node',  color: '#667eea', description: 'Entry point for data' },
  { type: 'filter', label: 'Filter Node',  color: '#4facfe', description: 'Filter conditions' },
  { type: 'script', label: 'Script Node', color: '#fa709a', description: 'Custom logic' },
  { type: 'mqtt', label: 'MQTT Node', color: '#52c41a', description: 'MQTT publish' },
  { type: 'save', label: 'Save Attribute', color: '#faad14', description: 'Store data' }
];

function Sidebar() {
  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ 
      width: 280,
      background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(102,126,234,0.03) 100%)',
      borderRight: '1px solid rgba(102, 126, 234, 0.1)',
      padding: '20px',
      overflowY: 'auto',
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ThunderboltOutlined style={{ fontSize: '20px', color: '#667eea' }} />
          Node Palette
        </h3>
        <p style={{ 
          margin: '8px 0 0', 
          fontSize: '12px', 
          color: 'rgba(0,0,0,0.45)' 
        }}>
          Drag nodes to canvas
        </p>
      </div>

      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            onDragStart={(event) => onDragStart(event, node)}
            draggable
            style={{
              padding: '16px',
              background: '#fff',
              border: '2px solid rgba(102, 126, 234, 0.1)',
              borderRadius: '12px',
              cursor: 'grab',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.15)';
              e.currentTarget.style.borderColor = node.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: `linear-gradient(180deg, ${node.color} 0%, ${node.color}80 100%)`
            }} />
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                fontSize: '28px',
                lineHeight: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>
                {node.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(0,0,0,0.45)',
                  lineHeight: '1.4'
                }}>
                  {node.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Space>

    
    </aside>
  );
}

function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const { project } = useReactFlow();
  const [loading, setLoading] = useState(false);

  const customNodeStyle = (color) => ({
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid',
    borderColor: color,
    background: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    minWidth: '180px',
    fontWeight: 500
  });

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      animated: true,
      style: { stroke: '#667eea', strokeWidth: 2 },
      type: 'smoothstep'
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    const position = project({ x: event.clientX - 280, y: event.clientY - 80 });
    
    const newNode = {
      id: `${nodeData.type}_${+new Date()}`,
      type: nodeData.type === 'input' ? 'input' : nodeData.type === 'mqtt' || nodeData.type === 'save' ? 'output' : 'default',
      position,
      data: { 
        label: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{nodeData.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{nodeData.label}</div>
          </div>
        ),
        config: {}
      },
      style: customNodeStyle(nodeData.color)
    };
    
    setNodes((nds) => nds.concat(newNode));
    message.success(`Added ${nodeData.label}`);
  }, [project, setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const deleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter(n => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
      message.success('Node deleted');
    }
  };

  const saveFlow = async () => {
    setLoading(true);
    try {
      // Simulated save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Rule chain saved successfully! 🎉');
    } catch (error) {
      message.error('Failed to save rule chain');
    } finally {
      setLoading(false);
    }
  };

  const runFlow = async () => {
    if (nodes.length === 0) {
      message.warning('Please add nodes first');
      return;
    }
    
    setLoading(true);
    try {
      // Simulated run - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Rule chain executed successfully! ✅');
    } catch (error) {
      message.error('Failed to run rule chain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f7fa' }}>
      <Sidebar />
      
      <div style={{ flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Top Toolbar */}
        <div style={{
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Rule Chain Editor
            </h2>
            <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '4px' }}>
              <Badge status="processing" /> 
              {nodes.length} nodes • {edges.length} connections
            </div>
          </div>

          <Space size={12}>
            {selectedNode && (
              <>
                <Tooltip title="Configure Node">
                  <Button 
                    icon={<SettingOutlined />}
                    onClick={() => setConfigModalOpen(true)}
                  >
                    Configure
                  </Button>
                </Tooltip>
                <Tooltip title="Delete Node">
                  <Button 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={deleteNode}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </>
            )}
            
            <Button
              type="default"
              icon={<SaveOutlined />}
              onClick={saveFlow}
              loading={loading}
              style={{
                borderColor: '#667eea',
                color: '#667eea'
              }}
            >
              Save Flow
            </Button>
            
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={runFlow}
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              Run Flow
            </Button>
          </Space>
        </div>

        {/* Canvas */}
        <div style={{ flexGrow: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            fitView
            style={{ background: '#fafbfc' }}
            connectionLineStyle={{ stroke: '#667eea', strokeWidth: 2 }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#667eea', strokeWidth: 2 }
            }}
          >
            <Background 
              gap={20} 
              size={1} 
              color="rgba(102, 126, 234, 0.1)"
            />
            <Controls 
              style={{
                button: {
                  background: '#fff',
                  borderColor: 'rgba(102, 126, 234, 0.2)',
                  color: '#667eea'
                }
              }}
            />
            <MiniMap 
              nodeColor={(node) => {
                const nodeType = nodeTypes.find(n => node.id.startsWith(n.type));
                return nodeType?.color || '#667eea';
              }}
              maskColor="rgba(102, 126, 234, 0.1)"
              style={{
                background: '#fff',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '8px'
              }}
            />
            
            {nodes.length === 0 && (
              <Panel position="center">
                <div style={{
                  padding: '32px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '2px dashed rgba(102, 126, 234, 0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}></div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Start Building  Rule Chain
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>
               
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Node Configuration Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SettingOutlined style={{ color: '#667eea' }} />
              Configure Node
            </div>
          }
          open={configModalOpen}
          onCancel={() => setConfigModalOpen(false)}
          onOk={() => {
            setConfigModalOpen(false);
            message.success('Configuration saved');
          }}
          width={600}
        >
          <Form layout="vertical">
            <Form.Item label="Node Label">
              <Input placeholder="Enter node label" />
            </Form.Item>
            <Form.Item label="Configuration">
              <Input.TextArea 
                rows={4} 
                placeholder="Enter JSON configuration" 
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default function RuleChainEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}