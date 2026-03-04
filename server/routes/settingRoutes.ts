import express from 'express';
import { supabase } from '../lib/supabase.js';
import validate from '../middleware/validateResource.js';
import { createDepartmentSchema } from '../schemas/masterDataSchema.js';
import { authenticateToken, requirePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- System Settings ---
router.get('/settings', async (req, res) => {
    const { data: settings, error } = await supabase.from('SystemSetting').select('*');

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }

    // Transform array to object
    const settingsObj = (settings || []).reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    let permissions = {};
    try {
        if (settingsObj['PERMISSIONS']) {
            permissions = JSON.parse(settingsObj['PERMISSIONS']);
        }
    } catch (e) {
        console.error("Failed to parse permissions", e);
    }

    res.json({
        orgName: settingsObj['ORG_NAME'] || 'DCC Company Ltd.',
        fiscalYear: parseInt(settingsObj['FISCAL_YEAR'] || '2569'),
        overBudgetAlert: settingsObj['OVER_BUDGET_ALERT'] === 'true',
        fiscalYearCutoff: settingsObj['FISCAL_YEAR_CUTOFF'] || '2026-09-30',
        permissions
    });
});

router.put('/settings', requirePermission('manage_settings'), async (req, res) => {
    const { orgName, fiscalYear, overBudgetAlert, fiscalYearCutoff, permissions } = req.body;

    const upsertSetting = async (key: string, value: string) => {
        // Supabase upsert requires primary key 'key'
        await supabase.from('SystemSetting').upsert({ key, value });
    };

    await upsertSetting('ORG_NAME', orgName);
    await upsertSetting('FISCAL_YEAR', fiscalYear.toString());
    await upsertSetting('OVER_BUDGET_ALERT', String(overBudgetAlert));
    await upsertSetting('FISCAL_YEAR_CUTOFF', fiscalYearCutoff);

    if (permissions) {
        await upsertSetting('PERMISSIONS', JSON.stringify(permissions));
    }

    res.json({ success: true });
});

// --- Departments ---
router.get('/departments', async (req, res) => {
    const { data: departments, error } = await supabase.from('Department').select('*');
    if (error) return res.status(500).json({ error: 'Failed to fetch departments' });
    res.json(departments || []);
});

router.post('/departments', validate(createDepartmentSchema), requirePermission('manage_departments'), async (req, res) => {
    const { name, code, color } = req.body;
    const { data: department, error } = await supabase.from('Department').insert({
        name, code, color: color || "#3B82F6"
    }).select().single();

    if (error) return res.status(500).json({ error: 'Failed to create department' });
    res.json(department);
});

router.put('/departments/:id', validate(createDepartmentSchema), requirePermission('manage_departments'), async (req, res) => {
    const { id } = req.params as { id: string };
    const { name, code, color } = req.body;

    const { data: department, error } = await supabase.from('Department').update({
        name, code, color
    }).eq('id', id).select().single();

    if (error) return res.status(500).json({ error: 'Failed to update department' });
    res.json(department);
});

router.delete('/departments/:id', requirePermission('manage_departments'), async (req, res) => {
    const { id } = req.params as { id: string };
    const { error } = await supabase.from('Department').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete department' });
    res.json({ success: true });
});

export default router;
