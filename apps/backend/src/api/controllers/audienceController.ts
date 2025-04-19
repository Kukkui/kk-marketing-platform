/**
 * Controller for Audience endpoints.
 * Handles request/response logic and delegates to services.
 */

import { Request, Response } from 'express';
import { createAudience, getAllAudiences, getAudienceById, updateAudience, deleteAudience } from '../service/audienceService';
import { AudiencePayload, AudienceResponse } from '../../shared/types/audienceTypes';

/**
 * Creates a new audience.
 */
export async function createAudienceHandler(req: Request, res: Response) {
  const payload: AudiencePayload = req.body;
  const audience = await createAudience(payload);
  const response: AudienceResponse = { data: audience, message: 'Audience created successfully' };
  res.status(201).json(response);
}

/**
 * Retrieves all audiences.
 */
export async function getAllAudiencesHandler(req: Request, res: Response) {
  const audiences = await getAllAudiences();
  const response: AudienceResponse = { data: audiences };
  res.status(200).json(response);
}

/**
 * Retrieves an audience by ID.
 */
export async function getAudienceByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  const audience = await getAudienceById(Number(id));
  if (!audience) {
    return res.status(404).json({ message: 'Audience not found' });
  }
  const response: AudienceResponse = { data: audience };
  
  return res.status(200).json(response);
}

/**
 * Updates an audience by ID.
 */
export async function updateAudienceHandler(req: Request, res: Response) {
  const { id } = req.params;
  const payload: AudiencePayload = req.body;
  const updatedAudience = await updateAudience(Number(id), payload);
  if (!updatedAudience) {
    return res.status(404).json({ message: 'Audience not found' });
  }
  const response: AudienceResponse = { data: updatedAudience, message: 'Audience updated successfully' };
  
  return res.status(200).json(response);
}

/**
 * Deletes an audience by ID.
 */
export function deleteAudienceHandler(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = deleteAudience(Number(id));
  if (!deleted) {
    return res.status(404).json({ message: 'Audience not found' });
  }

  return res.status(204).send();
}