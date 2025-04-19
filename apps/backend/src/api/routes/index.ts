/**
 * Combines all API routes.
 */

import { Express } from 'express';
import { setupAudienceRoutes } from './audienceRoutes';
import { setupCampaignRoutes } from './campaignRoutes';
import { setupAutomationRoutes } from './automationRoutes';

/**
 * Sets up all API routes.
 * @param app - Express application instance.
 */
export function setupRoutes(app: Express) {
  setupAudienceRoutes(app);
  setupCampaignRoutes(app);
  setupAutomationRoutes(app);
}