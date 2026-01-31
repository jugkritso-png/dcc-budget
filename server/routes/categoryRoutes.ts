import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

router.post('/', async (req, res) => {
    try {
        const category = await prisma.category.create({ data: req.body });
        res.json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name: newName } = req.body;

    try {
        // 1. Get current category to check for name change
        const currentCategory = await prisma.category.findUnique({ where: { id } });
        if (!currentCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const oldName = currentCategory.name;

        // 2. Update category
        const category = await prisma.category.update({
            where: { id },
            data: req.body,
        });

        // 3. If name changed, update all related BudgetRequests (since they link by name string)
        if (newName && newName !== oldName) {
            await prisma.budgetRequest.updateMany({
                where: { category: oldName },
                data: { category: newName }
            });
            console.log(`Updated BudgetRequests from '${oldName}' to '${newName}'`);
        }

        res.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
});

// Adjust budget
router.post('/:id/adjust', async (req, res) => {
    const { id } = req.params;
    const { amount, type, reason, user } = req.body;

    try {
        // 1. Create Log
        await prisma.budgetLog.create({
            data: {
                categoryId: id,
                amount: parseFloat(amount),
                type,
                reason,
                user
            }
        });

        // 2. Update Category allocated amount
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        let newAllocated = category.allocated;
        const adjustAmount = parseFloat(amount);

        if (type === 'ADD' || type === 'TRANSFER_IN') {
            newAllocated += adjustAmount;
        } else if (type === 'REDUCE' || type === 'TRANSFER_OUT') {
            newAllocated -= adjustAmount;
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { allocated: newAllocated }
        });

        res.json(updatedCategory);
    } catch (error) {
        console.error('Error adjusting budget:', error);
        res.status(500).json({ error: 'Failed to adjust budget' });
    }
});

// Get budget logs
router.get('/:id/logs', async (req, res) => {
    const { id } = req.params;
    try {
        const logs = await prisma.budgetLog.findMany({
            where: { categoryId: id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Get expenses for category
router.get('/:id/expenses', async (req, res) => {
    const { id } = req.params;
    const expenses = await prisma.expense.findMany({
        where: { categoryId: id },
        orderBy: { date: 'desc' },
    });
    res.json(expenses);
});

export default router;
