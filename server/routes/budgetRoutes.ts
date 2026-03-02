import express from 'express';
import { supabase } from '../lib/supabase';
import { logActivity } from '../utils/logger';
import validate from '../middleware/validateResource';
import { createRequestSchema, updateRequestStatusSchema } from '../schemas/budgetRequestSchema';
import { createSubActivitySchema, updateSubActivitySchema } from '../schemas/masterDataSchema';
import { authenticateToken, requirePermission } from '../middleware/authMiddleware';

const router = express.Router();

// --- SubActivities ---
router.get('/sub-activities', async (req, res) => {
    // Note: To mimic prisma include: { children: true }, we fetch all and build hierarchy
    const { data: subActivities, error } = await supabase.from('SubActivity').select('*');
    if (error) return res.status(500).json({ error: 'Failed to fetch sub-activities' });

    const subs = subActivities || [];
    const buildHierarchy = (parentId: string | null) => {
        return subs.filter(sub => sub.parentId === parentId).map(sub => ({
            ...sub,
            children: buildHierarchy(sub.id)
        }));
    };

    res.json(buildHierarchy(null));
});

router.post('/sub-activities', validate(createSubActivitySchema), async (req, res) => {
    try {
        console.log("[POST /sub-activities] Body:", req.body);
        const { data: sub, error } = await supabase.from('SubActivity').insert(req.body).select().single();
        if (error) throw error;
        console.log("[POST /sub-activities] Created:", sub);
        res.json(sub);
    } catch (error) {
        console.error("[POST /sub-activities] Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) });
    }
});

router.put('/sub-activities/:id', validate(updateSubActivitySchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const { id: _, createdAt, updatedAt, children, childrenList, used, ...updateData } = req.body;

    const { data: sub, error } = await supabase.from('SubActivity').update(updateData).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: 'Failed to update sub-activity' });
    res.json(sub);
});

router.delete('/sub-activities/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const { error } = await supabase.from('SubActivity').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete sub-activity' });
    res.json({ success: true });
});

// --- Budget Requests ---
router.get('/requests', async (req, res) => {
    const { data: requests, error } = await supabase
        .from('BudgetRequest')
        .select('*, expenseItems:BudgetRequestItem(*)')
        .order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: 'Failed to fetch requests' });
    res.json(requests || []);
});

