import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface EmailList {
  key: string;
  listName: string;
  description: string;
  subscriberCount: number;
  createdAt: string;
}

const initialData: EmailList[] = [
  {
    key: '1',
    listName: 'Newsletter Subscribers',
    description: 'Monthly newsletter recipients',
    subscriberCount: 1200,
    createdAt: '2025-04-17',
  },
  {
    key: '2',
    listName: 'VIP Customers',
    description: 'High-value customers',
    subscriberCount: 350,
    createdAt: '2025-04-10',
  },
  {
    key: '3',
    listName: 'Event Attendees',
    description: 'Participants of past events',
    subscriberCount: 800,
    createdAt: '2025-04-03',
  },
  {
    key: '4',
    listName: 'Product Updates',
    description: 'Users interested in product news',
    subscriberCount: 2500,
    createdAt: '2025-03-27',
  },
  {
    key: '5',
    listName: 'Beta Testers',
    description: 'Early access program members',
    subscriberCount: 150,
    createdAt: '2025-03-20',
  },
  {
    key: '6',
    listName: 'Holiday Promotions',
    description: 'Seasonal offer subscribers',
    subscriberCount: 1800,
    createdAt: '2025-03-13',
  },
  {
    key: '7',
    listName: 'Loyalty Program',
    description: 'Members of rewards program',
    subscriberCount: 600,
    createdAt: '2025-03-06',
  },
  {
    key: '8',
    listName: 'Webinar Registrants',
    description: 'Signed up for webinars',
    subscriberCount: 400,
    createdAt: '2025-02-27',
  },
];

const AudienceEmailListsPage: React.FC = () => {
  const [data, setData] = useState<EmailList[]>(initialData);
  const [searchText, setSearchText] = useState('');

  const handleDelete = (key: string) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Email list deleted successfully');
  };

  const handleEdit = (record: EmailList) => {
    message.info(`Edit email list: ${record.listName}`);
    // You can redirect or open a modal to edit
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = initialData.filter(
      (item) =>
        item.listName.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.subscriberCount.toString().includes(value) ||
        item.createdAt.toLowerCase().includes(value)
    );
    setData(filteredData);
  };

  const columns = [
    {
      title: 'List Name',
      dataIndex: 'listName',
      key: 'listName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Subscribers',
      dataIndex: 'subscriberCount',
      key: 'subscriberCount',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: EmailList) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this email list?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ height: '100vh', overflow: 'auto' }} variant="outlined">
      <div className="p-6 max-w-3xl mx-auto space-y-6 bg-white shadow rounded-md">
        <Title level={3}>Audience Email Lists</Title>
        <Input
          placeholder="Search email lists..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ marginBottom: '16px' }}
        />
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 5,
            position: ['bottomRight'],
          }}
        />
      </div>
    </Card>
  );
};

export default AudienceEmailListsPage;