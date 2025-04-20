import { z } from 'zod';

// Schema for creating and updating an automation
export const AutomationPayloadSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  schedule: z.string().datetime({ message: 'Invalid datetime format' }).nullable(),
  campaign: z.number().int().positive({ message: 'Campaign ID must be a positive integer' }),
  audienceIds: z.array(z.number().int().positive({ message: 'Audience IDs must be positive integers' })).min(1, { message: 'At least one audience ID is required' }),
  status: z.enum(['Running', 'Paused', 'Completed'], { message: 'Status must be Running, Paused, or Completed' }),
});

// TypeScript type derived from Zod schema
export type AutomationPayload = z.infer<typeof AutomationPayloadSchema>;