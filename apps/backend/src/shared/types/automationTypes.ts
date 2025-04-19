import { Dayjs } from 'dayjs';

export interface Audience {
  id: number;
  email: string;
}

export interface AutomationPayload {
  name: string;
  schedule: Dayjs | null;
  campaign: number; // Changed to number (was likely a UUID)
  audienceIds: number[]; // Changed to array of numbers (previously used a junction table)
  status: string; // Optional status field
}

export interface AutomationDb {
  id: string; // UUID in the database
  name: string;
  schedule: string | null; // Stored as ISO string in DB
  campaign_id: number;
  audience_ids: number[];
  created_at: string;
  status: string; // Optional status field
}

export interface Automation {
  id: string;
  name: string;
  schedule: Dayjs | null;
  campaign: number;
  audiences: Audience[] | number[]; // Changed to array of Audience objects
  status: string; // Optional status field
}

export interface AutomationResponse {
  data: Automation | Automation[] | undefined;
  message?: string;
}