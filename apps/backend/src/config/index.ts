/**
 * Configuration module.
 * Loads environment variables and exports app config.
 */

import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3333', 10),
};