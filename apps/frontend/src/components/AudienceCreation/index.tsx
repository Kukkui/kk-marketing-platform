/**
 * Component to create a new audience member.
 * Interacts with the backend API to save the audience member to the database.
 */

import { useState } from 'react';
import { Input, Button, Typography, Form, message, Card } from 'antd';
import axios from 'axios';

const { Title } = Typography;

// Base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateAudienceMember() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const { name, firstName, lastName, email } = values;
    console.log({ name, firstName, lastName, email });

    setLoading(true);
    try {
      // Make API call to the backend
      const response = await axios.post(`${API_URL}/audience`, {
        name,
        firstName,
        lastName,
        email,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is successful
      if (response.status === 201) {
        message.success('Audience member created successfully! 🎉');
        form.resetFields();
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error: any) {
      console.error('Error creating audience member:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        message.error(
          error.response.data.message || 'Error creating audience member.'
        );
      } else if (error.request) {
        // No response received
        message.error('Network error: Unable to reach the server.');
      } else {
        // Other errors
        message.error('Error creating audience member.');
      }
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
          Create New Audience Member 🚀
        </Title>

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
              Save Audience Member 🎉
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}