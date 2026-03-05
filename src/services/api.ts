import { createClient } from '../lib/supabase/client';
const supabase = createClient();
import {
    BudgetRequest,
    Category,
    SubActivity,
    SystemSettings,
    Department,
    Expense,
    User,
    BudgetPlan,
    BudgetLog
} from '../types';

export const authService = {
    login: async (credentials: { username: string; password: string }) => {
        const cleanUsername = credentials.username.trim();
        const cleanPassword = credentials.password; // Do not trim password
        let email = cleanUsername.includes('@') ? cleanUsername : '';

        console.log('[Login] 1. Username input:', `"${cleanUsername}"`);

        if (!email) {
            console.log('[Login] 2. Resolving email via RPC for:', cleanUsername);
            const { data: resolvedEmail, error: rpcError } = await supabase.rpc('get_user_email', { p_username: cleanUsername });
            console.log('[Login] 3. RPC Result:', resolvedEmail, 'RPC Error:', rpcError);

            if (!rpcError && resolvedEmail) {
                email = resolvedEmail;
            } else {
                email = `${cleanUsername}@wu.ac.th`; // Fallback
            }
        }

        console.log('[Login] 4. Sign-in email:', `"${email}"`);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: cleanPassword,
        });

        if (error) {
            console.error('[Login] 5. Supabase Auth Error:', error.message, 'Code:', error.status);
            throw new Error(error.message);
        }

        console.log('[Login] 6. Success! User ID:', data.user?.id);

        console.log('[Login] Sign-in successful for user:', data.user?.email);

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from('User')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

        if (profileError) {
            console.error('[Login] Profile fetch error:', profileError.message, profileError.code);
        }
        console.log('[Login] Profile result:', profile);

        return {
            user: (profile || { id: data.user.id, email: data.user.email, role: 'user', username: credentials.username, name: credentials.username, position: '', department: '' }) as User,
            token: data.session.access_token
        };
    },

    loginWithGoogle: async (token: string) => {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: token
        });
        if (error) throw new Error(error.message);

        const { data: profile } = await supabase
            .from('User')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

        return {
            user: (profile || { id: data.user.id, email: data.user.email, role: 'user' }) as User,
            token: data.session.access_token
        };
    },

    updateProfile: async (id: string, updateData: Partial<User>) => {
        const { data, error } = await supabase.from('User').update(updateData).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data as User;
    },

    changePassword: async (data: any) => {
        const { error } = await supabase.auth.updateUser({ password: data.newPassword });
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

export const userService = {
    getAll: async () => {
        const { data, error } = await supabase.from('User').select('*').order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as User[];
    },
    create: async (user: Partial<User>) => {
        const { data, error } = await supabase.from('User').insert(user).select().single();
        if (error) throw new Error(error.message);
        return data as User;
    },
    update: async (id: string, user: Partial<User>) => {
        const { data, error } = await supabase.from('User').update(user).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data as User;
    },
    delete: async (id: string) => {
        const { error } = await supabase.from('User').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

export const systemService = {
    getSettings: async () => {
        const { data, error } = await supabase.from('SystemSetting').select('*');
        if (error) throw new Error(error.message);

        const settingsObj = (data || []).reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return {
            orgName: settingsObj['ORG_NAME'] || 'DCC Company Ltd.',
            fiscalYear: parseInt(settingsObj['FISCAL_YEAR'] || '2569'),
            overBudgetAlert: settingsObj['OVER_BUDGET_ALERT'] === 'true',
            fiscalYearCutoff: settingsObj['FISCAL_YEAR_CUTOFF'] || '2026-09-30',
            permissions: settingsObj['PERMISSIONS'] ? JSON.parse(settingsObj['PERMISSIONS']) : {}
        } as SystemSettings;
    },
    updateSettings: async (settings: SystemSettings) => {
        const upsert = async (key: string, value: string) => {
            const { error } = await supabase.from('SystemSetting').upsert({ key, value });
            if (error) throw new Error(error.message);
        };
        await upsert('ORG_NAME', settings.orgName);
        await upsert('FISCAL_YEAR', settings.fiscalYear.toString());
        await upsert('OVER_BUDGET_ALERT', String(settings.overBudgetAlert));
        await upsert('FISCAL_YEAR_CUTOFF', settings.fiscalYearCutoff);
        if (settings.permissions) {
            await upsert('PERMISSIONS', JSON.stringify(settings.permissions));
        }
        return { success: true };
    },

    getDepartments: async () => {
        const { data, error } = await supabase.from('Department').select('*');
        if (error) throw new Error(error.message);
        return data as Department[];
    },
    createDepartment: async (dept: Department) => {
        const { data, error } = await supabase.from('Department').insert(dept).select().single();
        if (error) throw new Error(error.message);
        return data as Department;
    },
    updateDepartment: async (dept: Department) => {
        const { data, error } = await supabase.from('Department').update(dept).eq('id', dept.id).select().single();
        if (error) throw new Error(error.message);
        return data as Department;
    },
    deleteDepartment: async (id: string) => {
        const { error } = await supabase.from('Department').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

export const masterDataService = {
    getCategories: async () => {
        const { data, error } = await supabase.from('Category').select('*');
        if (error) throw new Error(error.message);
        return data as Category[];
    },
    createCategory: async (cat: Category) => {
        const { data, error } = await supabase.from('Category').insert(cat).select().single();
        if (error) throw new Error(error.message);
        return data as Category;
    },
    updateCategory: async (cat: Category) => {
        const { data, error } = await supabase.from('Category').update(cat).eq('id', cat.id).select().single();
        if (error) throw new Error(error.message);
        return data as Category;
    },
    deleteCategory: async (id: string) => {
        const { error } = await supabase.from('Category').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },

    getSubActivities: async () => {
        const { data, error } = await supabase.from('SubActivity').select('*');
        if (error) throw new Error(error.message);

        const subs = data || [];
        const buildHierarchy = (parentId: string | null): any[] => {
            return subs.filter((sub: any) => sub.parentId === parentId).map((sub: any) => ({
                ...sub,
                children: buildHierarchy(sub.id)
            }));
        };
        return buildHierarchy(null) as SubActivity[];
    },
    createSubActivity: async (sub: SubActivity) => {
        const { data, error } = await supabase.from('SubActivity').insert(sub).select().single();
        if (error) throw new Error(error.message);
        return data as SubActivity;
    },
    updateSubActivity: async (sub: SubActivity) => {
        const { data, error } = await supabase.from('SubActivity').update(sub).eq('id', sub.id).select().single();
        if (error) throw new Error(error.message);
        return data as SubActivity;
    },
    deleteSubActivity: async (id: string) => {
        const { error } = await supabase.from('SubActivity').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

export const budgetService = {
    getRequests: async () => {
        const { data, error } = await supabase.from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as BudgetRequest[];
    },
    createRequest: async (req: BudgetRequest) => {
        const { expenseItems, ...rest } = req;
        const { data, error } = await supabase.from('BudgetRequest').insert(rest).select().single();
        if (error) throw new Error(error.message);

        if (expenseItems && expenseItems.length > 0) {
            const items = expenseItems.map((item: any) => ({ ...item, requestId: data.id }));
            const { error: itemError } = await supabase.from('BudgetRequestItem').insert(items);
            if (itemError) console.error("Error inserting items:", itemError);
        }
        return { ...data, expenseItems } as BudgetRequest;
    },
    updateRequestStatus: async (id: string, status: string) => {
        const { data, error } = await supabase.from('BudgetRequest').update({ status }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data as BudgetRequest;
    },
    approveRequest: async (id: string, approverId: string) => {
        const { data, error } = await supabase.from('BudgetRequest').update({ status: 'approved', approverId, approvedAt: new Date().toISOString() }).eq('id', id).select().single();
        if (error) throw new Error(error.message);

        // Note: For full accuracy with category `used` field, an RPC or Edge function is strongly recommended. 
        // We will just do a basic client-side update as a fallback to keep the app working.
        const req = data as BudgetRequest;
        const { data: categoryData } = await supabase.from('Category').select('*').eq('name', req.category).maybeSingle();
        if (categoryData) {
            await supabase.from('Category').update({ used: (categoryData.used || 0) + req.amount }).eq('id', categoryData.id);
        }

        return data as BudgetRequest;
    },
    rejectRequest: async (id: string, approverId: string, reason: string) => {
        const { data, error } = await supabase.from('BudgetRequest').update({ status: 'rejected', approverId, rejectionReason: reason }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data as BudgetRequest;
    },
    completeRequest: async (id: string) => {
        const { data, error } = await supabase.from('BudgetRequest').update({ status: 'completed' }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data as BudgetRequest;
    },
    submitExpenseReport: async (id: string, submitData: { expenseItems: any[], actualTotal: number, returnAmount: number }) => {
        const { error } = await supabase.from('BudgetRequest').update({
            status: 'waiting_verification',
            actualAmount: submitData.actualTotal,
            returnAmount: submitData.returnAmount
        }).eq('id', id);

        if (error) throw new Error(error.message);

        if (submitData.expenseItems && submitData.expenseItems.length > 0) {
            for (const item of submitData.expenseItems) {
                if (item.id && !item.id.startsWith('temp-')) {
                    await supabase.from('BudgetRequestItem').update({ actualAmount: item.actualAmount }).eq('id', item.id);
                } else {
                    await supabase.from('BudgetRequestItem').insert({
                        requestId: id,
                        category: item.category || 'other',
                        description: item.description,
                        quantity: parseFloat(item.quantity) || 1,
                        unit: item.unit || 'หน่วย',
                        unitPrice: parseFloat(item.actualAmount) || 0,
                        total: 0,
                        actualAmount: parseFloat(item.actualAmount) || 0
                    });
                }
            }
        }

        const { data: updatedReq } = await supabase.from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').eq('id', id).single();
        return updatedReq as BudgetRequest;
    },
    rejectExpenseReport: async (id: string, reason: string) => {
        const { data, error } = await supabase.from('BudgetRequest').update({ status: 'approved', rejectionReason: reason }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data as BudgetRequest;
    },
    revertComplete: async (id: string) => {
        const { data, error } = await supabase.from('BudgetRequest').update({ status: 'waiting_verification', completedAt: null }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data as BudgetRequest;
    },
    deleteRequest: async (id: string) => {
        const { error } = await supabase.from('BudgetRequest').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },

    getPlans: async (year?: number) => {
        let query = supabase.from('BudgetPlan').select('*');
        if (year) query = query.eq('year', year);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data as BudgetPlan[];
    },
    savePlan: async (plan: Omit<BudgetPlan, 'id' | 'updatedAt'>) => {
        const { data: existing } = await supabase.from('BudgetPlan').select('id')
            .eq('subActivityId', plan.subActivityId).eq('year', plan.year).eq('month', plan.month).maybeSingle();

        if (existing) {
            const { data, error } = await supabase.from('BudgetPlan').update({ amount: plan.amount }).eq('id', existing.id).select().single();
            if (error) throw new Error(error.message);
            return data as BudgetPlan;
        } else {
            const { data, error } = await supabase.from('BudgetPlan').insert(plan).select().single();
            if (error) throw new Error(error.message);
            return data as BudgetPlan;
        }
    },

    adjustBudget: async (categoryId: string, adjustData: { amount: number, type: string, reason: string, user?: string }) => {
        const { data: category } = await supabase.from('Category').select('allocated').eq('id', categoryId).maybeSingle();
        if (!category) throw new Error('Category not found');

        let newAllocated = category.allocated;
        const adjustAmount = adjustData.amount;
        if (adjustData.type === 'ADD' || adjustData.type === 'TRANSFER_IN') {
            newAllocated += adjustAmount;
        } else if (adjustData.type === 'REDUCE' || adjustData.type === 'TRANSFER_OUT') {
            newAllocated -= adjustAmount;
        }

        const { data: updatedCategory, error } = await supabase.from('Category').update({ allocated: newAllocated }).eq('id', categoryId).select().single();
        if (error) throw new Error(error.message);

        await supabase.from('BudgetLog').insert({
            categoryId,
            amount: adjustAmount,
            type: adjustData.type,
            reason: adjustData.reason,
            user: adjustData.user
        });

        return updatedCategory as Category;
    },

    getLogs: async (categoryId?: string) => {
        let query = supabase.from('BudgetLog').select('*').order('createdAt', { ascending: false });
        if (categoryId) query = query.eq('categoryId', categoryId);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data as BudgetLog[];
    },
};

export const expenseService = {
    create: async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
        const { data, error } = await supabase.from('Expense').insert(expense).select().single();
        if (error) throw new Error(error.message);
        return data as Expense;
    },
    getAll: async (categoryId?: string) => {
        let query = supabase.from('Expense').select('*').order('date', { ascending: false });
        if (categoryId) query = query.eq('categoryId', categoryId);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data as Expense[];
    },
    delete: async (id: string) => {
        const { error } = await supabase.from('Expense').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};
