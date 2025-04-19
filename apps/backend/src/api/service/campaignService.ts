/**
 * Service layer for Campaign feature.
 * Handles business logic for Campaign CRUD operations.
 */

import { v4 as uuidv4 } from 'uuid';
import { Campaign, CampaignPayload } from '../../shared/types/campaignTypes';

// In-memory storage (replace with a database in production)
const campaigns: Campaign[] = [];

/**
 * Creates a new campaign.
 * @param payload - The campaign data to create.
 * @returns The created campaign.
 */
export function createCampaign(payload: CampaignPayload): Campaign {
  const campaign: Campaign = {
    id: uuidv4(),
    title: payload.title,
    schedule: payload.schedule,
  };
  campaigns.push(campaign);
  return campaign;
}

/**
 * Retrieves all campaigns.
 * @returns List of all campaigns.
 */
export function getAllCampaigns(): Campaign[] {
  return campaigns;
}

/**
 * Retrieves a campaign by ID.
 * @param id - The campaign ID.
 * @returns The campaign if found, or undefined.
 */
export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(campaign => campaign.id === id);
}

/**
 * Updates a campaign by ID.
 * @param id - The campaign ID.
 * @param payload - The updated campaign data.
 * @returns The updated campaign, or undefined if not found.
 */
export function updateCampaign(id: string, payload: CampaignPayload): Campaign | undefined {
  const index = campaigns.findIndex(campaign => campaign.id === id);
  if (index === -1) return undefined;

  const updatedCampaign = { ...campaigns[index], ...payload };
  campaigns[index] = updatedCampaign;
  return updatedCampaign;
}

/**
 * Deletes a campaign by ID.
 * @param id - The campaign ID.
 * @returns True if deleted, false if not found.
 */
export function deleteCampaign(id: string): boolean {
  const index = campaigns.findIndex(campaign => campaign.id === id);
  if (index === -1) return false;

  campaigns.splice(index, 1);
  return true;
}