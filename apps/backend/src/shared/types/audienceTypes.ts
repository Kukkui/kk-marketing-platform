/**
 * TypeScript types for Audience feature.
 */

/**
 * Structure of an Audience.
 */
export interface Audience {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
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
    firstName: string;
    lastName: string;
    email: string;
  }