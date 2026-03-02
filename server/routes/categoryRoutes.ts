import express from 'express';
import { supabase } from '../lib/supabase';
import validate from '../middleware/validateResource';
import { createCategorySchema, updateCategorySchema, budgetAdjustSchema } from '../schemas/masterDataSchema';

const router = express.Router();

router.get('/', async (req, res) => {
    const { data: categories, error } = await supabase.from('Category').select('*');
    if (error) return res.status(500).json({ error: 'Failed to fetch categories' });
    res.json(categories || []);
});

router.post('/', validate(createCategorySchema), async (req, res) => {
    const { data: category, error } = await supabase.from('Category').insert(req.body).select().single();
    if (error) return res.status(500).json({ error: 'Failed to create category' });
    res.json(category);
});

router.put('/:id', validate(updateCategorySchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const { name: newName } = req.body;

    // 1. Get current category to check for name change
    const { data: currentCategory, error: findError } = await supabase.from('Category').select('name').eq('id', id).maybeSingle();
    if (findError || !currentCategory) {
        return res.status(404).json({ error: 'Category not found' });
    }
    const oldName = currentCategory.name;

    // 2. Update category
    const { data: category, error: updateError } = await supabase.from('Category').update(req.body).eq('id', id).select().single();
    if (updateError) return res.status(500).json({ error: 'Failed to update category' });

    // 3. If name changed, update all related BudgetRequests (since they link by name string)
    if (newName && newName !== oldName) {
        await supabase.from('BudgetRequest').update({ category: newName }).eq('category', oldName);
        console.log(`Updated BudgetRequests from '${oldName}' to '${newName}'`);
    }

    res.json(category);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const { error } = await supabase.from('Category').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete category' });
    res.json({ success: true });
});

// Adjust budget
router.post('/:id/adjust', validate(budgetAdjustSchema), async (req, res) => {
    const { id } = req.params as { id: string };
    const { amount, type, reason, user } = req.body;

    // 1. Create Log
    await supabase.from('BudgetLog').insert({
        categoryId: id,
        amount: parseFloat(amount),
        type,
        reason,
        user
    });

    // 2. Update Category allocated amount
    const { data: category, error: findError } = await supabase.from('Category').select('allocated').eq('id', id).maybeSingle();
    if (findError || !category) {
        return res.status(404).json({ error: 'Category not found' });
    }

    let newAllocated = category.allocated;
    const adjustAmount = parseFloat(amount);

    if (type === 'ADD' || type === 'TRANSFER_IN') {
        newAllocated += adjustAmount;
    } else if (type === 'REDUCE' || type === 'TRANSFER_OUT') {
        newAllocated -= adjustAmount;
    }

    const { data: updatedCategory, error: updateError } = await supabase.from('Category').update({ allocated: newAllocated }).eq('id', id).select().single();
    if (updateError) return res.status(500).json({ error: 'Failed to adjust budget' });

    res.json(updatedCategory);
});

// Get budget logs
router.get('/:id/logs', async (req, res) => {
    const { id } = req.params as { id: string };
    const { data: logs, error } = await supabase.from('BudgetLog').select('*').eq('categoryId', id).order('createdAt', { ascending: false });
    if (error) return res.status(500).json({ error: 'Failed to fetch budget logs' });
    res.json(logs || []);
});

// Get expenses for category
router.get('/:id/expenses', async (req, res) => {
    const { id } = req.params as { id: string };
    const { data: expenses, error } = await supabase.from('Expense').select('*').eq('categoryId', id).order('date', { ascending: false });
    if (error) return res.status(500).json({ error: 'Failed to fetch expenses' });
    res.json(expenses || []);
});

export default router;
