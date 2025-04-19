import { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Input, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Automation {
  key: string;
  name: string;
  schedule: string;
  campaign: string;
  audiences: string[];
  status: 'Running' | 'Completed' | 'Paused';
}

const initialData: Automation[] = [
  {
    key: '1',
    name: 'Spring Blast',
    schedule: '2025-04-20 10:00:00',
    campaign: 'Spring Sale',
    audiences: ['john@example.com', 'jane@example.com'],
    status: 'Running',
  },
  {
    key: '2',
    name: 'Summer Vibes',
    schedule: '2025-06-15 14:30:00',
    campaign: 'Summer Kickoff',
    audiences: ['bob@example.com'],
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Fall Frenzy',
    schedule: '2025-09-10 09:00:00',
    campaign: 'Fall Specials',
    audiences: ['alice@example.com', 'john@example.com'],
    status: 'Completed',
  },
  {
    key: '4',
    name: 'Winter Magic',
    schedule: '2025-12-05 16:00:00',
    campaign: 'Winter Wonderland',
    audiences: ['jane@example.com', 'bob@example.com', 'alice@example.com'],
    status: 'Running',
  },
  {
    key: '5',
    name: 'Holiday Sparkle',
    schedule: '2025-12-20 12:00:00',
    campaign: 'Holiday Cheer',
    audiences: ['john@example.com'],
    status: 'Paused',
  },
];

export default function AutomationListsPage() {
  const [data, setData] = useState<Automation[]>(initialData);
  const [searchText, setSearchText] = useState('');

  const handleDelete = (key: string) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Automation deleted successfully! 🎉');
  };

  const handleEdit = (record: Automation) => {
    message.info(`Edit automation: ${record.name}`);
    // Implement edit logic (e.g., redirect to edit page or open modal)
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = initialData.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.schedule.toLowerCase().includes(value) ||
        item.campaign.toLowerCase().includes(value) ||
        item.audiences.some((email) => email.toLowerCase().includes(value)) ||
        item.status.toLowerCase().includes(value)
    );
    setData(filteredData);
  };

  const columns = [
    {
      title: 'Automation Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 180,
    },
    {
      title: 'Campaign',
      dataIndex: 'campaign',
      key: 'campaign',
      width: 150,
    },
    {
      title: 'Audiences',
      dataIndex: 'audiences',
      key: 'audiences',
      width: 250,
      render: (audiences: string[]) => audiences.join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Automation['status']) => {
        let color;
        switch (status) {
          case 'Running':
            color = 'green';
            break;
          case 'Completed':
            color = 'blue';
            break;
          case 'Paused':
            color = 'orange';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: Automation) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{
              borderRadius: '6px',
              background: '#60a5fa',
              color: 'white',
              border: 'none',
            }}
            className="hover:scale-105 transition-all duration-300"
          />
          <Popconfirm
            title="Are you sure to delete this automation?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: '6px' }}
              className="hover:scale-105 transition-all duration-300"
           />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        minHeight: '100vh',
        overflow: 'auto',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid #bae6fd',
      }}
      variant="outlined"
    >
      <div className="p-8 max-w-3xl mx-auto space-y-6 bg-white shadow-xl rounded-lg">
        <Title
          level={3}
          style={{
            color: '#1e40af',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Automation Lists 🚀
        </Title>
        <Input
          placeholder="Search automations..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{
            marginBottom: '16px',
            borderRadius: '8px',
          }}
          className="hover:border-blue-400 transition-all duration-300"
        />
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 5,
            position: ['bottomRight'],
          }}
          scroll={{ x: true }}
          rowClassName="hover:bg-blue-50 transition-all duration-300"
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        />
      </div>
    </Card>
  );
}