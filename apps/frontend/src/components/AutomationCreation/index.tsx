import { useState } from 'react';
import { Button, Form, Input, Select, DatePicker, List, Space, Card, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Configure AntD DatePicker to use dayjs
import dayJsAntd from 'antd/es/date-picker';
// dayJsAntd.generateConfig = {
//   ...dayJsAntd.generateConfig,
//   getNow: () => dayjs(),
// };

const { Option } = Select;
const { Title } = Typography;

// Mock data for campaigns and audiences
const campaigns = [
  { id: 1, name: 'Summer Sale', key: '1' },
  { id: 2, name: 'Winter Collection', key: '2' },
  { id: 3, name: 'Black Friday', key: '3' },
  { id: 4, name: 'Spring Launch', key: '4' },
  { id: 5, name: 'Holiday Specials', key: '5' },
];

const audiences = [
  { id: 1, email: 'john@example.com', key: '6' },
  { id: 2, email: 'jane@example.com', key: '7' },
  { id: 3, email: 'bob@example.com', key: '8' },
  { id: 4, email: 'alice@example.com', key: '9' },
];

export default function AutomationForm() {
  const [form] = Form.useForm();
  const [campaignSearch, setCampaignSearch] = useState('');
  const [audienceSearch, setAudienceSearch] = useState('');
  const [sortedCampaigns, setSortedCampaigns] = useState(campaigns);
  const [sortedAudiences, setSortedAudiences] = useState(audiences);
  const [loading, setLoading] = useState(false);

  // Handle campaign search
  const handleCampaignSearch = (value: string) => {
    setCampaignSearch(value);
    const filtered = campaigns
      .filter((campaign) => campaign.name.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
    setSortedCampaigns(filtered);
  };

  // Handle audience search
  const handleAudienceSearch = (value: string) => {
    setAudienceSearch(value);
    const filtered = audiences
      .filter((audience) => audience.email.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => a.email.localeCompare(b.email));
    setSortedAudiences(filtered);
  };

  // Handle form submission
  const onFinish = async (values: {
    name: string;
    schedule: dayjs.Dayjs | null;
    campaign: number | null;
    audiences: { id: number; email: string; }[];
  }) => {
    const { name, schedule, campaign, audiences } = values;
    console.log({
        name,
        schedule: schedule ? schedule.format('YYYY-MM-DD HH:mm:ss') : null,
        campaign,
        audiences,
    });

    if (!values.name || !values.schedule || !values.campaign || !values.audiences.length) {
      message.warning('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // MOCK API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form values:', {
        ...values,
        schedule: values.schedule ? values.schedule.format('YYYY-MM-DD HH:mm:ss') : null,
      });
      message.success('Automation created successfully!');
      form.resetFields();
    //   setCampaignSearch('');
    //   setAudienceSearch('');
    //   setSortedCampaigns(campaigns);
    //   setSortedAudiences(audiences);
    } catch (error) {
      console.error(error);
      message.error('Error creating automation.');
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
        <Title
          level={3}
          style={{
            color: '#1e40af',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Create New Automation 🚀
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ schedule: null, campaign: null, audiences: [] }}
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
                        {item.name}
                      </List.Item>
                    )}
                  />
                </>
              )}
            >
              {sortedCampaigns.map((campaign) => (
                <Option key={campaign.id} value={campaign.id}>
                  {campaign.name}
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

          <Form.Item style={{ textAlign: 'right' }}>
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
              Save Automation 🎉
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}