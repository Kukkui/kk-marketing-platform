import { Card, Typography } from 'antd';
import { Dayjs } from 'dayjs';
import AutomationForm from '../AutomationForm';

const { Title } = Typography;
export interface AutomationFormValues {
  name: string;
  schedule: Dayjs | null;
  campaign: number | null;
  audiences: number[];
  status: string;
}

interface AutomationFormProps {
  initialData?: {
    id?: string;
    name: string;
    schedule: string;
    campaign: number;
    audiences: number[];
    status: string;
  };
  onSubmit?: (values: AutomationFormValues & { id?: string }) => Promise<void>;
  onCancel?: () => void;
}

const AutomationCreation: React.FC<AutomationFormProps> = () => {
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
        <AutomationForm />
    </div>
    </Card>
  );
};

export default AutomationCreation;