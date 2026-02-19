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
import { authenticateToken } from './middleware/authMiddleware';
import mcpRoutes from './routes/mcpRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Seed Admin User ---
const seedAdmin = async () => {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
        console.log("Seeding default admin user...");
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@dcc-motor.com';

        if (!process.env.ADMIN_PASSWORD) {
            console.warn("WARNING: ADMIN_PASSWORD not set. Using default: 'password123'");
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({
            data: {
                username: 'admin',
                password: hashedPassword,
                name: 'Admin User',
                email: adminEmail,
                role: 'admin',
                position: 'System Administrator',
                department: 'IT',
                employeeId: 'EMP-001',
                bio: 'Default System Administrator',
                theme: 'light',
                language: 'th'
            }
        });
        console.log(`Default admin created: username='admin', password='${process.env.ADMIN_PASSWORD ? '[HIDDEN]' : adminPassword}'`);
    }
};
// Run seed on startup (async)
seedAdmin().catch(console.error);


// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'server-ok', timestamp: new Date().toISOString() });
});

// Database Health Check Endpoint (For debugging Vercel connection)
app.get('/api/health-db', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        res.json({ status: 'db-ok', users: userCount, timestamp: new Date().toISOString() });
    } catch (error: any) {
        console.error('DB Connection Failed:', error);
        res.status(500).json({ status: 'db-error', message: error.message, stack: error.stack });
    }
});

// --- API Routes ---
app.use('/api', authRoutes);
// --- MCP Routes (SSE) ---
app.use('/api/mcp', mcpRoutes);

app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/expenses', authenticateToken, expenseRoutes);
app.use('/api', authenticateToken, budgetRoutes);
app.use('/api', authenticateToken, settingRoutes);
app.use('/api/activity-logs', authenticateToken, activityLogRoutes);




// --- Static Files (Production/Render) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In production (built with vite), dist is at the project root
const distPath = path.join(__dirname, '../dist');

// Serve static files if they exist OR if we are in production
if (process.env.NODE_ENV === 'production' || fs.existsSync(distPath)) {
    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));

    // Catch-all for SPA
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            const indexPath = path.join(distPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                console.warn(`Index file not found at ${indexPath}`);
                res.status(404).send('Not found');
            }
        } else {
            res.status(404).json({ error: 'API endpoint not found' });
        }
    });
}

// Global Error Handler
app.use(errorHandler);

export default app;
