/**
 * TypeScript types for Audience feature.
 */

/**
 * Structure of an Audience.
 */
export interface Audience {
    id: string;
    name: string;
    subscriberCount: number;
  }
  
  /**
   * Structure of the Audience response.
   */
  export interface AudienceResponse {
    data: Audience | Audience[];
    message?: string;
  }
  
  /**
   * Structure of the Audience creation/update payload.
   */
  export interface AudiencePayload {
    name: string;
    subscriberCount: number;
  }