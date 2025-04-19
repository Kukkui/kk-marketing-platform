import { useState } from 'react';
import { Input, Button, Typography, Form, message, Card } from 'antd';
import dynamic from 'next/dynamic';
import axios, { AxiosError } from 'axios';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const { Title } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CampaignFormValues {
  campaignName: string;
  subjectLine: string;
  emailContent: string;
}

export default function CreateCampaign() {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CampaignFormValues>();

  const handleSubmit = async (values: CampaignFormValues) => {
    const { campaignName, subjectLine, emailContent } = values;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/campaign`, {
        campaignName,
        subjectLine,
        emailContent,
      });
      message.success('Campaign created successfully! 🎉');
      form.resetFields();
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Error creating campaign: ${axiosError.message}`);
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
          Create New Campaign 🚀
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ campaignName: '', subjectLine: '', emailContent: '' }}
        >
          <Form.Item
            label="Campaign Name"
            name="campaignName"
            rules={[{ required: true, message: 'Please input the campaign name!' }]}
          >
            <Input
              placeholder="e.g. Summer Deals 2025"
              style={{ borderRadius: '8px' }}
              className="hover:border-blue-400 transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label="Subject Line"
            name="subjectLine"
            rules={[{ required: true, message: 'Please input the subject line!' }]}
          >
            <Input
              placeholder="e.g. Hot Summer Discounts Inside 🔥"
              style={{ borderRadius: '8px' }}
              className="hover:border-blue-400 transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label="Email Content"
            name="emailContent"
            rules={[{ required: true, message: 'Please input the email content!' }]}
          >
            <ReactQuill
              placeholder="Compose your email content here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ script: 'sub' }, { script: 'super' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  [{ align: [] }],
                  ['link', 'image', 'video'],
                  ['clean'],
                ],
              }}
              formats={[
                'header',
                'bold',
                'italic',
                'underline',
                'strike',
                'list',
                'bullet',
                'script',
                'indent',
                'align',
                'link',
                'image',
                'video',
              ]}
              className="hover:border-blue-400 transition-all duration-300"
            />
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
              Save Campaign 🎉
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}