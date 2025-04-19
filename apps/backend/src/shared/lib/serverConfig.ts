/**
 * Server configuration utilities.
 * Handles server initialization and startup.
 */

import { Express } from 'express';
import { config } from '../../config';

/**
 * Starts the Express server.
 * @param app - Express application instance.
 */
export function startServer(app: Express) {
  const server = app.listen(config.port, () => {
    console.log(`Listening at http://localhost:${config.port}/api`);
  });
  server.on('error', console.error);
}