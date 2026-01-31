import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, role: true, avatar: true, username: true }
                }
            },
            take: 100
        });
        res.json(logs);
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

export default router;
