import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';
import { logActivity } from '../utils/logger.js';

import validate from '../middleware/validateResource.js';
import { loginSchema } from '../schemas/authSchema.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dcc-secret-key-change-in-prod';

router.post('/login', validate(loginSchema), async (req, res) => {
    const { username, password } = req.body;

    const { data: user, error } = await supabase
        .from('User')
        .select('*')
        .eq('username', username)
        .maybeSingle();

    if (error || !user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // Fallback: Check plain text if bcrypt fails (ONLY FOR MIGRATION/DEV)
    if (!isMatch && password === user.password) {
        console.warn(`User ${username} logged in with plain text password. Migrating...`);
        const hashed = await bcrypt.hash(password, 10);
        await supabase
            .from('User')
            .update({ password: hashed })
            .eq('id', user.id);
    } else if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    // Generate Request Token
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h', algorithm: 'HS256' }
    );

    // Log Login Activity
    await logActivity(user.id, 'LOGIN', { username: user.username, role: user.role }, req);

    res.json({ user: userWithoutPassword, token });
});

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
        let { data: user } = await supabase
            .from('User')
            .select('*')
            .or(`googleId.eq.${googleId},email.eq.${email}`)
            .maybeSingle();

        if (user) {
            // Update Google ID if not present (Activity Log logic below handles auditing)
            if (!user.googleId) {
                const { data: updatedUser } = await supabase
                    .from('User')
                    .update({ googleId, avatar: user.avatar || picture })
                    .eq('id', user.id)
                    .select()
                    .single();
                user = updatedUser;
            }
        } else {
            // 2. Create new user if not exists
            const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!'; // Random placeholder
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            // Using uuids handled by postgres if configured, but let's assume default pg behavior is ok or we generate one
            const { data: newUser, error: createError } = await supabase
                .from('User')
                .insert({
                    username: email.split('@')[0], // Generate username from email
                    email,
                    name: name || 'Google User',
                    password: hashedPassword,
                    role: 'user', // Default role
                    googleId,
                    avatar: picture,
                    department: 'General'
                })
                .select()
                .single();

            if (createError) throw createError;
            user = newUser;
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
