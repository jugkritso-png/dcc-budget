import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';

import validate from '../middleware/validateResource';
import { loginSchema } from '../schemas/authSchema';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dcc-secret-key-change-in-prod';

router.post('/login', validate(loginSchema), async (req, res) => {
    const { username, password } = req.body;

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

    // Generate Request Token
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Log Login Activity
    await logActivity(user.id, 'LOGIN', { username: user.username, role: user.role }, req);

    res.json({ user: userWithoutPassword, token });
});
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');

router.post('/google', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        });
        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({ error: 'Invalid token payload' });
        }

        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ error: 'Email permission not granted' });
        }

        // 1. Check if user exists by Google ID
        let user = await prisma.user.findFirst({
            where: { OR: [{ googleId }, { email }] }
        });

        if (user) {
            // Update Google ID if not present (Activity Log logic below handles auditing)
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, avatar: user.avatar || picture }
                });
            }
        } else {
            // 2. Create new user if not exists
            const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!'; // Random placeholder
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            user = await prisma.user.create({
                data: {
                    username: email.split('@')[0], // Generate username from email
                    email,
                    name: name || 'Google User',
                    password: hashedPassword,
                    role: 'user', // Default role
                    googleId,
                    avatar: picture,
                    department: 'General'
                }
            });
        }

        // Generate Request Token
        const jwtToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log Login Activity
        await logActivity(user.id, 'LOGIN_GOOGLE', { username: user.username, email: user.email }, req);

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token: jwtToken });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Google Authentication Failed' });
    }
});

export default router;
