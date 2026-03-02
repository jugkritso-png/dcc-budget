// Load environment variables first
import 'dotenv/config';

// Vercel Serverless Function wrapper for Express
import app from '../server/vercel-app.js';

export default app;
