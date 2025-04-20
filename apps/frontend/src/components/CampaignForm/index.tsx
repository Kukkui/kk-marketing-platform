import { useState, useEffect } from 'react';
import { Input, Button, Form, message, Space } from 'antd';
import dynamic from 'next/dynamic';
import axios, { AxiosError } from 'axios';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CampaignFormValues {
  campaignName: string;
  subjectLine: string;
  emailContent: string;
}

interface CampaignFormProps {
  initialData?: {
    id?: string;
    campaignName: string;
    subjectLine: string;
    emailContent: string;
  };
  onCancel?: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ initialData, onCancel }) => {
  const [form] = Form.useForm<CampaignFormValues>();
  const [loading, setLoading] = useState<boolean>(false);

  // Set initial form values if editing
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        campaignName: initialData.campaignName,
        subjectLine: initialData.subjectLine,
        emailContent: initialData.emailContent,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: CampaignFormValues) => {
    const { campaignName, subjectLine, emailContent } = values;
    setLoading(true);
    try {
      if (initialData?.id) {
        // Update existing campaign
        await axios.put(`${API_URL}/campaign/${initialData.id}`, {
          campaignName,
          subjectLine,
          emailContent,
        });
        message.success('Campaign updated successfully! 🎉');
      } else {
        // Create new campaign
        await axios.post(`${API_URL}/campaign`, {
          campaignName,
          subjectLine,
          emailContent,
        });
        message.success('Campaign created successfully! 🎉');
      }
      form.resetFields();
      if (onCancel) onCancel();
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Error ${initialData ? 'updating' : 'creating'} campaign: ${axiosError.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          style={{ backgroundColor: 'white', borderRadius: '8px' }}
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
        <Space>
          {onCancel && (
            <Button
              onClick={onCancel}
              style={{ borderRadius: '8px' }}
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
            {initialData ? 'Update Campaign 🎉' : 'Save Campaign 🎉'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CampaignForm;