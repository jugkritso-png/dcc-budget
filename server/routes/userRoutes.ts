import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase.js';
import validate from '../middleware/validateResource.js';
import { createUserSchema, updateUserSchema, changePasswordSchema } from '../schemas/userSchema.js';
import { authenticateToken, requirePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// List all users
router.get('/', async (req, res) => {
    const { data: users, error } = await supabase
        .from('User')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Remove passwords before sending
    const safeUsers = (users || []).map(user => {
        const { password, ...rest } = user;
        return rest;
    });
    res.json(safeUsers);
});

// Create new user
router.post('/', validate(createUserSchema), requirePermission('manage_users'), async (req, res) => {
    const { username, password, name, email, role, department, position } = req.body;

    // Check if username or email exists
    let existingQuery = supabase.from('User').select('id');
    if (email) {
        existingQuery = existingQuery.or(`username.eq.${username},email.eq.${email}`);
    } else {
        existingQuery = existingQuery.eq('username', username);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
        return res.status(400).json({ error: 'Username or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase.from('User').insert({
        username,
        password: hashedPassword,
        name,
        email,
        role: role || 'user',
        department,
        position,
        avatar: name.substring(0, 2).toUpperCase() // Default avatar initials
    }).select().single();

    if (error || !newUser) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: 'Failed to create user' });
    }

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
});

// Update user
router.put('/:id', validate(updateUserSchema), async (req, res) => {
    const { id } = req.params as { id: string };

    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ error: 'Unauthorized' });

    // Check if simple user trying to update another user
    if (currentUser.id !== id && currentUser.role !== 'admin') {
        const { data: settings } = await supabase
            .from('SystemSetting')
            .select('*')
            .eq('key', 'PERMISSIONS')
            .maybeSingle();

        let hasPermission = false;
        if (settings) {
            const permissionsMap = JSON.parse(settings.value);
            const userPermissions = permissionsMap[currentUser.role] || [];
            if (userPermissions.includes('manage_users')) hasPermission = true;
        }

        if (!hasPermission) {
            return res.status(403).json({ error: 'Permission denied' });
        }
    }

    const updateData = { ...req.body };

    // If updating password, hash it
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const { data: updatedUser, error } = await supabase
        .from('User')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error || !updatedUser) {
        return res.status(500).json({ error: 'Failed to update user' });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
});

// Change Password
router.post('/change-password', validate(changePasswordSchema), async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    const { data: user } = await supabase
        .from('User')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

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

    const { error } = await supabase
        .from('User')
        .update({ password: hashedPassword })
        .eq('id', userId);

    if (error) {
        return res.status(500).json({ error: 'Failed to change password' });
    }

    res.json({ success: true });
});

// Delete user
router.delete('/:id', requirePermission('manage_users'), async (req, res) => {
    const { id } = req.params as { id: string };
    const { error } = await supabase.from('User').delete().eq('id', id);
    if (error) {
        return res.status(500).json({ error: 'Failed to delete user' });
    }
    res.json({ success: true });
});

export default router;
