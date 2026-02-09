import express from 'express';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';
import validate from '../middleware/validateResource';
import { createRequestSchema, updateRequestStatusSchema } from '../schemas/budgetRequestSchema';
import { createSubActivitySchema, updateSubActivitySchema } from '../schemas/masterDataSchema';

const router = express.Router();

// --- SubActivities ---
router.get('/sub-activities', async (req, res) => {
    const subs = await prisma.subActivity.findMany({
        include: { children: true } // Include children for hierarchy
    });
    res.json(subs);
});

router.post('/sub-activities', validate(createSubActivitySchema), async (req, res) => {
    try {
        console.log("[POST /sub-activities] Body:", req.body);
        const sub = await prisma.subActivity.create({ data: req.body });
        console.log("[POST /sub-activities] Created:", sub);
        res.json(sub);
    } catch (error) {
        console.error("[POST /sub-activities] Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) });
    }
});

router.put('/sub-activities/:id', validate(updateSubActivitySchema), async (req, res) => {
    const { id } = req.params as { id: string };
    // Filter out read-only fields that may come from frontend
    const { id: _, createdAt, updatedAt, children, childrenList, used, ...updateData } = req.body;
    const sub = await prisma.subActivity.update({
        where: { id },
        data: updateData
    });
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

    // Budget Check for Sub-Activity
    if (rest.subActivityId) {
        const sub = await prisma.subActivity.findUnique({
            where: { id: rest.subActivityId }
        });

        if (sub) {
            const aggregations = await prisma.budgetRequest.aggregate({
                _sum: { amount: true, returnAmount: true },
                where: {
                    subActivityId: rest.subActivityId,
                    status: { not: 'rejected' }
                }
            });
            const totalAmount = aggregations._sum.amount || 0;
            const totalReturn = aggregations._sum.returnAmount || 0;
            const used = totalAmount - totalReturn;
            const requestedAmount = rest.amount;

            if (used + requestedAmount > sub.allocated) {
                return res.status(400).json({
                    error: `งบประมาณไม่เพียงพอสำหรับกิจกรรมย่อย "${sub.name}" (คงเหลือ: ${(sub.allocated - used).toLocaleString()} บาท, ขอ: ${requestedAmount.toLocaleString()} บาท)`
                });
            }
        }
    }

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

// Approve Request
router.put('/requests/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { approverId } = req.body;

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id },
            include: { expenseItems: true } // Ensure we have items
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // 1. Update Request Status
        const updatedRequest = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'approved',
                approverId,
                approvedAt: new Date()
            }
        });

        // 2. Update Budget Category Usage (Per Item Category)
        // Group items by category to minimize DB calls
        const categoryUpdates: Record<string, number> = {};

        // If no items, fallback to main category (legacy support)
        if (!request.expenseItems || request.expenseItems.length === 0) {
            categoryUpdates[request.category] = request.amount;
        } else {
            request.expenseItems.forEach(item => {
                const catName = item.category || request.category; // Fallback to main if item has no category
                categoryUpdates[catName] = (categoryUpdates[catName] || 0) + item.total;
            });
        }

        // Execute Updates
        for (const [catName, amount] of Object.entries(categoryUpdates)) {
            const category = await prisma.category.findFirst({
                where: { name: catName, year: new Date().getFullYear() + 543 }
            });

            if (category) {
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { increment: amount } }
                });
            } else {
                console.warn(`Category not found for update: ${catName}`);
            }
        }

        await logActivity(approverId, 'APPROVE_REQUEST', { requestId: id, amount: request.amount }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error approving request:", error);
        res.status(500).json({ error: 'Failed to approve request' });
    }
});

// Reject Request
router.put('/requests/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { approverId, reason } = req.body;

    try {
        const request = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'rejected',
                approverId,
                approvedAt: new Date(),
                rejectionReason: reason
            }
        });

        await logActivity(approverId, 'REJECT_REQUEST', { requestId: id, reason }, req);
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject request' });
    }
});


// 1. Submit Expense Report (User Action) - Moves to "waiting_verification"
router.put('/requests/:id/submit-expense', async (req, res) => {
    const { id } = req.params;
    const { expenseItems, actualTotal, returnAmount } = req.body;

    try {
        const request = await prisma.budgetRequest.findUnique({ where: { id } });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // Update Request with Actuals and set Status to 'waiting_verification'
        const updatedRequest = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'waiting_verification', // New Status
                actualAmount: actualTotal,
                returnAmount: returnAmount,
                // Do NOT set completedAt yet
                expenseItems: {
                    update: expenseItems
                        .filter((item: any) => item.id && !item.id.startsWith('temp-'))
                        .map((item: any) => ({
                            where: { id: item.id },
                            data: { actualAmount: item.actualAmount }
                        })),
                    create: expenseItems
                        .filter((item: any) => !item.id || item.id.startsWith('temp-'))
                        .map((item: any) => ({
                            category: item.category || 'other',
                            description: item.description,
                            quantity: parseFloat(item.quantity) || 1,
                            unit: item.unit || 'หน่วย',
                            unitPrice: parseFloat(item.actualAmount) || 0,
                            total: 0,
                            actualAmount: parseFloat(item.actualAmount) || 0
                        }))
                }
            },
            include: { expenseItems: true }
        });

        await logActivity(null, 'SUBMIT_EXPENSE_REPORT', { requestId: id, actualTotal }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit expense report' });
    }
});

