'use client';

import { useState } from 'react';
import { Button, Form, Input, Typography, Card, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const { email, password } = values;
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      if (email === 'test@gmail.com' && password === '123') {
        message.success('Login successful!');
        router.push('/home');
      } else {
        message.error('Invalid email or password.');

        form.setFields([
          {
            name: 'password',
            value: '',
          },
        ]);
      }
    } catch (error: unknown) {
      message.error('Login failed.');

      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} variant='outlined'>
        <div style={styles.logo}>
          <Image src="/icon/test.png" alt="Logo" width={80} height={80} />
        </div>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          LOGIN
        </Title>
        {/* NOTED: THIS WRAP WILL DIM THE CONTENT INSIDE Spin IF TRUE */}
        <Spin spinning={loading}>
          <Form form={form} name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name = "email"
              rules = {[{required: true, message: 'Please input your email!'},{type: 'email',message: 'The input is not valid E-mail!'}]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name = "password"
              rules = {[{required: true, message: 'Please enter password!'}]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                type="password"
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block>
              Log In
            </Button>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 16,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
};