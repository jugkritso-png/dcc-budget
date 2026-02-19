import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createExpense = async (req: Request, res: Response) => {
    const { categoryId, amount, payee, date, description } = req.body;
    const expenseAmount = parseFloat(amount);

    try {
        // 1. Create Expense
        const expense = await prisma.expense.create({
            data: {
                categoryId,
                amount: expenseAmount,
                payee,
                date,
                description,
            },
        });

        // 2. Update Category used amount
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (category) {
            await prisma.category.update({
                where: { id: categoryId },
                data: { used: category.used + expenseAmount },
            });
        }

        res.json(expense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // 1. Get expense to know amount
        const expense = await prisma.expense.findUnique({ where: { id: id as string } });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });

        // 2. Delete expense
        await prisma.expense.delete({ where: { id: id as string } });

        // 3. Revert Category used amount
        const category = await prisma.category.findUnique({ where: { id: expense.categoryId } });
        if (category) {
            await prisma.category.update({
                where: { id: expense.categoryId },
                data: { used: category.used - expense.amount },
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};
