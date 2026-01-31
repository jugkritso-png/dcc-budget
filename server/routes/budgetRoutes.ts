import express from 'express';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';
import validate from '../middleware/validateResource';
import { createRequestSchema, updateRequestStatusSchema } from '../schemas/budgetRequestSchema';
import { createSubActivitySchema } from '../schemas/masterDataSchema';

const router = express.Router();

// --- SubActivities ---
router.get('/sub-activities', async (req, res) => {
    const subs = await prisma.subActivity.findMany();
    res.json(subs);
});

router.post('/sub-activities', validate(createSubActivitySchema), async (req, res) => {
    const sub = await prisma.subActivity.create({ data: req.body });
    res.json(sub);
});

router.delete('/sub-activities/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.subActivity.delete({ where: { id } });
    res.json({ success: true });
});

// --- Budget Requests ---
router.get('/requests', async (req, res) => {
    const requests = await prisma.budgetRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { expenseItems: true }
    });
    res.json(requests);
});

router.post('/requests', validate(createRequestSchema), async (req, res) => {
    const { expenseItems, ...rest } = req.body;
    const request = await prisma.budgetRequest.create({
        data: {
            ...rest,
            expenseItems: {
                create: expenseItems
            }
        },
        include: { expenseItems: true }
    });

    // Log Activity
    const user = await prisma.user.findFirst({ where: { name: rest.requester } });
    await logActivity(user?.id || null, 'CREATE_REQUEST', { requestId: request.id, project: request.project, amount: request.amount }, req);

    res.json(request);
});

router.put('/requests/:id/status', validate(updateRequestStatusSchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const request = await prisma.budgetRequest.update({
        where: { id },
        data: { status },
    });

    await logActivity(null, 'UPDATE_REQUEST_STATUS', { requestId: id, status }, req);

    res.json(request);
});

router.delete('/requests/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.budgetRequest.delete({ where: { id } });
    res.json({ success: true });
});

// --- Budget Plans ---
router.get('/budget-plans', async (req, res) => {
    const { year } = req.query;
    const where = year ? { year: parseInt(year as string) } : {};
    const plans = await prisma.budgetPlan.findMany({ where });
    res.json(plans);
});

router.post('/budget-plans', async (req, res) => {
    const { subActivityId, year, month, amount } = req.body;
    const plan = await prisma.budgetPlan.upsert({
        where: {
            subActivityId_year_month: { subActivityId, year, month }
        },
        update: { amount: parseFloat(amount) },
        create: {
            subActivityId,
            year: parseInt(year),
            month: parseInt(month),
            amount: parseFloat(amount)
        }
    });

    await logActivity(null, 'UPDATE_BUDGET_PLAN', { subActivityId, year, month, amount }, req);
    res.json(plan);
});

export default router;
