import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(4, 'Password must be at least 4 characters'), // Weak password policy for now as requested
        name: z.string().min(1, 'Name is required'),
        role: z.string(),
        department: z.string().optional(),
        position: z.string().optional(),
        email: z.string().email('Invalid email format'),
    })
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        name: z.string().optional(),
        role: z.string().optional(),
        department: z.string().optional(),
        position: z.string().optional(),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        bio: z.string().optional(),
        englishName: z.string().optional(),
        startDate: z.string().optional(),
        theme: z.enum(['light', 'dark', 'system', 'blue', 'green', 'purple', 'orange', 'red']).optional(),
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
