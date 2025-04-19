import { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, List, Space, message, Card, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios, { AxiosError } from 'axios';
const { Title } = Typography;

const { Option } = Select;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Campaign {
  id: number;
  campaign_name: string;
}

interface Audience {
  id: number;
  email: string;
}

export interface AutomationFormValues {
  name: string;
  schedule: Dayjs | null;
  campaign: number | null;
  audiences: number[];
  status: string;
}

interface AutomationFormProps {
  initialData?: {
    id?: string;
    name: string;
    schedule: string;
    campaign: number;
    audiences: number[];
    status: string;
  };
  onSubmit: (values: AutomationFormValues & { id?: string }) => Promise<void>;
  onCancel?: () => void;
}

const AutomationForm: React.FC<AutomationFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form] = Form.useForm<AutomationFormValues>();
  const [campaignSearch, setCampaignSearch] = useState<string>('');
  const [audienceSearch, setAudienceSearch] = useState<string>('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sortedCampaigns, setSortedCampaigns] = useState<Campaign[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [sortedAudiences, setSortedAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch campaigns and audiences on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignResponse, audienceResponse] = await Promise.all([
          axios.get<Record<string, Campaign[]>>(`${API_URL}/campaign`),
          axios.get<Record<string, Audience[]>>(`${API_URL}/audience`),
        ]);

        setCampaigns(campaignResponse.data.data);
        setSortedCampaigns(campaignResponse.data.data);
        setAudiences(audienceResponse.data.data);
        setSortedAudiences(audienceResponse.data.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        message.error(`Failed to fetch data: ${axiosError.message}`);
      }
    };
    fetchData();
  }, []);

  // Set initial form values if editing
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        schedule: initialData.schedule ? dayjs(initialData.schedule) : null,
        campaign: initialData.campaign,
        audiences: initialData.audiences,
        status: initialData.status,
      });
    }
  }, [initialData, form]);

  // Handle campaign search
  const handleCampaignSearch = (value: string): void => {
    setCampaignSearch(value);
    const filtered = campaigns
      .filter((campaign) => campaign.campaign_name.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => a.campaign_name.localeCompare(b.campaign_name));
    setSortedCampaigns(filtered);
  };

  // Handle audience search
  const handleAudienceSearch = (value: string): void => {
    setAudienceSearch(value);
    const filtered = audiences
      .filter((audience) => audience.email.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => a.email.localeCompare(b.email));
    setSortedAudiences(filtered);
  };

  // Handle form submission
  const handleFinish = async (values: AutomationFormValues) => {
    if (!values.name || !values.schedule || !values.campaign || !values.audiences.length || !values.status) {
      message.warning('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ ...values, id: initialData?.id });
      message.success(initialData ? 'Automation updated successfully! 🎉' : 'Automation created successfully! 🎉');
      form.resetFields();
      setCampaignSearch('');
      setAudienceSearch('');
      setSortedCampaigns(campaigns);
      setSortedAudiences(audiences);
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Error ${initialData ? 'updating' : 'creating'} automation: ${axiosError.message}`);
    } finally {
      setLoading(false);
    }
  };

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
      {!initialData && <Title
          level={3}
          style={{
            color: '#1e40af',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Create New Automation 🚀
        </Title>}
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ schedule: null, campaign: null, audiences: [], status: 'Running' }}
    >
      <Form.Item
        label="Automation Name"
        name="name"
        rules={[{ required: true, message: 'Please input the automation name!' }]}
      >
        <Input
          placeholder="e.g. Summer Blast Campaign"
          className="hover:border-blue-400 transition-all duration-300"
          style={{ borderRadius: '8px' }}
        />
      </Form.Item>

      <Form.Item
        label="Schedule"
        name="schedule"
        rules={[{ required: true, message: 'Please select a schedule!' }]}
      >
        <DatePicker
          showTime
          style={{ width: '100%', borderRadius: '8px' }}
          placeholder="Select date and time"
          disabledDate={(current) => current && current < dayjs().startOf('day')}
          className="hover:border-blue-400 transition-all duration-300"
        />
      </Form.Item>

      <Form.Item
        label="Campaign"
        name="campaign"
        rules={[{ required: true, message: 'Please select a campaign!' }]}
      >
        <Select
          showSearch
          placeholder="Select a campaign"
          filterOption={false}
          onSearch={handleCampaignSearch}
          className="hover:border-blue-400 transition-all duration-300"
          style={{ borderRadius: '8px' }}
          dropdownRender={(menu) => (
            <>
              <Space style={{ padding: '8px' }}>
                <Input
                  placeholder="Search campaigns"
                  prefix={<SearchOutlined />}
                  onChange={(e) => handleCampaignSearch(e.target.value)}
                  value={campaignSearch}
                  style={{ borderRadius: '6px' }}
                />
              </Space>
              <List
                size="small"
                dataSource={sortedCampaigns}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                    className="hover:bg-blue-50"
                    onClick={() => {
                      form.setFieldsValue({ campaign: item.id });
                      setCampaignSearch('');
                      setSortedCampaigns(campaigns);
                    }}
                  >
                    {item.campaign_name}
                  </List.Item>
                )}
              />
            </>
          )}
        >
          {sortedCampaigns.map((campaign) => (
            <Option key={campaign.id} value={campaign.id}>
              {campaign.campaign_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Audience Emails"
        name="audiences"
        rules={[{ required: true, message: 'Please select at least one audience!' }]}
      >
        <Select
          mode="multiple"
          showSearch
          placeholder="Select audiences"
          filterOption={false}
          onSearch={handleAudienceSearch}
          className="hover:border-blue-400 transition-all duration-300"
          style={{ borderRadius: '8px' }}
          dropdownRender={(menu) => (
            <>
              <Space style={{ padding: '8px' }}>
                <Input
                  placeholder="Search emails"
                  prefix={<SearchOutlined />}
                  onChange={(e) => handleAudienceSearch(e.target.value)}
                  value={audienceSearch}
                  style={{ borderRadius: '6px' }}
                />
              </Space>
              <List
                size="small"
                dataSource={sortedAudiences}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                    className="hover:bg-blue-50"
                    onClick={() => {
                      const currentAudiences = form.getFieldValue('audiences') || [];
                      if (!currentAudiences.includes(item.id)) {
                        form.setFieldsValue({
                          audiences: [...currentAudiences, item.id],
                        });
                      }
                    }}
                  >
                    {item.email}
                  </List.Item>
                )}
              />
            </>
          )}
        >
          {sortedAudiences.map((audience) => (
            <Option key={audience.id} value={audience.id}>
              {audience.email}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Please select a status!' }]}
      >
        <Select
          placeholder="Select status"
          className="hover:border-blue-400 transition-all duration-300"
          style={{ borderRadius: '8px' }}
          defaultValue="Running"
        >
          <Option value="Running">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#52c41a', marginRight: '8px' }}>▶️</span> Running
            </span>
          </Option>
          <Option value="Paused">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#ff4d4f', marginRight: '8px' }}>⏸️</span> Paused
            </span>
          </Option>
        </Select>
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Space>
          {onCancel && (
            <Button
              onClick={onCancel}
              style={{
                borderRadius: '8px',
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
              border: 'none',
              padding: '0 24px',
              height: '40px',
              transition: 'all 0.3s',
            }}
            className="hover:scale-105 hover:shadow-lg"
          >
            {initialData ? 'Update Automation 🎉' : 'Save Automation 🎉'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
    </div>
    </Card>
  );
};

export default AutomationForm;