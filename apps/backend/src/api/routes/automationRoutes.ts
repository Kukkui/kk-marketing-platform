/**
 * Route definitions for Automation feature.
 */

import { Express } from 'express';
import {
  createAutomationHandler,
  getAllAutomationsHandler,
  getAutomationByIdHandler,
  updateAutomationHandler,
  deleteAutomationHandler,
} from '../controllers/automationController';

/**
 * Configures Automation routes.
 * @param app - Express application instance.
 */
export function setupAutomationRoutes(app: Express) {
  app.post('/api/automation', createAutomationHandler);
  app.get('/api/automation', getAllAutomationsHandler);
  app.get('/api/automation/:id', getAutomationByIdHandler);
  app.put('/api/automation/:id', updateAutomationHandler);
  app.delete('/api/automation/:id', deleteAutomationHandler);
}