// 2. Complete/Verify Request (Manager Action) - Moves to "completed" and Returns Funds
router.put('/requests/:id/complete', async (req, res) => {
    const { id } = req.params;

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id },
            include: { expenseItems: true } // Ensure items are loaded
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // Ensure status is correct
        if (request.status !== 'waiting_verification') {
            // Optional strict check
        }

        const returnAmount = request.returnAmount || 0;

        // 1. Update Request to Completed
        const updatedRequest = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'completed',
                completedAt: new Date(),
            }
        });

        // 2. Return unused funds to Category (Per Item Category)
        if (returnAmount > 0 && request.expenseItems && request.expenseItems.length > 0) {

            // Calculate return amount per category
            const categoryReturns: Record<string, number> = {};

            request.expenseItems.forEach((item: any) => {
                // If item has no ID (new) or temp, it might differ, but generally we rely on 'total' vs 'actualAmount'
                // Note: 'total' is the allocated amount for that item.
                const itemReturn = Math.max(0, (item.total || 0) - (item.actualAmount || 0));

                if (itemReturn > 0) {
                    const catName = item.category || request.category;
                    categoryReturns[catName] = (categoryReturns[catName] || 0) + itemReturn;
                }
            });

            // Execute Updates
            for (const [catName, amount] of Object.entries(categoryReturns)) {
                if (amount <= 0) continue;

                const category = await prisma.category.findFirst({
                    where: { name: catName, year: new Date().getFullYear() + 543 }
                });

                if (category) {
                    await prisma.category.update({
                        where: { id: category.id },
                        data: { used: { decrement: amount } } // Reduce usage = Return funds
                    });

                    // Log Budget Return
                    await prisma.budgetLog.create({
                        data: {
                            categoryId: category.id,
                            amount: amount,
                            type: 'REDUCE', // Reduce Usage
                            reason: `คืนงบประมาณส่วนเหลืองาน: ${request.project} (${catName})`,
                            user: 'System'
                        }
                    });
                } else {
                    console.warn(`Category not found for return: ${catName}`);
                }
            }
        }
        // Fallback for legacy requests without items or simple return logic
        else if (returnAmount > 0) {
            const category = await prisma.category.findFirst({ where: { name: request.category, year: new Date().getFullYear() + 543 } });
            if (category) {
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { decrement: returnAmount } }
                });
            }
        }

        await logActivity(null, 'VERIFY_AND_COMPLETE_REQUEST', { requestId: id, returnAmount }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error completing request:", error);
        res.status(500).json({ error: 'Failed to verify and complete request' });
    }
});

// 3. Revert Complete (Manager Action) - Moves back to "waiting_verification" and Reverses Fund Return
router.put('/requests/:id/revert-complete', async (req, res) => {
    const { id } = req.params;

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id },
            include: { expenseItems: true } // Ensure items are loaded
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (request.status !== 'completed') {
            return res.status(400).json({ error: 'Request is not completed' });
        }

        const returnAmount = request.returnAmount || 0;

        // 1. Update Request back to waiting_verification
        const updatedRequest = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'waiting_verification',
                completedAt: null // Clear completed date
            }
        });

        // 2. Reverse Budget Return (Increase Used = Take funds back)
        if (returnAmount > 0 && request.expenseItems && request.expenseItems.length > 0) {

            // Calculate return amount per category (Same logic as complete)
            const categoryReturns: Record<string, number> = {};

            request.expenseItems.forEach((item: any) => {
                const itemReturn = Math.max(0, (item.total || 0) - (item.actualAmount || 0));

                if (itemReturn > 0) {
                    const catName = item.category || request.category;
                    categoryReturns[catName] = (categoryReturns[catName] || 0) + itemReturn;
                }
            });

            // Execute Reversions
            for (const [catName, amount] of Object.entries(categoryReturns)) {
                if (amount <= 0) continue;

                const category = await prisma.category.findFirst({
                    where: { name: catName, year: new Date().getFullYear() + 543 }
                });

                if (category) {
                    await prisma.category.update({
                        where: { id: category.id },
                        data: { used: { increment: amount } } // Increase usage = Un-return funds
                    });

                    // Log Revert
                    await prisma.budgetLog.create({
                        data: {
                            categoryId: category.id,
                            amount: amount,
                            type: 'ADD', // Add back to usage
                            reason: `ยกเลิกการปิดโครงการ: ${request.project} (${catName})`,
                            user: 'System'
                        }
                    });
                } else {
                    console.warn(`Category not found for revert: ${catName}`);
                }
            }
        }
        else if (returnAmount > 0) {
            // Legacy Fallback
            const category = await prisma.category.findFirst({ where: { name: request.category, year: new Date().getFullYear() + 543 } });
            if (category) {
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { increment: returnAmount } }
                });
            }
        }

        await logActivity(null, 'REVERT_COMPLETE_REQUEST', { requestId: id, returnAmount }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error reverting request:", error);
        res.status(500).json({ error: 'Failed to revert completion' });
    }
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
