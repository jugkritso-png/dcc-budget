import { z } from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        segment: z.string(),
        allocated: z.number(),
        color: z.string().optional(),
        year: z.number().int(),
    })
});

export const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        code: z.string().min(1).optional(),
        segment: z.string().optional(),
        allocated: z.number().optional(),
        color: z.string().optional(),
        year: z.number().int().optional(),
    })
});

export const createSubActivitySchema = z.object({
    body: z.object({
        id: z.string().optional(), // Allow ID if provided
        categoryId: z.string().min(1),
        name: z.string().min(1),
        allocated: z.number(),
        parentId: z.string().optional()
    })
});

export const updateSubActivitySchema = z.object({
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        allocated: z.number().optional(),
        parentId: z.string().optional()
    })
});

export const createDepartmentSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        color: z.string().optional()
    })
});

export const budgetAdjustSchema = z.object({
    body: z.object({
        amount: z.number().positive(),
        type: z.enum(['ADD', 'TRANSFER_IN', 'TRANSFER_OUT', 'REDUCE']),
        reason: z.string().min(1),
        user: z.string().optional()
    })
});
