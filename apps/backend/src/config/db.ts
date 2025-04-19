// /**
//  * Database configuration for PostgreSQL using postgres.js.
//  */

// import postgres from 'postgres';
// import * as dotenv from 'dotenv';

// dotenv.config();

// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error('DATABASE_URL environment variable is not set');
// }

// const sql = postgres("postgresql://postgres.pqwnjwdhogjnpygxhhth:kukkui_2537@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres");

// // Test the connection on startup
// sql`SELECT 1`
//   .then(() => console.log('Successfully connected to the Supabase database'))
//   .catch((err: Error) => {
//     console.error('Failed to connect to the database:', err.message);
//     process.exit(1);
//   });

// export default sql;

/**
 * Database configuration for PostgreSQL using the pg library.
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  } else {
    console.log('Successfully connected to the Supabase database');
  }
});

export default pool;