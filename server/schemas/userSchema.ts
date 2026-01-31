import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(4, 'Password must be at least 4 characters'), // Weak password policy for now as requested
        name: z.string().min(1, 'Name is required'),
        role: z.enum(['admin', 'user']),
        department: z.string().optional(),
        position: z.string().optional(),
        email: z.string().email().optional().or(z.literal('')),
    })
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        name: z.string().optional(),
        role: z.enum(['admin', 'user']).optional(),
        department: z.string().optional(),
        position: z.string().optional(),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        bio: z.string().optional(),
        theme: z.enum(['light', 'dark', 'system']).optional(),
        language: z.enum(['th', 'en']).optional(),
    })
});

export const changePasswordSchema = z.object({
    body: z.object({
        userId: z.string().uuid(),
        currentPassword: z.string().min(1),
        newPassword: z.string().min(4)
    })
});
