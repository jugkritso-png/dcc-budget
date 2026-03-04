import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { categoryId, amount, payee, date, description } = req.body;
    const expenseAmount = parseFloat(amount);

    try {
        // 1. Create Expense
        const { data: expense, error: createError } = await supabase.from('Expense').insert({
            categoryId,
            amount: expenseAmount,
            payee,
            date,
            description,
        }).select().single();

        if (createError) throw createError;

        // 2. Update Category used amount
        const { data: category } = await supabase.from('Category').select('used').eq('id', categoryId).maybeSingle();
        if (category) {
            await supabase.from('Category').update({
                used: (category.used || 0) + expenseAmount
            }).eq('id', categoryId);
        }

        res.json(expense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    try {
        // 1. Get expense to know amount
        const { data: expense } = await supabase.from('Expense').select('*').eq('id', id).maybeSingle();
        if (!expense) return res.status(404).json({ error: 'Expense not found' });

        // 2. Delete expense
        const { error: deleteError } = await supabase.from('Expense').delete().eq('id', id);
        if (deleteError) throw deleteError;

        // 3. Revert Category used amount
        const { data: category } = await supabase.from('Category').select('used').eq('id', expense.categoryId).maybeSingle();
        if (category) {
            await supabase.from('Category').update({
                used: (category.used || 0) - expense.amount
            }).eq('id', expense.categoryId);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

export default router;
