import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Seed Admin User ---
// Logic removed for Supabase JS migration


import { authenticateToken } from './middleware/authMiddleware.js';

// --- API Routes ---
app.use('/api', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/expenses', authenticateToken, expenseRoutes);
app.use('/api', authenticateToken, budgetRoutes); // Check if budgetRoutes handles multiple paths
app.use('/api', authenticateToken, settingRoutes);
app.use('/api/activity-logs', authenticateToken, activityLogRoutes);

// --- Static Files (Production) ---
const getDirname = () => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (e) {
    return __dirname;
  }
};
const currentDir = getDirname();
const distPath = path.join(currentDir, '../dist');

if (fs.existsSync(distPath)) {
  console.log('Serving static files from', distPath);
  app.use(express.static(distPath));

  // Catch-all for SPA
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
}

// Global Error Handler
app.use(errorHandler);

// Start server
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