router.post('/requests', validate(createRequestSchema), async (req, res) => {
    const { expenseItems, ...rest } = req.body;

    // Budget Check for Sub-Activity
    if (rest.subActivityId) {
        const { data: sub } = await supabase.from('SubActivity').select('*').eq('id', rest.subActivityId).single();

        if (sub) {
            // Memory aggregation since Supabase JS lacks easy aggregate sum wrapper
            const { data: reqs } = await supabase.from('BudgetRequest')
                .select('amount, returnAmount')
                .eq('subActivityId', rest.subActivityId)
                .neq('status', 'rejected');

            const totalAmount = (reqs || []).reduce((sum, r) => sum + (r.amount || 0), 0);
            const totalReturn = (reqs || []).reduce((sum, r) => sum + (r.returnAmount || 0), 0);

            const used = totalAmount - totalReturn;
            const requestedAmount = rest.amount;

            if (used + requestedAmount > sub.allocated) {
                return res.status(400).json({
                    error: `งบประมาณไม่เพียงพอสำหรับกิจกรรมย่อย "${sub.name}" (คงเหลือ: ${(sub.allocated - used).toLocaleString()} บาท, ขอ: ${requestedAmount.toLocaleString()} บาท)`
                });
            }
        }
    }

    try {
        // 1. Create Request
        const { data: request, error: reqError } = await supabase.from('BudgetRequest').insert(rest).select().single();
        if (reqError) throw reqError;

        // 2. Create Expense Items
        let createdItems = [];
        if (expenseItems && expenseItems.length > 0) {
            const itemsToInsert = expenseItems.map((item: any) => ({ ...item, requestId: request.id }));
            const { data: items, error: itemError } = await supabase.from('BudgetRequestItem').insert(itemsToInsert).select();
            if (itemError) throw itemError;
            createdItems = items || [];
        }

        request.expenseItems = createdItems;

        // Log Activity
        const { data: user } = await supabase.from('User').select('id').eq('name', rest.requester).maybeSingle();
        await logActivity(user?.id || null, 'CREATE_REQUEST', { requestId: request.id, project: request.project, amount: request.amount }, req);

        res.json(request);
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

router.put('/requests/:id/status', validate(updateRequestStatusSchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    const { data: request, error } = await supabase.from('BudgetRequest').update({ status }).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: 'Failed to update request status' });

    await logActivity(null, 'UPDATE_REQUEST_STATUS', { requestId: id, status }, req);
    res.json(request);
});

// Approve Request
router.put('/requests/:id/approve', requirePermission('approve_budget'), async (req, res) => {
    const { id } = req.params as { id: string };
    const { approverId } = req.body as { approverId: string };

    try {
        const { data: request, error: reqError } = await supabase.from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').eq('id', id).single();
        if (reqError || !request) return res.status(404).json({ error: 'Request not found' });

        const items = request.expenseItems || [];

        // 1. Update Request Status
        const { data: updatedRequest, error: updateError } = await supabase.from('BudgetRequest').update({
            status: 'approved',
            approverId,
            approvedAt: new Date().toISOString()
        }).eq('id', id).select().single();

        if (updateError) throw updateError;

        // 2. Update Budget Category Usage (Per Item Category)
        const categoryUpdates: Record<string, number> = {};

        if (items.length === 0) {
            categoryUpdates[request.category] = request.amount;
        } else {
            items.forEach((item: any) => {
                const catName = item.category || request.category;
                categoryUpdates[catName] = (categoryUpdates[catName] || 0) + item.total;
            });
        }

        // Execute Updates
        for (const [catName, amount] of Object.entries(categoryUpdates)) {
            const { data: category } = await supabase.from('Category')
                .select('*')
                .eq('name', catName)
                .eq('year', new Date().getFullYear() + 543)
                .maybeSingle();

            if (category) {
                await supabase.from('Category').update({ used: (category.used || 0) + amount }).eq('id', category.id);
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
        const { data: request, error } = await supabase.from('BudgetRequest').update({
            status: 'rejected',
            approverId,
            approvedAt: new Date().toISOString(),
            rejectionReason: reason
        }).eq('id', id).select().single();

        if (error) throw error;

        await logActivity(approverId, 'REJECT_REQUEST', { requestId: id, reason }, req);
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject request' });
    }
});

// Submit Expense Report (User Action)
router.put('/requests/:id/submit-expense', async (req, res) => {
    const { id } = req.params as { id: string };
    const { expenseItems, actualTotal, returnAmount } = req.body;

    try {
        const { data: request } = await supabase.from('BudgetRequest').select('id').eq('id', id).maybeSingle();
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // Update Request with Actuals
        const { data: updatedRequest, error: updateReqError } = await supabase.from('BudgetRequest').update({
            status: 'waiting_verification',
            actualAmount: actualTotal,
            returnAmount: returnAmount,
        }).eq('id', id).select().single();

        if (updateReqError) throw updateReqError;

        // Upsert expenseItems
        if (expenseItems && expenseItems.length > 0) {
            const itemsToUpdate = expenseItems.filter((item: any) => item.id && !item.id.startsWith('temp-')).map((item: any) => ({
                id: item.id,
                actualAmount: item.actualAmount || 0,
                // Preserving required fields is sometimes needed for upsert, but update is cleaner here
            }));

            // Supabase updateMany isn't atomic per record unless using RPC or doing multiple awaits
            for (const item of itemsToUpdate) {
                await supabase.from('BudgetRequestItem').update({ actualAmount: item.actualAmount }).eq('id', item.id);
            }

            const itemsToCreate = expenseItems.filter((item: any) => !item.id || item.id.startsWith('temp-')).map((item: any) => ({
                requestId: id,
                category: item.category || 'other',
                description: item.description,
                quantity: parseFloat(item.quantity) || 1,
                unit: item.unit || 'หน่วย',
                unitPrice: parseFloat(item.actualAmount) || 0,
                total: 0,
                actualAmount: parseFloat(item.actualAmount) || 0
            }));

            if (itemsToCreate.length > 0) {
                await supabase.from('BudgetRequestItem').insert(itemsToCreate);
            }
        }

        const { data: finalReq } = await supabase.from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').eq('id', id).single();

        await logActivity(null, 'SUBMIT_EXPENSE_REPORT', { requestId: id, actualTotal }, req);
        res.json(finalReq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit expense report' });
    }
});

// Send Back for Revision (Manager Action)
router.put('/requests/:id/reject-expense', async (req, res) => {
    const { id } = req.params as { id: string };
    const { reason } = req.body;

    try {
        const { data: request, error } = await supabase.from('BudgetRequest').update({
            status: 'approved',
            rejectionReason: reason
        }).eq('id', id).select().single();

        if (error) throw error;
        await logActivity(null, 'REJECT_EXPENSE_REPORT', { requestId: id, reason }, req);
        res.json(request);
    } catch (error) {
        console.error("Error rejecting expense report:", error);
        res.status(500).json({ error: 'Failed to send back for revision' });
    }
});

// Complete/Verify Request (Manager Action)
router.put('/requests/:id/complete', async (req, res) => {
    const { id } = req.params as { id: string };

    try {
        const { data: request } = await supabase.from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').eq('id', id).single();
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // 1. Update Request to Completed
        const { data: updatedRequest, error: completeError } = await supabase.from('BudgetRequest').update({
            status: 'completed',
            completedAt: new Date().toISOString(),
        }).eq('id', id).select().single();

        if (completeError) throw completeError;

        const requestYear = new Date().getFullYear() + 543;
        const { data: allCategories } = await supabase.from('Category').select('*').eq('year', requestYear);
        const categoryMap = new Map((allCategories || []).map(c => [c.name, c]));

        const resolveCategory = (name: string): any => {
            if (categoryMap.has(name)) return categoryMap.get(name);
            return categoryMap.get(request.category);
        };

        const categoryStats: Record<string, { allocated: number, actual: number, category: any }> = {};
        const initCat = (category: any) => {
            if (!categoryStats[category.id]) categoryStats[category.id] = { allocated: 0, actual: 0, category };
        };

        if (request.expenseItems && request.expenseItems.length > 0) {
            request.expenseItems.forEach((item: any) => {
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
                // RETURN Funds
                const returnAmount = Math.abs(netChange);
                await supabase.from('Category').update({ used: (category.used || 0) - returnAmount }).eq('id', category.id);
                await supabase.from('BudgetLog').insert({
                    categoryId: category.id,
                    amount: returnAmount,
                    type: 'REDUCE',
                    reason: `คืนงบประมาณส่วนเหลืองาน: ${request.project} (${category.name})`,
                    user: 'System'
                });
            } else {
                // CHARGE Funds
                const extraAmount = netChange;
                await supabase.from('Category').update({ used: (category.used || 0) + extraAmount }).eq('id', category.id);
                await supabase.from('BudgetLog').insert({
                    categoryId: category.id,
                    amount: extraAmount,
                    type: 'ADD',
                    reason: `ตัดงบประมาณเพิ่ม (เกินงบ): ${request.project} (${category.name})`,
                    user: 'System'
                });
            }
        }

        // 3. Create Expense Records
        if (request.expenseItems && request.expenseItems.length > 0) {
            for (const item of request.expenseItems) {
                if ((item.actualAmount || 0) > 0) {
                    const category = resolveCategory(item.category || request.category);
                    if (category) {
                        await supabase.from('Expense').insert({
                            categoryId: category.id,
                            amount: item.actualAmount || 0,
                            payee: request.requester,
                            date: new Date().toISOString(),
                            description: `[${request.project}] ${item.description}`
                        });
                    }
                }
            }
        } else if (request.actualAmount && request.actualAmount > 0) {
            const category = resolveCategory(request.category);
            if (category) {
                await supabase.from('Expense').insert({
                    categoryId: category.id,
                    amount: request.actualAmount,
                    payee: request.requester,
                    date: new Date().toISOString(),
                    description: `[${request.project}] Project Expense`
                });
            }
        }

        await logActivity(null, 'VERIFY_AND_COMPLETE_REQUEST', { requestId: id, returnAmount: request.returnAmount || 0 }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error completing request:", error);
        res.status(500).json({ error: 'Failed to verify and complete request' });
    }
});

// Revert Complete (Manager Action)
router.put('/requests/:id/revert-complete', async (req, res) => {
    const { id } = req.params as { id: string };

    try {
        const { data: request } = await supabase.from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').eq('id', id).single();
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (request.status !== 'completed') {
            return res.status(400).json({ error: 'Request is not completed' });
        }

        const { data: updatedRequest } = await supabase.from('BudgetRequest').update({
            status: 'waiting_verification',
            completedAt: null
        }).eq('id', id).select().single();

        const requestYear = new Date().getFullYear() + 543;
        const { data: allCategories } = await supabase.from('Category').select('*').eq('year', requestYear);
        const categoryMap = new Map((allCategories || []).map(c => [c.name, c]));

        const resolveCategory = (name: string): any => {
            if (categoryMap.has(name)) return categoryMap.get(name);
            return categoryMap.get(request.category);
        };

        const categoryStats: Record<string, { allocated: number, actual: number, category: any }> = {};
        const initCat = (category: any) => {
            if (!categoryStats[category.id]) categoryStats[category.id] = { allocated: 0, actual: 0, category };
        };

        if (request.expenseItems && request.expenseItems.length > 0) {
            request.expenseItems.forEach((item: any) => {
                const category = resolveCategory(item.category || request.category);
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
                await supabase.from('Category').update({ used: (category.used || 0) + returnAmount }).eq('id', category.id);
                await supabase.from('BudgetLog').insert({
                    categoryId: category.id,
                    amount: returnAmount,
                    type: 'ADD',
                    reason: `ยกเลิกการปิดโครงการ (ดึงเงินคืนกลับ): ${request.project} (${category.name})`,
                    user: 'System'
                });
            } else {
                const extraAmount = netChange;
                await supabase.from('Category').update({ used: (category.used || 0) - extraAmount }).eq('id', category.id);
                await supabase.from('BudgetLog').insert({
                    categoryId: category.id,
                    amount: extraAmount,
                    type: 'REDUCE',
                    reason: `ยกเลิกการปิดโครงการ (คืนยอดตัดเกิน): ${request.project} (${category.name})`,
                    user: 'System'
                });
            }
        }

        await supabase.from('Expense').delete().like('description', `[${request.project}]%`);

        await logActivity(null, 'REVERT_COMPLETE_REQUEST', { requestId: id, returnAmount: request.returnAmount || 0 }, req);
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error reverting request:", error);
        res.status(500).json({ error: 'Failed to revert completion' });
    }
});

router.delete('/requests/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const { error } = await supabase.from('BudgetRequest').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete request' });
    res.json({ success: true });
});

// --- Budget Plans ---
router.get('/budget-plans', async (req, res) => {
    const { year } = req.query;
    let query = supabase.from('BudgetPlan').select('*');
    if (year) {
        query = query.eq('year', parseInt(year as string));
    }
    const { data: plans, error } = await query;
    if (error) return res.status(500).json({ error: 'Failed to fetch budget plans' });
    res.json(plans || []);
});

router.post('/budget-plans', async (req, res) => {
    const { subActivityId, year, month, amount } = req.body;

    // Check if exists
    const { data: existing } = await supabase.from('BudgetPlan').select('id')
        .eq('subActivityId', subActivityId).eq('year', parseInt(year)).eq('month', parseInt(month))
        .maybeSingle();

    let plan;
    if (existing) {
        const { data } = await supabase.from('BudgetPlan').update({ amount: parseFloat(amount) }).eq('id', existing.id).select().single();
        plan = data;
    } else {
        const { data } = await supabase.from('BudgetPlan').insert({
            subActivityId,
            year: parseInt(year),
            month: parseInt(month),
            amount: parseFloat(amount)
        }).select().single();
        plan = data;
    }

    await logActivity(null, 'UPDATE_BUDGET_PLAN', { subActivityId, year, month, amount }, req);
    res.json(plan);
});

export default router;
