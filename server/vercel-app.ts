import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';
import { errorHandler } from './middleware/errorHandler';

// Import Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import expenseRoutes from './routes/expenseRoutes';
import budgetRoutes from './routes/budgetRoutes';
import settingRoutes from './routes/settingRoutes';
import activityLogRoutes from './routes/activityLogRoutes';
import { authenticateToken } from './middleware/authMiddleware';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Seed Admin User (only run once)
const seedAdmin = async () => {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          name: 'Admin User',
          email: 'admin@dcc-motor.com',
          role: 'admin',
          position: 'System Administrator',
          department: 'IT',
          employeeId: 'EMP-001',
          bio: 'Default System Administrator',
          theme: 'light',
          language: 'th'
        }
      });
      console.log("Default admin created");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

// Only seed in development or first deployment
if (process.env.NODE_ENV !== 'production' || process.env.SEED_ADMIN === 'true') {
  seedAdmin();
}

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
