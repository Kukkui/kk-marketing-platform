import React, { useState } from "react";
import { Input, Button, Typography, Form, message, Card } from "antd";

const { Title } = Typography;

const CreateAudienceMember: React.FC = () => {
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (body: {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const { name, firstName, lastName, email } = body;
    console.log({
        name,
        firstName,
        lastName,
        email,
    });

    if (!name || !email) {
      message.warning("Please fill in all required fields (Name and Email).");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.warning("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // MOCK API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Audience member created successfully!");

      form.setFieldsValue({
        name: "",
        firstName: "",
        lastName: "",
        email: "",
      });
      
    } catch (error) {
      console.error(error);
      message.error("Error creating audience member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ height: '100vh', overflow: 'auto'}} variant='outlined'>
      <div className="p-6 max-w-3xl mx-auto space-y-6 bg-white shadow rounded-md">
        <Title level={3}>Create New Audience Member</Title>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            label="Name" 
            name = "name"
            rules={[{ required: true, message: "Please input your name!" }]}
            >
            <Input
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item 
            label="First Name"
            name = "firstName"
            >
            <Input
              placeholder="e.g. John"
            />
          </Form.Item>

          <Form.Item 
            label="Last Name"
            name = "lastName"
            >
            <Input
              placeholder="e.g. Doe"
            />
          </Form.Item>

          <Form.Item 
            label="Email" 
            name="email"
            rules = {[
                {required: true, message: 'Please input your email!'},
                {type: 'email',message: 'The input is not valid E-mail!'}
            ]}
            >
            <Input placeholder="e.g. john.doe@example.com" />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Audience Member
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default CreateAudienceMember;