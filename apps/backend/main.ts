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


// NEW
/**
 * Entry point for the Express application.
 * Initializes the app, applies middleware, sets up routes, and starts the server.
 */
/**
 * Entry point for the Express application.
 * Initializes the app, applies middleware, sets up routes, and starts the server.
 */

import express from 'express';
import * as path from 'path';
import morgan from 'morgan';
import { setupRoutes } from './src/api/routes';
import { errorHandler } from './src/api/middleware/errorHandler';
import { startServer } from './src/shared/lib/serverConfig';

const app = express();

// Middleware
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // Serve static files

// Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
startServer(app);