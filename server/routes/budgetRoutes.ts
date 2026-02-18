import express from 'express';
import prisma from '../lib/prisma';
import { Category } from '@prisma/client';
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
    const { id } = req.params as { id: string };
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

import { authenticateToken, requirePermission } from '../middleware/authMiddleware';

// ... (existing code)

// Approve Request
router.put('/requests/:id/approve', requirePermission('approve_budget'), async (req, res) => {
    const { id } = req.params as { id: string };
    const { approverId } = req.body as { approverId: string };

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id },
            include: { expenseItems: true } // Ensure we have items
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // Helper to check if expenseItems exists (for TS)
        // casting to any because Prisma include types can be tricky in this setup
        const items = (request as any).expenseItems || [];

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
        if (items.length === 0) {
            categoryUpdates[request.category] = request.amount;
        } else {
            items.forEach(item => {
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
router.put('/requests/:id/reject', requirePermission('approve_budget'), async (req, res) => {
    const { id } = req.params as { id: string };
    const { approverId, reason } = req.body as { approverId: string, reason: string };

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
    const { id } = req.params as { id: string };
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

// 1.5 Send Back for Revision (Manager Action) - Moves back to "approved" (User can edit)
router.put('/requests/:id/reject-expense', async (req, res) => {
    const { id } = req.params as { id: string };
    const { reason } = req.body;

    try {
        const request = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'approved', // Back to Approved (User can restart report)
                // We keep actualAmount/expenseItems so they don't lose data, 
                // but the UI should let them edit it again.
                rejectionReason: reason // Optional: store why it was sent back
            }
        });

        await logActivity(null, 'REJECT_EXPENSE_REPORT', { requestId: id, reason }, req);
        res.json(request);
    } catch (error) {
        console.error("Error rejecting expense report:", error);
        res.status(500).json({ error: 'Failed to send back for revision' });
    }
});

// 2. Complete/Verify Request (Manager Action) - Moves to "completed" and Returns Funds
router.put('/requests/:id/complete', async (req, res) => {
    const { id } = req.params as { id: string };

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


        // 1. Update Request to Completed
        const updatedRequest = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'completed',
                completedAt: new Date(),
            }
        });

        // Pre-fetch all categories for the year to valid/fallback logic
        const requestYear = new Date().getFullYear() + 543; // Or derived from request.date? usually current fiscal year
        const allCategories = await prisma.category.findMany({
            where: { year: { equals: requestYear } } // Assuming year match
        });
        const categoryMap = new Map(allCategories.map(c => [c.name, c]));

        // Helper to resolve valid category
        const resolveCategory = (name: string): Category | undefined => {
            if (categoryMap.has(name)) return categoryMap.get(name);
            // Fallback to request category
            return categoryMap.get(request.category);
        };

        // 2. Calculate Budget Return/Charge per Category
        // We must aggregate ALL items to their categories to find the net effect.
        // Structure: { [categoryId]: { allocated: number, actual: number, categoryObj: Category } }
        const categoryStats: Record<string, { allocated: number, actual: number, category: any }> = {};

        // Helper to init category stats
        const initCat = (category: any) => {
            if (!categoryStats[category.id]) categoryStats[category.id] = { allocated: 0, actual: 0, category };
        };

        // Process Expense Items
        if (request.expenseItems && request.expenseItems.length > 0) {
            request.expenseItems.forEach(item => {
                const catName = item.category || request.category;
                const category = resolveCategory(catName);

                if (category) {
                    initCat(category);
                    categoryStats[category.id].allocated += item.total || 0;
                    categoryStats[category.id].actual += item.actualAmount || 0;
                } else {
                    console.warn(`Could not resolve category for item: ${item.description}, cat: ${catName}`);
                }
            });
        } else {
            // Legacy/No-Item Support
            const category = resolveCategory(request.category);
            if (category) {
                initCat(category);
                categoryStats[category.id].allocated += request.amount;
                categoryStats[category.id].actual += request.actualAmount || 0;
            }
        }

        // Execute Updates based on Net Change
        for (const [catId, stats] of Object.entries(categoryStats)) {
            const netChange = stats.actual - stats.allocated;
            // netChange < 0 means Underspent (Return funds) -> Decrement Used
            // netChange > 0 means Overspent (Charge more funds) -> Increment Used

            if (netChange === 0) continue;

            const category = stats.category;

            if (netChange < 0) {
                // RETURN Funds (Underspent)
                const returnAmount = Math.abs(netChange);
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { decrement: returnAmount } }
                });

                // Log Budget Return
                await prisma.budgetLog.create({
                    data: {
                        categoryId: category.id,
                        amount: returnAmount,
                        type: 'REDUCE',
                        reason: `คืนงบประมาณส่วนเหลืองาน: ${request.project} (${category.name})`,
                        user: 'System'
                    }
                });
            } else {
                // CHARGE Funds (Overspent)
                const extraAmount = netChange;
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { increment: extraAmount } }
                });

                // Log Budget Charge
                await prisma.budgetLog.create({
                    data: {
                        categoryId: category.id,
                        amount: extraAmount,
                        type: 'ADD',
                        reason: `ตัดงบประมาณเพิ่ม (เกินงบ): ${request.project} (${category.name})`,
                        user: 'System'
                    }
                });
            }
        }

        // 3. Create Expense Records for Tracking
        if (request.expenseItems && request.expenseItems.length > 0) {
            for (const item of request.expenseItems) {
                if ((item.actualAmount || 0) > 0) {
                    const catName = item.category || request.category;
                    const category = resolveCategory(catName);

                    if (category) {
                        await prisma.expense.create({
                            data: {
                                categoryId: category.id,
                                amount: item.actualAmount || 0,
                                payee: request.requester,
                                date: new Date().toISOString(),
                                description: `[${request.project}] ${item.description}`
                            }
                        });
                    }
                }
            }
        } else if (request.actualAmount && request.actualAmount > 0) {
            // Legacy/No-Item Support
            const category = resolveCategory(request.category);
            if (category) {
                await prisma.expense.create({
                    data: {
                        categoryId: category.id,
                        amount: request.actualAmount,
                        payee: request.requester,
                        date: new Date().toISOString(),
                        description: `[${request.project}] Project Expense`
                    }
                });
            }
        }

        const returnAmount = request.returnAmount || 0; // Legacy ref for logging
        await logActivity(null, 'VERIFY_AND_COMPLETE_REQUEST', { requestId: id, returnAmount }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error completing request:", error);
        res.status(500).json({ error: 'Failed to verify and complete request' });
    }
});

