import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dcc-secret-key-change-in-prod';


import prisma from '../lib/prisma.js'; // Ensure prisma is imported

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

export const requirePermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).json({ error: 'Unauthorized' });

            // Admin always has access
            if (user.role === 'admin') {
                return next();
            }

            // Fetch permissions from settings
            const settings = await prisma.systemSetting.findUnique({
                where: { key: 'PERMISSIONS' }
            });

            if (!settings) {
                // If no settings found, deny by default (except admin)
                return res.status(403).json({ error: 'Permission denied (No configuration)' });
            }

            const permissionsMap = JSON.parse(settings.value);
            const userPermissions = permissionsMap[user.role] || [];

            if (userPermissions.includes(permission)) {
                return next();
            }

            return res.status(403).json({ error: `Permission denied: Requires ${permission}` });

        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({ error: 'Internal Server Error during permission check' });
        }
    };
};
