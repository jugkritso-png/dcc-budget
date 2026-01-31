import { z } from 'zod';

const expenseItemSchema = z.object({
    category: z.enum(['compensation', 'operating', 'materials', 'utilities', 'equipment', 'other']),
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    unit: z.string().min(1),
    total: z.number().positive(),
});

export const createRequestSchema = z.object({
    body: z.object({
        project: z.string().min(1),
        category: z.string().min(1),
        activity: z.string().min(1),
        amount: z.number().positive(),
        date: z.string(), // Could check regex for YYYY-MM-DD
        status: z.enum(['draft', 'pending', 'approved', 'rejected']).optional(),
        requester: z.string().min(1),
        notes: z.string().optional(),
        department: z.string().optional(),
        expenseItems: z.array(expenseItemSchema).optional(),
    })
});

export const updateRequestStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        status: z.enum(['approved', 'pending', 'rejected', 'draft'])
    })
});
