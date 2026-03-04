import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';

import { errorHandler } from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Seed Admin User logic removed for Supabase JS migration
// It will be handled directly in the database or a separate script.

// API Routes
app.use('/api', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/expenses', authenticateToken, expenseRoutes);
app.use('/api', authenticateToken, budgetRoutes);
app.use('/api', authenticateToken, settingRoutes);
app.use('/api/activity-logs', authenticateToken, activityLogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

export default app;
