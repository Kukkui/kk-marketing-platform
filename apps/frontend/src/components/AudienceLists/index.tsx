/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Card, Input, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios, { AxiosError } from 'axios';
import AudienceForm from '../AudienceForm';

const { Title } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Audience {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function AudienceEmailListsPage() {
  const [data, setData] = useState<Audience[]>([]);
  const [filteredData, setFilteredData] = useState<Audience[]>([]);
  const [, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);

  // Fetch all audiences from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Record<string, Audience[]>>(`${API_URL}/audience`);
        const formattedData = response.data.data.map((item) => ({
          id: item.id.toString(),
          name: item.name,
          first_name: item.first_name,
          last_name: item.last_name,
          email: item.email,
        }));
        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error fetching audience data:', axiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/audience/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      setFilteredData((prev) => prev.filter((item) => item.id !== id));
      message.success('Audience member deleted successfully! 🎉');
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to delete audience: ${axiosError.message}`);
    }
  };

  const handleEdit = (record: Audience): void => {
    setSelectedAudience(record);
    setEditModalVisible(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.first_name.toLowerCase().includes(value) ||
        item.last_name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      width: 150,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: unknown, record: Audience) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{
              borderRadius: '6px',
              background: '#60a5fa',
              color: 'white',
              border: 'none',
            }}
            className="hover:scale-105 transition-all duration-300"
          />
          <Popconfirm
            title="Are you sure to delete this audience member?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: '6px' }}
              className="hover:scale-105 transition-all duration-300"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        minHeight: '100vh',
        overflow: 'auto',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid #bae6fd',
      }}
    >
      <div className="p-8 max-w-4xl mx-auto space-y-6 bg-white shadow-xl rounded-lg">
        <Title
          level={3}
          style={{
            color: '#1e40af',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Audience Members 🚀
        </Title>
        <Input
          placeholder="Search audience members..."
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{
            marginBottom: '16px',
            borderRadius: '8px',
          }}
          className="hover:border-blue-400 transition-all duration-300"
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            pageSize: 5,
            position: ['bottomRight'],
          }}
          scroll={{ x: true }}
          rowClassName="hover:bg-blue-50 transition-all duration-300"
          style={{ borderRadius: '8px', overflow: 'hidden' }}
        />
        <Modal
          title={
            <span style={{ color: '#1e40af', fontWeight: 'bold' }}>
              Edit Audience Member 🚀
            </span>
          }
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setSelectedAudience(null);
          }}
          footer={null}
          style={{ top: 20 }}
          width={600}
        >
          {selectedAudience && (
            <AudienceForm
              initialData={{
                id: selectedAudience.id,
                name: selectedAudience.name,
                firstName: selectedAudience.first_name,
                lastName: selectedAudience.last_name,
                email: selectedAudience.email,
              }}
              onCancel={async () => {
                // Refresh data after edit
                const response = await axios.get<Record<string, Audience[]>>(`${API_URL}/audience`);
                const formattedData = response.data.data.map((item) => ({
                  id: item.id.toString(),
                  name: item.name,
                  first_name: item.first_name,
                  last_name: item.last_name,
                  email: item.email,
                }));
                setData(formattedData);
                setFilteredData(formattedData);
                setEditModalVisible(false);
                setSelectedAudience(null);
              }}
            />
          )}
        </Modal>
      </div>
    </Card>
  );
}