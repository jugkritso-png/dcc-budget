import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// --- Seed Admin User ---
const seedAdmin = async () => {
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
    console.log("Default admin created: username='admin', password='password123'");
  }
};
seedAdmin();

// --- API Routes ---
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api', budgetRoutes);
app.use('/api', settingRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// --- Static Files (Production) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
