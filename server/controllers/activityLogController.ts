import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getActivityLogs = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, role: true, avatar: true, username: true }
                }
            },
            take: 100 // Limit to last 100 activities
        });
        res.json(logs);
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};
