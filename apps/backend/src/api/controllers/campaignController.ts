/**
 * Controller for Campaign endpoints.
 * Handles request/response logic and delegates to services.
 */

import { Request, Response } from 'express';
import { createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign } from '../service/campaignService';
import { CampaignPayloadSchema } from '../../schema/campaignSchemas';
import { CampaignResponse } from '../../shared/types/campaignTypes';
import { z } from 'zod';

/**
 * Creates a new campaign.
 */
export async function createCampaignHandler(req: Request, res: Response) {
  try {
    const payload = CampaignPayloadSchema.parse(req.body);
    const campaign = await createCampaign(payload);
    const response: CampaignResponse = { data: campaign, message: 'Campaign created successfully' };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Retrieves all campaigns.
 */
export async function getAllCampaignsHandler(req: Request, res: Response) {
  const campaigns = await getAllCampaigns();
  const response: CampaignResponse = { data: campaigns };
  res.status(200).json(response);
}

/**
 * Retrieves a campaign by ID.
 */
export async function getCampaignByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  const campaign = await getCampaignById(Number(id));
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  const response: CampaignResponse = { data: campaign };
  return res.status(200).json(response);
}

/**
 * Updates a campaign by ID.
 */
export async function updateCampaignHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const payload = CampaignPayloadSchema.parse(req.body);
    const updatedCampaign = await updateCampaign(Number(id), payload);
    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    const response: CampaignResponse = { data: updatedCampaign, message: 'Campaign updated successfully' };
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Deletes a campaign by ID.
 */
export async function deleteCampaignHandler(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = await deleteCampaign(Number(id));
  if (!deleted) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  return res.status(204).send();
}