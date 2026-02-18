import express from 'express';
import prisma from '../lib/prisma';
import validate from '../middleware/validateResource';
import { createCategorySchema, updateCategorySchema, budgetAdjustSchema } from '../schemas/masterDataSchema';

const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

router.post('/', validate(createCategorySchema), async (req, res) => {
    const category = await prisma.category.create({ data: req.body });
    res.json(category);
});

router.put('/:id', validate(updateCategorySchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const { name: newName } = req.body;

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
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
});

// Adjust budget
router.post('/:id/adjust', validate(budgetAdjustSchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const { amount, type, reason, user } = req.body;

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
});

// Get budget logs
router.get('/:id/logs', async (req, res) => {
    const { id } = req.params as { id: string };
    const logs = await prisma.budgetLog.findMany({
        where: { categoryId: id },
        orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
});

// Get expenses for category
router.get('/:id/expenses', async (req, res) => {
    const { id } = req.params as { id: string };
    const expenses = await prisma.expense.findMany({
        where: { categoryId: id },
        orderBy: { date: 'desc' },
    });
    res.json(expenses);
});

export default router;
