import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const listCategories = async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
    const category = await prisma.category.create({ data: req.body });
    res.json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name: newName } = req.body;

    // 1. Get current category to check for name change
    const currentCategory = await prisma.category.findUnique({ where: { id: id as string } });
    if (!currentCategory) {
        return res.status(404).json({ error: 'Category not found' });
    }
    const oldName = currentCategory.name;

    // 2. Update category
    const category = await prisma.category.update({
        where: { id: id as string },
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
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: id as string } });
    res.json({ success: true });
};

export const adjustBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount, type, reason, user } = req.body;

    // 1. Create Log
    await prisma.budgetLog.create({
        data: {
            categoryId: id as string,
            amount: parseFloat(amount),
            type,
            reason,
            user
        }
    });

    // 2. Update Category allocated amount
    const category = await prisma.category.findUnique({ where: { id: id as string } });
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
        where: { id: id as string },
        data: { allocated: newAllocated }
    });

    res.json(updatedCategory);
};

export const getBudgetLogs = async (req: Request, res: Response) => {
    const { id } = req.params;
    const logs = await prisma.budgetLog.findMany({
        where: { categoryId: id as string },
        orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
};

export const getExpenses = async (req: Request, res: Response) => {
    const { id } = req.params;
    const expenses = await prisma.expense.findMany({
        where: { categoryId: id as string },
        orderBy: { date: 'desc' },
    });
    res.json(expenses);
};
