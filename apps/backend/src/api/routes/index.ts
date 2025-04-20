/**
 * Combines all API routes.
 */

import { Express } from 'express';
import { setupAudienceRoutes } from './audienceRoutes';
import { setupCampaignRoutes } from './campaignRoutes';
import { setupAutomationRoutes } from './automationRoutes';
import { setupAccountRoutes } from './accountRoutes';
import { setupSimpleRoutes } from './apiRoutes';

/**
 * Sets up all API routes.
 * @param app - Express application instance.
 */
export function setupRoutes(app: Express) {
  setupAccountRoutes(app);
  setupAudienceRoutes(app);
  setupCampaignRoutes(app);
  setupAutomationRoutes(app);
  setupSimpleRoutes(app);
}