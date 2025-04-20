import { z } from 'zod';

// Schema for creating and updating a campaign
export const CampaignPayloadSchema = z.object({
  campaignName: z.string().min(1, { message: 'Campaign name is required' }),
  subjectLine: z.string().min(1, { message: 'Subject line is required' }),
  emailContent: z.string().min(1, { message: 'Email content is required' }),
});

// TypeScript type derived from Zod schema
export type CampaignPayload = z.infer<typeof CampaignPayloadSchema>;