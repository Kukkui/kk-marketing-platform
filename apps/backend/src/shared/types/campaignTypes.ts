/**
 * TypeScript types for Campaign feature.
 */

/**
 * Structure of a Campaign.
 */
export interface Campaign {
    id: string;
    title: string;
    schedule: string; // ISO 8601 date string
  }
  
  /**
   * Structure of the Campaign response.
   */
  export interface CampaignResponse {
    data: Campaign | Campaign[];
    message?: string;
  }
  
  /**
   * Structure of the Campaign creation/update payload.
   */
  export interface CampaignPayload {
    title: string;
    schedule: string;
  }