/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Campaign {
  id: string;
  campaign_name: string;
  subject_line: string;
  email_content: string;
  created_at: string;
}

const CampaignListsPage: React.FC = () => {
  const [data, setData] = useState<Campaign[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isFetchCampaignSuccess = useRef("");

  // Show success or error message after fetching campaigns
  useEffect(() => {
    if (isFetchCampaignSuccess.current === "success") message.success('Campaigns fetched successfully! 🎉');
    if (isFetchCampaignSuccess.current === "failed") message.error('Failed to fetch campaigns. Please try again later.');
  }, [isFetchCampaignSuccess.current]);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Record<string, Campaign[]>>(`${API_URL}/campaign`);
        const formattedData = response.data.data.map((item) => ({
          id: item.id.toString(),
          campaign_name: item.campaign_name,
          subject_line: item.subject_line,
          email_content: item.email_content,
          created_at: dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
        }));
        setData(formattedData);
        isFetchCampaignSuccess.current = "success"; // TODO: ENUM
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error fetching campaign data:', axiosError);
        isFetchCampaignSuccess.current = "failed"; // TODO: ENUM
        // Fallback mock data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/api/campaign/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success('Campaign deleted successfully! 🎉');
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to delete campaign: ${axiosError.message}`);
    }
  };

  const handleEdit = (record: Campaign): void => {
    message.info(`Edit campaign: ${record.campaign_name}`);
    // Implement edit logic (e.g., redirect or open modal)
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setData((prev) =>
      prev.filter(
        (item) =>
          item.campaign_name.toLowerCase().includes(value) ||
          item.subject_line.toLowerCase().includes(value) ||
          item.email_content.toLowerCase().includes(value) ||
          item.created_at.toLowerCase().includes(value)
      )
    );
  };

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'campaign_name',
      key: 'campaign_name',
      width: 200,
    },
    {
      title: 'Subject Line',
      dataIndex: 'subject_line',
      key: 'subject_line',
      width: 250,
    },
    {
      title: 'Email Content',
      dataIndex: 'email_content',
      key: 'email_content',
      width: 300,
      render: (text: string) => (
        <div
          style={{
            maxHeight: '100px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: unknown, record: Campaign) => (
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
            onConfirm={() => handleDelete(record.id)}
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
          loading={loading}
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