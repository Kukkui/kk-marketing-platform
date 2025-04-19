/**
 * Route definitions for Audience feature.
 */

import { Express } from 'express';
import {
  createAudienceHandler,
  getAllAudiencesHandler,
  getAudienceByIdHandler,
  updateAudienceHandler,
  deleteAudienceHandler,
} from '../controllers/audienceController';

/**
 * Configures Audience routes.
 * @param app - Express application instance.
 */
export function setupAudienceRoutes(app: Express) {
  app.post('/api/audience', createAudienceHandler);
  app.get('/api/audience', getAllAudiencesHandler);
  app.get('/api/audience/:id', getAudienceByIdHandler);
  app.put('/api/audience/:id', updateAudienceHandler);
  app.delete('/api/audience/:id', deleteAudienceHandler);
}