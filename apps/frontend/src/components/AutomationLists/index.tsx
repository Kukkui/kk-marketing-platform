import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Input, Tag, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios, { AxiosError } from 'axios';
import AutomationForm, { AutomationFormValues } from '../AutomationCreation'; // Import AutomationFormValues
import dayjs from 'dayjs';

const { Title } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Campaign {
  id: number;
  campaign_name: string;
}

interface Audience {
  id: number;
  email: string;
}

interface Automation {
  id: string;
  name: string;
  schedule: string;
  campaign: number;
  audiences: number[];
  status: 'Running' | 'Completed' | 'Paused';
}

interface DisplayAutomation {
  key: string;
  name: string;
  schedule: string;
  campaign: string;
  audiences: string[];
  status: 'Running' | 'Completed' | 'Paused';
}

const AutomationListsPage: React.FC = () => {
  const [data, setData] = useState<DisplayAutomation[]>([]);
  const [searchText, setSearchText] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all necessary data on mount
  const fetchData = async () => {
    setLoading(true);
    try {
      const [automationResponse, campaignResponse, audienceResponse] = await Promise.all([
        axios.get<{ data: Automation[] }>(`${API_URL}/automation`),
        axios.get<Record<string, Campaign[]>>(`${API_URL}/campaign`),
        axios.get<Record<string, Audience[]>>(`${API_URL}/audience`),
      ]);

      const automations = automationResponse.data.data;
      const campaignList = campaignResponse.data.data;  
      const audienceList = audienceResponse.data.data;

      setCampaigns(campaignList);
      setAudiences(audienceList);

      // Map automations to display format
      const displayData = automations.map((automation) => {
        const campaign = campaignList.find((c) => c.id === automation.campaign);
        const audienceEmails = automation.audiences.map((audienceId) => {
          const audience = audienceList.find((a) => a.id === audienceId);

          return audience ? audience.email : `Unknown (${audienceId})`;
        });

        return {
          key: automation.id,
          name: automation.name,
          schedule: automation.schedule,
          campaign: campaign ? campaign.campaign_name : `Unknown (${automation.campaign})`,
          audiences: audienceEmails,
          status: automation.status,
        };
      });

      setData(displayData);
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to fetch data: ${axiosError.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (key: string) => {
    try {
      await axios.delete(`${API_URL}/automation/${key}`);
      setData((prev) => prev.filter((item) => item.key !== key));
      message.success('Automation deleted successfully! 🎉');
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Error deleting automation: ${axiosError.message}`);
    }
  };

  const handleEdit = (record: DisplayAutomation) => {
    const originalAutomation = data.find((item) => item.key === record.key);

    if (originalAutomation) {
      const automationForEdit: Automation = {
        id: record.key,
        name: record.name,
        schedule: record.schedule,
        campaign: campaigns.find((c) => c.campaign_name === record.campaign)?.id || 0,
        audiences: record.audiences.map((email) => {
          const audience = audiences.find((a) => a.email === email);
          return audience ? audience.id : 0;
        }).filter((id) => id !== 0),
        status: record.status,
      };

      setSelectedAutomation(automationForEdit);
      setEditModalVisible(true);
    }
  };

  const handleUpdateAutomation = async (values: AutomationFormValues & { id?: string }) => {
    if (!values.id) return;

    try {
      const payload = {
        name: values.name,
        schedule: values?.schedule ? dayjs(values?.schedule).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : "-",
        campaign: values?.campaign,
        audienceIds: values?.audiences,
        status: values?.status,
      };
      await axios.put(`${API_URL}/automation/${values.id}`, payload);
      await fetchData(); // Refresh the table data

      setEditModalVisible(false);
      setSelectedAutomation(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Error updating automation: ${axiosError.message}`);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = data.filter(
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: DisplayAutomation['status']) => {
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
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: DisplayAutomation) => (
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
    >
      <div className="p-8 max-w-5xl mx-auto space-y-6 bg-white shadow-xl rounded-lg">
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
          loading={loading}
          pagination={{
            pageSize: 5,
            position: ['bottomRight'],
          }}
          scroll={{ x: true }}
          rowClassName="hover:bg-blue-50 transition-all duration-300"
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        />
        <Modal
          title={
            <span style={{ color: '#1e40af', fontWeight: 'bold' }}>
              Edit Automation 🚀
            </span>
          }
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setSelectedAutomation(null);
          }}
          footer={null}
          style={{ top: 20 }}
          width={800}
        >
          {selectedAutomation && (
            <AutomationForm
              initialData={selectedAutomation}
              onSubmit={handleUpdateAutomation}
              onCancel={() => {
                setEditModalVisible(false);
                setSelectedAutomation(null);
              }}
            />
          )}
        </Modal>
      </div>
    </Card>
  );
};

export default AutomationListsPage;