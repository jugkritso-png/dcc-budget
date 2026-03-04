import 'dotenv/config';
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
console.log("[authMiddleware] Using JWT_SECRET starting with:", JWT_SECRET.substring(0, 5), "Length:", JWT_SECRET.length);
import { supabase } from '../lib/supabase.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
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
            const { data: settings } = await supabase
                .from('SystemSetting')
                .select('value')
                .eq('key', 'PERMISSIONS')
                .maybeSingle();

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
