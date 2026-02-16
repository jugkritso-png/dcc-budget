import express from 'express';
import prisma from '../lib/prisma';
import validate from '../middleware/validateResource';
import { createDepartmentSchema } from '../schemas/masterDataSchema';

const router = express.Router();

// --- System Settings ---
router.get('/settings', async (req, res) => {
    const settings = await prisma.systemSetting.findMany();
    // Transform array to object
    const settingsObj = settings.reduce((acc, curr) => {
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

import { authenticateToken, requirePermission } from '../middleware/authMiddleware';

router.put('/settings', requirePermission('manage_settings'), async (req, res) => {
    const { orgName, fiscalYear, overBudgetAlert, fiscalYearCutoff, permissions } = req.body;

    await prisma.systemSetting.upsert({
        where: { key: 'ORG_NAME' },
        update: { value: orgName },
        create: { key: 'ORG_NAME', value: orgName },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'FISCAL_YEAR' },
        update: { value: fiscalYear.toString() },
        create: { key: 'FISCAL_YEAR', value: fiscalYear.toString() },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'OVER_BUDGET_ALERT' },
        update: { value: String(overBudgetAlert) },
        create: { key: 'OVER_BUDGET_ALERT', value: String(overBudgetAlert) },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'FISCAL_YEAR_CUTOFF' },
        update: { value: fiscalYearCutoff },
        create: { key: 'FISCAL_YEAR_CUTOFF', value: fiscalYearCutoff }, // Store as YYYY-MM-DD string
    });

    if (permissions) {
        await prisma.systemSetting.upsert({
            where: { key: 'PERMISSIONS' },
            update: { value: JSON.stringify(permissions) },
            create: { key: 'PERMISSIONS', value: JSON.stringify(permissions) },
        });
    }

    res.json({ success: true });
});

// --- Departments ---
router.get('/departments', async (req, res) => {
    const departments = await prisma.department.findMany();
    res.json(departments);
});

router.post('/departments', validate(createDepartmentSchema), requirePermission('manage_departments'), async (req, res) => {
    const { name, code, color } = req.body;
    const department = await prisma.department.create({
        data: { name, code, color: color || "#3B82F6" }
    });
    res.json(department);
});

router.put('/departments/:id', validate(createDepartmentSchema), requirePermission('manage_departments'), async (req, res) => { // Reusing create schema as it has same fields
    const { id } = req.params as { id: string };
    const { name, code, color } = req.body;
    const department = await prisma.department.update({
        where: { id },
        data: { name, code, color }
    });
    res.json(department);
});

router.delete('/departments/:id', requirePermission('manage_departments'), async (req, res) => {
    const { id } = req.params as { id: string };
    await prisma.department.delete({ where: { id } });
    res.json({ success: true });
});

export default router;
