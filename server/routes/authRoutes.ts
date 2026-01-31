import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // Fallback: Check plain text if bcrypt fails (ONLY FOR MIGRATION/DEV)
        if (!isMatch && password === user.password) {
            console.warn(`User ${username} logged in with plain text password. Migrating...`);
            const hashed = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashed }
            });
        } else if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        // Log Login Activity
        await logActivity(user.id, 'LOGIN', { username: user.username, role: user.role }, req);

        res.json(userWithoutPassword);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