// 3. Revert Complete (Manager Action) - Moves back to "waiting_verification" and Reverses Fund Return
router.put('/requests/:id/revert-complete', async (req, res) => {
    const { id } = req.params as { id: string };

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id },
            include: { expenseItems: true } // Ensure items are loaded
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (request.status !== 'completed') {
            return res.status(400).json({ error: 'Request is not completed' });
        }

        // 1. Update Request back to waiting_verification
        const updatedRequest = await prisma.budgetRequest.update({
            where: { id },
            data: {
                status: 'waiting_verification',
                completedAt: null // Clear completed date
            }
        });

        // 2. Reverse Budget Return/Charge (Net Calculation)

        // Pre-fetch all categories
        const requestYear = new Date().getFullYear() + 543;
        const allCategories = await prisma.category.findMany({
            where: { year: { equals: requestYear } }
        });
        const categoryMap = new Map(allCategories.map(c => [c.name, c]));

        const resolveCategory = (name: string): Category | undefined => {
            if (categoryMap.has(name)) return categoryMap.get(name);
            return categoryMap.get(request.category);
        };

        const categoryStats: Record<string, { allocated: number, actual: number, category: any }> = {};
        const initCat = (category: any) => {
            if (!categoryStats[category.id]) categoryStats[category.id] = { allocated: 0, actual: 0, category };
        };

        if (request.expenseItems && request.expenseItems.length > 0) {
            request.expenseItems.forEach(item => {
                const catName = item.category || request.category;
                const category = resolveCategory(catName);
                if (category) {
                    initCat(category);
                    categoryStats[category.id].allocated += item.total || 0;
                    categoryStats[category.id].actual += item.actualAmount || 0;
                }
            });
        } else {
            const category = resolveCategory(request.category);
            if (category) {
                initCat(category);
                categoryStats[category.id].allocated += request.amount;
                categoryStats[category.id].actual += request.actualAmount || 0;
            }
        }

        for (const [catId, stats] of Object.entries(categoryStats)) {
            const netChange = stats.actual - stats.allocated;
            // Previously:
            // netChange < 0 (Underspent/Returned) -> We Reduced Used -> NOW INCREASE USED
            // netChange > 0 (Overspent/Charged)   -> We Increased Used -> NOW REDUCE USED

            if (netChange === 0) continue;

            const category = stats.category;

            if (netChange < 0) {
                // Was Underspent. Reverse -> Increase Used
                const returnAmount = Math.abs(netChange);
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { increment: returnAmount } }
                });

                // Log Revert
                await prisma.budgetLog.create({
                    data: {
                        categoryId: category.id,
                        amount: returnAmount,
                        type: 'ADD',
                        reason: `ยกเลิกการปิดโครงการ (ดึงเงินคืนกลับ): ${request.project} (${category.name})`,
                        user: 'System'
                    }
                });
            } else {
                // Was Overspent. Reverse -> Reduce Used
                const extraAmount = netChange;
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { decrement: extraAmount } }
                });

                // Log Revert
                await prisma.budgetLog.create({
                    data: {
                        categoryId: category.id,
                        amount: extraAmount,
                        type: 'REDUCE',
                        reason: `ยกเลิกการปิดโครงการ (คืนยอดตัดเกิน): ${request.project} (${category.name})`,
                        user: 'System'
                    }
                });
            }
        }


        // 3. Delete Created Expenses (Cleanup)
        await prisma.expense.deleteMany({
            where: {
                description: { startsWith: `[${request.project}]` },
            }
        });

        const returnAmount = request.returnAmount || 0;
        await logActivity(null, 'REVERT_COMPLETE_REQUEST', { requestId: id, returnAmount }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error reverting request:", error);
        res.status(500).json({ error: 'Failed to revert completion' });
    }
});

router.delete('/requests/:id', async (req, res) => {
    const { id } = req.params as { id: string };
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
