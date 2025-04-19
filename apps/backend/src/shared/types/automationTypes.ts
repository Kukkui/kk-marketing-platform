/**
 * TypeScript types for Automation feature.
 */

/**
 * Structure of an Automation.
 */
export interface Automation {
    id: string;
    name: string;
    schedule: string; // ISO 8601 date string (e.g., "2025-04-20T10:00:00Z")
    campaignId: string;
    audienceId: string;
    status: 'Running' | 'Completed' | 'Paused';
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
    schedule: string;
    campaignId: string;
    audienceId: string;
    status: 'Running' | 'Completed' | 'Paused';
  }