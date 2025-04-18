import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input, Button, Typography, Form, message, Card } from "antd";

const { Title } = Typography;

function CreateCampaign() {
  const [campaignName, setCampaignName] = useState("");
  const [subjectLine, setSubjectLine] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!campaignName || !subjectLine || !emailContent) {
      message.warning("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
        // API call
        //   const res = await fetch("/api/campaigns", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ campaignName, subjectLine, emailContent }),
        //   });
        //   const data = await res.json();

        //   if (res.ok) {
        //     message.success("Campaign created successfully!");
        //     setCampaignName("");
        //     setSubjectLine("");
        //     setEmailContent("");
        //   } else {
        //     message.error(data.message || "Something went wrong.");
        //   }

        // MOCK
        await new Promise((resolve) => setTimeout(resolve, 1000));
        message.success("Campaign created successfully!");
        setCampaignName("");
        setSubjectLine("");
        setEmailContent("");
    } catch (error) {
      console.error(error);
      message.error("Error creating campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ height: '100vh', overflow: 'auto'}} variant='outlined'>
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-white shadow rounded-md">
      <Title level={3}>Create New Campaign</Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Campaign Name" required>
          <Input
            placeholder="e.g. Summer Deals 2025"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Subject Line" required>
          <Input
            placeholder="e.g. Hot Summer Discounts Inside 🔥"
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Email Content" required>
          <ReactQuill 
          value={emailContent}
          onChange={setEmailContent}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }], // Header levels
              ['bold', 'italic', 'underline', 'strike'], // Text formatting
              [{ list: 'ordered' }, { list: 'bullet' }], // Lists
              [{ script: 'sub' }, { script: 'super' }], // Subscript/Superscript
              [{ indent: '-1' }, { indent: '+1' }], // Indentation
              [{ align: [] }], // Text alignment
              ['link', 'image', 'video'], // Media
              ['clean'], // Remove formatting
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
          />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Campaign
          </Button>
        </Form.Item>
      </Form>
    </div>
    </Card>
  );
}

export default CreateCampaign;
