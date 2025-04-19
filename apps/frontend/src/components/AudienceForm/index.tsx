import { useState, useEffect } from 'react';
import { Input, Button, Form, message, Space } from 'antd';
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AudienceFormValues {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AudienceFormProps {
  initialData?: {
    id?: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  onCancel?: () => void;
}

const AudienceForm: React.FC<AudienceFormProps> = ({ initialData, onCancel }) => {
  const [form] = Form.useForm<AudienceFormValues>();
  const [loading, setLoading] = useState(false);

  // Set initial form values if editing
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: AudienceFormValues) => {
    const { name, firstName, lastName, email } = values;
    setLoading(true);
    try {
      if (initialData?.id) {
        // Update existing audience member
        await axios.put(`${API_URL}/audience/${initialData.id}`, {
          name,
          firstName,
          lastName,
          email,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        message.success('Audience member updated successfully! 🎉');
      } else {
        // Create new audience member
        await axios.post(`${API_URL}/audience`, {
          name,
          firstName,
          lastName,
          email,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        message.success('Audience member created successfully! 🎉');
      }
      form.resetFields();
      if (onCancel) onCancel();
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Error ${initialData ? 'updating' : 'creating'} audience member: ${axiosError.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ name: '', firstName: '', lastName: '', email: '' }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input the name!' }]}
      >
        <Input
          placeholder="e.g. John Doe"
          style={{ borderRadius: '8px' }}
          className="hover:border-blue-400 transition-all duration-300"
        />
      </Form.Item>

      <Form.Item label="First Name" name="firstName">
        <Input
          placeholder="e.g. John"
          style={{ borderRadius: '8px' }}
          className="hover:border-blue-400 transition-all duration-300"
        />
      </Form.Item>

      <Form.Item label="Last Name" name="lastName">
        <Input
          placeholder="e.g. Doe"
          style={{ borderRadius: '8px' }}
          className="hover:border-blue-400 transition-all duration-300"
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input the email!' },
          { type: 'email', message: 'Please enter a valid email address!' },
        ]}
      >
        <Input
          placeholder="e.g. john.doe@example.com"
          style={{ borderRadius: '8px' }}
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
            {initialData ? 'Update Audience Member 🎉' : 'Save Audience Member 🎉'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AudienceForm;