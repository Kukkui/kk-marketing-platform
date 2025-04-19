import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Typography,
  Card,
  Input,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

interface Campaign {
  key: string;
  campaignName: string;
  subjectLine: string;
  createdAt: string;
}

const initialData: Campaign[] = [
  {
    key: '1',
    campaignName: 'Spring Sale',
    subjectLine: 'Don’t Miss Out 🌸',
    createdAt: '2025-04-17',
  },
  {
    key: '2',
    campaignName: 'Summer Kickoff',
    subjectLine: 'Hot Deals Ahead ☀️',
    createdAt: '2025-04-10',
  },
  {
    key: '3',
    campaignName: 'Fall Specials',
    subjectLine: 'Autumn Discounts 🍂',
    createdAt: '2025-04-03',
  },
  {
    key: '4',
    campaignName: 'Winter Wonderland',
    subjectLine: 'Cozy Up with Our Offers ❄️',
    createdAt: '2025-03-27',
  },
  {
    key: '5',
    campaignName: 'Holiday Cheer',
    subjectLine: 'Festive Deals Inside 🎉',
    createdAt: '2025-03-20',
  },
  {
    key: '6',
    campaignName: 'New Year, New Deals',
    subjectLine: 'Start the Year Right 🎊',
    createdAt: '2025-03-13',
  },
  {
    key: '7',
    campaignName: 'Valentine’s Day Specials',
    subjectLine: 'Love is in the Air ❤️',
    createdAt: '2025-03-06',
  },
  {
    key: '8',
    campaignName: 'Back to School',
    subjectLine: 'Gear Up for Success 🎒',
    createdAt: '2025-02-27',
  },
];

const CampaignListsPage: React.FC = () => {
  const [data, setData] = useState<Campaign[]>(initialData);
  const [searchText, setSearchText] = useState('');

  const handleDelete = (key: string) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Campaign deleted successfully! 🎉');
  };

  const handleEdit = (record: Campaign) => {
    message.info(`Edit campaign: ${record.campaignName}`);
    // Redirect or open modal logic
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = initialData.filter(
      (item) =>
        item.campaignName.toLowerCase().includes(value) ||
        item.subjectLine.toLowerCase().includes(value) ||
        item.createdAt.toLowerCase().includes(value)
    );
    setData(filteredData);
  };

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'campaignName',
      key: 'campaignName',
      width: 200,
    },
    {
      title: 'Subject Line',
      dataIndex: 'subjectLine',
      key: 'subjectLine',
      width: 300,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: Campaign) => (
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
            title="Are you sure to delete this campaign?"
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
          Campaign Lists 📢
        </Title>
        <Input
          placeholder="Search campaigns..."
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
};

export default CampaignListsPage;
