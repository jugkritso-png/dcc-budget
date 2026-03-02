import express from 'express';
import { supabase } from '../lib/supabase';

export const logActivity = async (userId: string | null, action: string, details: any, req?: express.Request) => {
    try {
        const ipAddress = req ? (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress) : null;
        const userAgent = req ? req.headers['user-agent'] : null;
        const detailsStr = typeof details === 'string' ? details : JSON.stringify(details);

        await supabase.from('ActivityLog').insert({
            userId,
            action,
            details: detailsStr,
            ipAddress,
            userAgent
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
