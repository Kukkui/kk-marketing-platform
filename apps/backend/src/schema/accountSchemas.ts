import { z } from 'zod';

// Schema for creating and updating an account
export const AccountPayloadSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

// Schema for login
export const LoginPayloadSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

// TypeScript types derived from Zod schemas
export type AccountPayload = z.infer<typeof AccountPayloadSchema>;
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;