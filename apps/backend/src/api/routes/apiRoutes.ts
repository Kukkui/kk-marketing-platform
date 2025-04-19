/**
 * API route definitions.
 * Sets up endpoints for the Express app.
 */

import { Express } from 'express';
import { getWelcomeMessage } from '../controllers/apiController';

/**
 * Configures API routes.
 * @param app - Express application instance.
 */
export function setupRoutes(app: Express) {
  app.get('/api', getWelcomeMessage);
}