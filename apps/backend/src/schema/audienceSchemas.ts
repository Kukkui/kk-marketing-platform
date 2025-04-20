import { z } from 'zod';

// Schema for creating and updating an audience
export const AudiencePayloadSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

// TypeScript type derived from Zod schema
export type AudiencePayload = z.infer<typeof AudiencePayloadSchema>;