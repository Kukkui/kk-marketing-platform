import { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Typography, message, Spin } from 'antd';
import {
  RobotOutlined,
  UserOutlined,
  MailOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import axios, { AxiosError } from 'axios';

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
  status: 'Running' | 'Completed' | 'Paused';
}

interface DashboardStats {
  totalCampaigns: number;
  totalAudiences: number;
  totalAutomations: number;
  runningAutomations: number;
  pausedAutomations: number;
  completedAutomations: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    totalAudiences: 0,
    totalAutomations: 0,
    runningAutomations: 0,
    pausedAutomations: 0,
    completedAutomations: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all data on component mount
  const fetchData = async () => {
    setLoading(true);
    try {
      const [automationResponse, campaignResponse, audienceResponse] = await Promise.all([
        axios.get<{ data: Automation[] }>(`${API_URL}/automation`),
        axios.get<Record<string, Campaign[]>>(`${API_URL}/campaign`),
        axios.get<Record<string, Audience[]>>(`${API_URL}/audience`),
      ]);

      const automations = automationResponse.data.data;
      const campaigns = campaignResponse.data.data;
      const audiences = audienceResponse.data.data;

      // Calculate stats
      const newStats: DashboardStats = {
        totalCampaigns: campaigns.length,
        totalAudiences: audiences.length,
        totalAutomations: automations.length,
        runningAutomations: automations.filter((a) => a.status === 'Running').length,
        pausedAutomations: automations.filter((a) => a.status === 'Paused').length,
        completedAutomations: automations.filter((a) => a.status === 'Completed').length,
      };

      setStats(newStats);
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to fetch dashboard data: ${axiosError.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          Dashboard 📊🚀
        </Title>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: '8px', textAlign: 'center' }}
                className="shadow-md"
              >
                <Statistic
                  title="Total Campaigns"
                  value={stats.totalCampaigns}
                  prefix={<MailOutlined />}
                  valueStyle={{ color: '#1e40af' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: '8px', textAlign: 'center' }}
                className="shadow-md"
              >
                <Statistic
                  title="Total Audiences"
                  value={stats.totalAudiences}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1e40af' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: '8px', textAlign: 'center' }}
                className="shadow-md"
              >
                <Statistic
                  title="Total Automations"
                  value={stats.totalAutomations}
                  prefix={<RobotOutlined />}
                  valueStyle={{ color: '#1e40af' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: '8px', textAlign: 'center' }}
                className="shadow-md"
              >
                <Statistic
                  title="Running Automations"
                  value={stats.runningAutomations}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: '8px', textAlign: 'center' }}
                className="shadow-md"
              >
                <Statistic
                  title="Paused Automations"
                  value={stats.pausedAutomations}
                  prefix={<PauseCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ borderRadius: '8px', textAlign: 'center' }}
                className="shadow-md"
              >
                <Statistic
                  title="Completed Automations"
                  value={stats.completedAutomations}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </Card>
  );
};

export default DashboardPage;