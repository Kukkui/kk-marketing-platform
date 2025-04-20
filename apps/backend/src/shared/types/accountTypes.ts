/**
 * Type definitions for Account feature.
 */

export interface Account {
    id: number;
    email: string;
    password: string; // Hashed password
    created_at: string;
    updated_at: string;
  }
  
  export interface AccountPayload {
    email: string;
    password: string; // Plaintext password (will be hashed)
  }
  
  export interface AccountResponse {
    data?: Account | Account[];
    message?: string;
  }

  export interface LoginResponse {
    status: 'success' | 'failed';
    message?: string;
  }