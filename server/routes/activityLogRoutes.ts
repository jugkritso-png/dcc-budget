import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data: logs, error } = await supabase
            .from('ActivityLog')
            .select('*, user:User(name, role, avatar, username)')
            .order('createdAt', { ascending: false })
            .limit(100);

        if (error) throw error;

        res.json(logs || []);
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

export default router;
