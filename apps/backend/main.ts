// /**
//  * This is not a production server yet!
//  * This is only a minimal backend to get started.
//  */

// import express from 'express';
// import * as path from 'path';

// const app = express();

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to backend!' });
// });

// const port = process.env.PORT || 3333;
// const server = app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);


// NEWER

import express from 'express';
import * as path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import { setupRoutes } from './src/api/routes';
import { errorHandler } from './src/api/middleware/errorHandler';
import { startServer } from './src/shared/lib/serverConfig';
import { startAutomationCron } from './src/api/service/automationService';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // Serve static files

// Cron jobs
startAutomationCron();

// Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
startServer(app);