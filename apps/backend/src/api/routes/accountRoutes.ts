/**
 * Route definitions for Account feature.
 */

import { Express } from 'express';
import {
  createAccountHandler,
  getAllAccountsHandler,
  getAccountByIdHandler,
  updateAccountHandler,
  deleteAccountHandler,
  loginHandler,
} from '../controllers/accountController';

/**
 * Configures Account routes.
 * @param app - Express application instance.
 */
export function setupAccountRoutes(app: Express) {
  app.post('/api/account', createAccountHandler);
  app.post('/api/account/login', loginHandler);
  app.get('/api/account', getAllAccountsHandler);
  app.get('/api/account/:id', getAccountByIdHandler);
  app.put('/api/account/:id', updateAccountHandler);
  app.delete('/api/account/:id', deleteAccountHandler);
}