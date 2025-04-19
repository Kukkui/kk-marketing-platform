/**
 * Route definitions for Campaign feature.
 */

import { Express } from 'express';
import {
  createCampaignHandler,
  getAllCampaignsHandler,
  getCampaignByIdHandler,
  updateCampaignHandler,
  deleteCampaignHandler,
} from '../controllers/campaignController';

/**
 * Configures Campaign routes.
 * @param app - Express application instance.
 */
export function setupCampaignRoutes(app: Express) {
  app.post('/api/campaign', createCampaignHandler);
  app.get('/api/campaign', getAllCampaignsHandler);
  app.get('/api/campaign/:id', getCampaignByIdHandler);
  app.put('/api/campaign/:id', updateCampaignHandler);
  app.delete('/api/campaign/:id', deleteCampaignHandler);
}