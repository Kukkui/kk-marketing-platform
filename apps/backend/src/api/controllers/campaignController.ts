/**
 * Controller for Campaign endpoints.
 * Handles request/response logic and delegates to services.
 */

import { Request, Response } from 'express';
import { createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign } from '../service/campaignService';
import { CampaignPayload, CampaignResponse } from '../../shared/types/campaignTypes';

/**
 * Creates a new campaign.
 */
export function createCampaignHandler(req: Request, res: Response) {
  const payload: CampaignPayload = req.body;
  const campaign = createCampaign(payload);
  const response: CampaignResponse = { data: campaign, message: 'Campaign created successfully' };
  res.status(201).json(response);
}

/**
 * Retrieves all campaigns.
 */
export function getAllCampaignsHandler(req: Request, res: Response) {
  const campaigns = getAllCampaigns();
  const response: CampaignResponse = { data: campaigns };
  res.status(200).json(response);
}

/**
 * Retrieves a campaign by ID.
 */
export function getCampaignByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  const campaign = getCampaignById(id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  const response: CampaignResponse = { data: campaign };
  res.status(200).json(response);
}

/**
 * Updates a campaign by ID.
 */
export function updateCampaignHandler(req: Request, res: Response) {
  const { id } = req.params;
  const payload: CampaignPayload = req.body;
  const updatedCampaign = updateCampaign(id, payload);
  if (!updatedCampaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  const response: CampaignResponse = { data: updatedCampaign, message: 'Campaign updated successfully' };
  res.status(200).json(response);
}

/**
 * Deletes a campaign by ID.
 */
export function deleteCampaignHandler(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = deleteCampaign(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  res.status(204).send();
}