/**
 * Controller for API endpoints.
 * Handles request/response logic and delegates to services.
 */

import { Request, Response } from 'express';
import { getMessage } from '../service/apiService';
import { ApiResponse } from '../../shared/types/apiTypes';

/**
 * Handles GET /api request.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export function getWelcomeMessage(req: Request, res: Response) {
  const message = getMessage();
  const response: ApiResponse = { message };
  res.status(200).send(response);
}