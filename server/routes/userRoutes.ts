import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import validate from '../middleware/validateResource';
import { createUserSchema, updateUserSchema, changePasswordSchema } from '../schemas/userSchema';

const router = express.Router();

// List all users
router.get('/', async (req, res) => {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
    // Remove passwords before sending
    const safeUsers = users.map(user => {
        const { password, ...rest } = user;
        return rest;
    });
    res.json(safeUsers);
});

// Create new user
router.post('/', validate(createUserSchema), async (req, res) => {
    const { username, password, name, email, role, department, position } = req.body;

    // Check if username or email exists
    const existing = await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email: email || undefined }
            ]
        }
    });

    if (existing) {
        return res.status(400).json({ error: 'Username or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            name,
            email,
            role: role || 'user',
            department,
            position,
            avatar: name.substring(0, 2).toUpperCase() // Default avatar initials
        }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
});

// Update user
router.put('/:id', validate(updateUserSchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const updateData = { ...req.body };

    // If updating password, hash it
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
});

// Change Password
router.post('/change-password', validate(changePasswordSchema), async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    // Support plain text check for transition
    const isPlainMatch = (!isMatch && currentPassword === user.password);

    if (!isMatch && !isPlainMatch) {
        return res.status(400).json({ error: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    res.json({ success: true });
});

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // Prevent deleting the last admin if needed, but for now just allow
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
});

export default router;
