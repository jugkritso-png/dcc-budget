import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { logActivity } from '../utils/logger.js';
import { Category, Prisma } from '@prisma/client';

// Define type for Request with Items to help TypeScript
type BudgetRequestWithItems = Prisma.BudgetRequestGetPayload<{
    include: { expenseItems: true }
}>;

// --- SubActivities ---

export const getSubActivities = async (req: Request, res: Response) => {
    const subs = await prisma.subActivity.findMany({
        include: { children: true }
    });
    res.json(subs);
};

export const createSubActivity = async (req: Request, res: Response) => {
    try {
        console.log("[POST /sub-activities] Body:", req.body);
        const sub = await prisma.subActivity.create({ data: req.body });
        console.log("[POST /sub-activities] Created:", sub);
        res.json(sub);
    } catch (error) {
        console.error("[POST /sub-activities] Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) });
    }
};

export const updateSubActivity = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: _, createdAt, updatedAt, children, childrenList, used, ...updateData } = req.body;
    const sub = await prisma.subActivity.update({
        where: { id: id as string },
        data: updateData
    });
    res.json(sub);
};

export const deleteSubActivity = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.subActivity.delete({ where: { id: id as string } });
    res.json({ success: true });
};

// --- Budget Requests ---

export const getRequests = async (req: Request, res: Response) => {
    const requests = await prisma.budgetRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { expenseItems: true }
    });
    res.json(requests);
};

export const createRequest = async (req: Request, res: Response) => {
    const { expenseItems, ...rest } = req.body;

    // Budget Check logic
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

    const user = await prisma.user.findFirst({ where: { name: rest.requester } });
    await logActivity(user?.id || null, 'CREATE_REQUEST', { requestId: request.id, project: request.project, amount: request.amount }, req);

    res.json(request);
};

export const updateRequestStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const request = await prisma.budgetRequest.update({
        where: { id: id as string },
        data: { status },
    });

    await logActivity(null, 'UPDATE_REQUEST_STATUS', { requestId: id, status }, req);
    res.json(request);
};

export const approveRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { approverId } = req.body;

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id: id as string },
            include: { expenseItems: true }
        });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        const items = request.expenseItems || [];

        const updatedRequest = await prisma.budgetRequest.update({
            where: { id: id as string },
            data: {
                status: 'approved',
                approverId,
                approvedAt: new Date()
            }
        });

        const categoryUpdates: Record<string, number> = {};

        if (items.length === 0) {
            categoryUpdates[request.category] = request.amount;
        } else {
            items.forEach((item: any) => {
                const catName = item.category || request.category;
                categoryUpdates[catName] = (categoryUpdates[catName] || 0) + item.total;
            });
        }

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
};

export const rejectRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { approverId, reason } = req.body;

    try {
        const request = await prisma.budgetRequest.update({
            where: { id: id as string },
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
};

export const submitExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { expenseItems, actualTotal, returnAmount } = req.body;

    try {
        const request = await prisma.budgetRequest.findUnique({ where: { id: id as string } });
        if (!request) return res.status(404).json({ error: 'Request not found' });

        const updatedRequest = await prisma.budgetRequest.update({
            where: { id: id as string },
            data: {
                status: 'waiting_verification',
                actualAmount: actualTotal,
                returnAmount: returnAmount,
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
};

export const rejectExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    try {
        const request = await prisma.budgetRequest.update({
            where: { id: id as string },
            data: {
                status: 'approved',
                rejectionReason: reason
            }
        });

        await logActivity(null, 'REJECT_EXPENSE_REPORT', { requestId: id, reason }, req);
        res.json(request);
    } catch (error) {
        console.error("Error rejecting expense report:", error);
        res.status(500).json({ error: 'Failed to send back for revision' });
    }
};

export const completeRequest = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id: id as string },
            include: { expenseItems: true }
        }) as BudgetRequestWithItems | null;

        if (!request) return res.status(404).json({ error: 'Request not found' });

        const updatedRequest = await prisma.budgetRequest.update({
            where: { id: id as string },
            data: {
                status: 'completed',
                completedAt: new Date(),
            }
        });

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
                } else {
                    console.warn(`Could not resolve category for item: ${item.description}, cat: ${catName}`);
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

            if (netChange === 0) continue;

            const category = stats.category;

            if (netChange < 0) {
                const returnAmount = Math.abs(netChange);
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { decrement: returnAmount } }
                });

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
                const extraAmount = netChange;
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { increment: extraAmount } }
                });

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

        const returnAmount = request.returnAmount || 0;
        await logActivity(null, 'VERIFY_AND_COMPLETE_REQUEST', { requestId: id, returnAmount }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error completing request:", error);
        res.status(500).json({ error: 'Failed to verify and complete request' });
    }
};

export const revertCompleteRequest = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const request = await prisma.budgetRequest.findUnique({
            where: { id: id as string },
            include: { expenseItems: true }
        }) as BudgetRequestWithItems | null;

        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (request.status !== 'completed') {
            return res.status(400).json({ error: 'Request is not completed' });
        }

        const updatedRequest = await prisma.budgetRequest.update({
            where: { id: id as string },
            data: {
                status: 'waiting_verification',
                completedAt: null
            }
        });

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

            if (netChange === 0) continue;

            const category = stats.category;

            if (netChange < 0) {
                const returnAmount = Math.abs(netChange);
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { increment: returnAmount } }
                });

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
                const extraAmount = netChange;
                await prisma.category.update({
                    where: { id: category.id },
                    data: { used: { decrement: extraAmount } }
                });

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
};

export const deleteRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.budgetRequest.delete({ where: { id: id as string } });
    res.json({ success: true });
};

// --- Budget Plans ---

export const getBudgetPlans = async (req: Request, res: Response) => {
    const { year } = req.query;
    const where = year ? { year: parseInt(year as string) } : {};
    const plans = await prisma.budgetPlan.findMany({ where });
    res.json(plans);
};

export const updateBudgetPlan = async (req: Request, res: Response) => {
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
};
