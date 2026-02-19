import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export const listUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
    // Remove passwords before sending
    const safeUsers = users.map(user => {
        const { password, ...rest } = user;
        return rest;
    });
    res.json(safeUsers);
};

export const createUser = async (req: Request, res: Response) => {
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
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Permission Check logic (simplified from route)
    // Permission Check logic (simplified from route)
    const currentUser = (req as any).user;
    if (!currentUser) return res.status(401).json({ error: 'Unauthorized' });

    if (currentUser.id !== id && currentUser.role !== 'admin') {
        const settings = await prisma.systemSetting.findUnique({ where: { key: 'PERMISSIONS' } });
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

    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data: updateData,
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
};

export const changePassword = async (req: Request, res: Response) => {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
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
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: id as string } });
    res.json({ success: true });
};
