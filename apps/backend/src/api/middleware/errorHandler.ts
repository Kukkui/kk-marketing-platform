/**
 * Error handling middleware.
 * Catches and processes errors, sending appropriate responses.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler.
 * @param err - Error object.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
}