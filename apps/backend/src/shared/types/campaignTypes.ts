/**
 * TypeScript types for Campaign feature.
 */

/**
 * Structure of a Campaign.
 */
export interface Campaign {
    id: number;
    campaignName: string;
    subjectLine: string;
    emailContent: string;
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
    campaignName: string;
    subjectLine: string;
    emailContent: string;
  }