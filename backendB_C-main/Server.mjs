// server.mjs
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';



dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Routes
import authRoutes from './src/routes/Authroutes.mjs';
import invoicesRoutes from './src/routes/Invoices.mjs';
import dbRoutes from './src/routes/Queries.mjs';

const port =  8000;

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/queries', dbRoutes);

// if (!process.env.PORT) {
//   console.error('Error: PORT not defined in the .env file.');
//   process.exit(1);
// }

const server = app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting the server: ${err}`);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close the server gracefully on unhandled rejections
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Close the server gracefully on uncaught exceptions
  server.close(() => {
    process.exit(1);
  });
});