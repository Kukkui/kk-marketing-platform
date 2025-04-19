/**
 * TypeScript types for Automation feature.
 */

import { Dayjs } from 'dayjs';

/**
 * Structure of an Automation.
 */
export interface Automation {
  id: number;
  name: string;
  schedule: Dayjs | null;
  campaign: number | null;
  audiences: { id: number; email: string }[];
}

/**
 * Structure of the Automation response.
 */
export interface AutomationResponse {
  data: Automation | Automation[];
  message?: string;
}

/**
 * Structure of the Automation creation/update payload.
 */
export interface AutomationPayload {
  name: string;
  schedule: Dayjs | null;
  campaign: number | null;
  audiences: { id: number; email: string }[];
}

/**
 * Structure of the Automation as stored in the database.
 * Used internally for database operations.
 */
export interface AutomationDb {
  id: number;
  name: string;
  schedule: string | null; // ISO 8601 string
  campaign_id: number | null;
}