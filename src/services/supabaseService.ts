import { supabase } from '../lib/supabase';
import type {
    Category,
    SubActivity,
    SystemSettings,
    Department,
    Expense,
    User,
    BudgetPlan,
    BudgetLog,
    BudgetRequest
} from '../types';

// ============================================================
// AUTH SERVICE (Supabase Auth)
// ============================================================
export const supabaseAuthService = {
    login: async (credentials: { username: string; password: string }) => {
        // Supabase Auth uses email/password
        // The "username" field can be email or username
        let email = credentials.username;

        // If not an email, look up the user's email from User table
        if (!email.includes('@')) {
            const { data: userRecord } = await supabase
                .from('User')
                .select('email')
                .eq('username', credentials.username)
                .single();

            if (!userRecord?.email) {
                throw new Error('ไม่พบผู้ใช้งาน');
            }
            email = userRecord.email;
        }

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: credentials.password,
        });

        if (error) {
            // If user exists in User table but not in Supabase Auth,
            // auto-register them (one-time migration)
            if (error.message === 'Invalid login credentials') {
                const migrated = await supabaseAuthService.migrateUser(email, credentials.password);
                if (migrated) {
                    // Retry login after migration
                    return supabaseAuthService.login(credentials);
                }
            }
            throw new Error(error.message);
        }

        // Get user profile from User table
        const { data: userProfile } = await supabase
            .from('User')
            .select('*')
            .eq('email', email)
            .single();

        if (!userProfile) {
            throw new Error('ไม่พบข้อมูลผู้ใช้ในระบบ');
        }

        const { password: _, ...userWithoutPassword } = userProfile;
        return {
            user: userWithoutPassword as User,
            token: data.session?.access_token || '',
        };
    },

    // One-time migration: create Supabase Auth user for existing User table users
    migrateUser: async (email: string, password: string): Promise<boolean> => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Skip email confirmation for migration
                    data: { migrated: true }
                }
            });
            if (error) {
                console.error('Migration failed:', error.message);
                return false;
            }

            // Auto-confirm by signing in immediately
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            return !signInError;
        } catch {
            return false;
        }
    },

    loginWithGoogle: async (token: string) => {
        // For Google OAuth via credential (from Google One Tap / @react-oauth/google)
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token,
        });

        if (error) throw new Error(error.message);

        const email = data.user?.email;
        if (!email) throw new Error('ไม่ได้รับอีเมลจาก Google');

        // Get or create user profile in User table
        let { data: userRecord } = await supabase
            .from('User')
            .select('*')
            .eq('email', email)
            .single();

        if (!userRecord) {
            const { data: newUser, error: createError } = await supabase
                .from('User')
                .insert({
                    username: email.split('@')[0],
                    email,
                    name: data.user?.user_metadata?.full_name || 'Google User',
                    password: 'supabase-auth-managed',
                    role: 'user',
                    googleId: data.user?.id,
                    avatar: data.user?.user_metadata?.avatar_url,
                    department: 'General',
                })
                .select()
                .single();

            if (createError) throw new Error(createError.message);
            userRecord = newUser;
        }

        const { password: _, ...userWithoutPassword } = userRecord;
        return {
            user: userWithoutPassword as User,
            token: data.session?.access_token || '',
        };
    },

    logout: async () => {
        await supabase.auth.signOut();
    },

    getSession: async () => {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw new Error(error.message);
        return data;
    },
};

// ============================================================
// USER SERVICE (Direct Supabase queries)
// ============================================================
export const supabaseUserService = {
    getAll: async (): Promise<User[]> => {
        const { data, error } = await supabase
            .from('User')
            .select('id, username, name, email, role, position, department, phone, employeeId, bio, avatar, englishName, startDate, theme, language, googleId, createdAt, updatedAt')
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as User[];
    },

    create: async (user: Partial<User>): Promise<User> => {
        const email = user.email;
        const password = (user as any).password || 'DCC@2026!';

        if (!email) throw new Error('Email is required');

        // 1. Create Supabase Auth user first
        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username: (user as any).username, name: (user as any).name, role: (user as any).role } }
        });
        if (authError && !authError.message.includes('already registered')) {
            throw new Error(`Auth: ${authError.message}`);
        }

        // 2. Insert into User table
        const { password: _, ...userWithoutPassword } = user as any;
        const { data, error } = await supabase
            .from('User')
            .insert({ ...userWithoutPassword, password: 'supabase-auth-managed' })
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as User;
    },

    update: async (id: string, user: Partial<User>): Promise<User> => {
        const { data, error } = await supabase
            .from('User')
            .update(user)
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as User;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        const { error } = await supabase
            .from('User')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },

    changePassword: async (data: { userId: string; currentPassword: string; newPassword: string }) => {
        const { error } = await supabase.auth.updateUser({
            password: data.newPassword,
        });
        if (error) throw new Error(error.message);
        return { success: true };
    },

    updateProfile: async (id: string, profileData: Partial<User>): Promise<User> => {
        const { data, error } = await supabase
            .from('User')
            .update(profileData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as User;
    },
};

// ============================================================
// CATEGORY SERVICE (Direct Supabase queries)
// ============================================================
export const supabaseCategoryService = {
    getAll: async (): Promise<Category[]> => {
        const { data, error } = await supabase
            .from('Category')
            .select('*')
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as Category[];
    },

    create: async (cat: Category): Promise<Category> => {
        const { id, ...rest } = cat;
        const { data, error } = await supabase
            .from('Category')
            .insert(rest)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as Category;
    },

    update: async (cat: Category): Promise<Category> => {
        const { data, error } = await supabase
            .from('Category')
            .update(cat)
            .eq('id', cat.id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as Category;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        const { error } = await supabase
            .from('Category')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },

    getExpenses: async (categoryId: string): Promise<Expense[]> => {
        const { data, error } = await supabase
            .from('Expense')
            .select('*')
            .eq('categoryId', categoryId)
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as Expense[];
    },

    getLogs: async (categoryId: string): Promise<BudgetLog[]> => {
        const { data, error } = await supabase
            .from('BudgetLog')
            .select('*')
            .eq('categoryId', categoryId)
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as BudgetLog[];
    },

    adjustBudget: async (categoryId: string, adjustData: { amount: number; type: string; reason: string; user?: string }): Promise<Category> => {
        // Get current category
        const { data: cat, error: fetchError } = await supabase
            .from('Category')
            .select('*')
            .eq('id', categoryId)
            .single();
        if (fetchError) throw new Error(fetchError.message);

        let newAllocated = cat.allocated;
        if (adjustData.type === 'ADD' || adjustData.type === 'TRANSFER_IN') {
            newAllocated += adjustData.amount;
        } else {
            newAllocated -= adjustData.amount;
        }

        // Update category
        const { data: updated, error: updateError } = await supabase
            .from('Category')
            .update({ allocated: newAllocated })
            .eq('id', categoryId)
            .select()
            .single();
        if (updateError) throw new Error(updateError.message);

        // Create log
        await supabase.from('BudgetLog').insert({
            categoryId,
            amount: adjustData.amount,
            type: adjustData.type,
            reason: adjustData.reason,
            user: adjustData.user,
        });

        return updated as Category;
    },
};

// ============================================================
// SUB-ACTIVITY SERVICE
// ============================================================
export const supabaseSubActivityService = {
    getAll: async (): Promise<SubActivity[]> => {
        const { data, error } = await supabase
            .from('SubActivity')
            .select('*')
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as SubActivity[];
    },

    create: async (sub: SubActivity): Promise<SubActivity> => {
        const { id, children, ...rest } = sub as any;
        const { data, error } = await supabase
            .from('SubActivity')
            .insert(rest)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as SubActivity;
    },

    update: async (sub: SubActivity): Promise<SubActivity> => {
        const { children, ...rest } = sub as any;
        const { data, error } = await supabase
            .from('SubActivity')
            .update(rest)
            .eq('id', sub.id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as SubActivity;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        const { error } = await supabase
            .from('SubActivity')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

// ============================================================
// EXPENSE SERVICE
// ============================================================
export const supabaseExpenseService = {
    create: async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
        const { data, error } = await supabase
            .from('Expense')
            .insert(expense)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as Expense;
    },

    getAll: async (categoryId: string): Promise<Expense[]> => {
        const { data, error } = await supabase
            .from('Expense')
            .select('*')
            .eq('categoryId', categoryId)
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as Expense[];
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        const { error } = await supabase
            .from('Expense')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

// ============================================================
// SYSTEM SETTINGS SERVICE
// ============================================================
export const supabaseSystemService = {
    getSettings: async (): Promise<SystemSettings> => {
        const { data, error } = await supabase
            .from('SystemSetting')
            .select('*');
        if (error) throw new Error(error.message);

        // Convert key-value pairs to SystemSettings object
        const settings: Record<string, string> = {};
        (data || []).forEach((row: any) => {
            settings[row.key] = row.value;
        });

        return {
            orgName: settings.orgName || 'DCC Motor Co., Ltd.',
            fiscalYear: parseInt(settings.fiscalYear || '2568'),
            overBudgetAlert: settings.overBudgetAlert === 'true',
            fiscalYearCutoff: settings.fiscalYearCutoff || '09-30',
            permissions: settings.permissions ? JSON.parse(settings.permissions) : undefined,
        };
    },

    updateSettings: async (settings: SystemSettings): Promise<{ success: boolean }> => {
        const entries = [
            { key: 'orgName', value: settings.orgName },
            { key: 'fiscalYear', value: String(settings.fiscalYear) },
            { key: 'overBudgetAlert', value: String(settings.overBudgetAlert) },
            { key: 'fiscalYearCutoff', value: settings.fiscalYearCutoff },
        ];
        if (settings.permissions) {
            entries.push({ key: 'permissions', value: JSON.stringify(settings.permissions) });
        }

        for (const entry of entries) {
            const { error } = await supabase
                .from('SystemSetting')
                .upsert(entry, { onConflict: 'key' });
            if (error) throw new Error(error.message);
        }

        return { success: true };
    },

    getDepartments: async (): Promise<Department[]> => {
        const { data, error } = await supabase
            .from('Department')
            .select('*')
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as Department[];
    },

    createDepartment: async (dept: Department): Promise<Department> => {
        const { id, ...rest } = dept;
        const { data, error } = await supabase
            .from('Department')
            .insert(rest)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as Department;
    },

    updateDepartment: async (dept: Department): Promise<Department> => {
        const { data, error } = await supabase
            .from('Department')
            .update(dept)
            .eq('id', dept.id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as Department;
    },

    deleteDepartment: async (id: string): Promise<{ success: boolean }> => {
        const { error } = await supabase
            .from('Department')
            .delete()
            .eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

// ============================================================
// ACTIVITY LOG SERVICE
// ============================================================
export const supabaseActivityLogService = {
    getAll: async (): Promise<any[]> => {
        const { data, error } = await supabase
            .from('ActivityLog')
            .select('*, user:User(name, username)')
            .order('createdAt', { ascending: false })
            .limit(100);
        if (error) throw new Error(error.message);
        return data || [];
    },

    log: async (userId: string | null, action: string, details?: any) => {
        await supabase.from('ActivityLog').insert({
            userId,
            action,
            details: details ? JSON.stringify(details) : null,
        });
    },
};

// ============================================================
// BUDGET PLAN SERVICE
// ============================================================
export const supabaseBudgetPlanService = {
    getAll: async (year?: number): Promise<BudgetPlan[]> => {
        let query = supabase.from('BudgetPlan').select('*');
        if (year) query = query.eq('year', year);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data as BudgetPlan[];
    },

    save: async (plan: Omit<BudgetPlan, 'id' | 'updatedAt'>): Promise<BudgetPlan> => {
        const { data, error } = await supabase
            .from('BudgetPlan')
            .upsert(plan, { onConflict: 'subActivityId,year,month' })
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data as BudgetPlan;
    },
};

// ============================================================
// BUDGET REQUEST SERVICE (Complex workflows)
// ============================================================

// Helper: resolve category by name and year
async function resolveCategory(name: string, fallbackName: string, year: number) {
    const { data } = await supabase
        .from('Category')
        .select('*')
        .eq('name', name)
        .eq('year', year)
        .single();
    if (data) return data;
    // Fallback
    const { data: fb } = await supabase
        .from('Category')
        .select('*')
        .eq('name', fallbackName)
        .eq('year', year)
        .single();
    return fb;
}

export const supabaseBudgetRequestService = {
    getAll: async (): Promise<BudgetRequest[]> => {
        const { data, error } = await supabase
            .from('BudgetRequest')
            .select('*, expenseItems:BudgetRequestItem(*)')
            .order('createdAt', { ascending: false });
        if (error) throw new Error(error.message);
        return data as BudgetRequest[];
    },

    create: async (req: any): Promise<BudgetRequest> => {
        const { expenseItems, ...rest } = req;

        // Budget check for sub-activity
        if (rest.subActivityId) {
            const { data: sub } = await supabase
                .from('SubActivity')
                .select('*')
                .eq('id', rest.subActivityId)
                .single();

            if (sub) {
                // Get sum of amounts for non-rejected requests
                const { data: requests } = await supabase
                    .from('BudgetRequest')
                    .select('amount, returnAmount')
                    .eq('subActivityId', rest.subActivityId)
                    .neq('status', 'rejected');

                const totalAmount = (requests || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
                const totalReturn = (requests || []).reduce((sum: number, r: any) => sum + (r.returnAmount || 0), 0);
                const used = totalAmount - totalReturn;

                if (used + rest.amount > sub.allocated) {
                    throw new Error(`งบประมาณไม่เพียงพอสำหรับกิจกรรมย่อย "${sub.name}" (คงเหลือ: ${(sub.allocated - used).toLocaleString()} บาท, ขอ: ${rest.amount.toLocaleString()} บาท)`);
                }
            }
        }

        // Create request
        const { data: request, error } = await supabase
            .from('BudgetRequest')
            .insert(rest)
            .select()
            .single();
        if (error) throw new Error(error.message);

        // Create expense items
        if (expenseItems && expenseItems.length > 0) {
            const items = expenseItems.map((item: any) => ({
                ...item,
                requestId: request.id,
            }));
            await supabase.from('BudgetRequestItem').insert(items);
        }

        // Re-fetch with items
        const { data: full } = await supabase
            .from('BudgetRequest')
            .select('*, expenseItems:BudgetRequestItem(*)')
            .eq('id', request.id)
            .single();

        // Log activity
        await supabaseActivityLogService.log(null, 'CREATE_REQUEST', {
            requestId: request.id, project: request.project, amount: request.amount
        });

        return full as BudgetRequest;
    },

    updateStatus: async (id: string, status: string): Promise<BudgetRequest> => {
        const { data, error } = await supabase
            .from('BudgetRequest')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);

        await supabaseActivityLogService.log(null, 'UPDATE_REQUEST_STATUS', { requestId: id, status });
        return data as BudgetRequest;
    },

    approve: async (id: string, approverId: string): Promise<BudgetRequest> => {
        // Fetch request with items
        const { data: request, error: fetchErr } = await supabase
            .from('BudgetRequest')
            .select('*, expenseItems:BudgetRequestItem(*)')
            .eq('id', id)
            .single();
        if (fetchErr || !request) throw new Error('Request not found');

        // 1. Update status
        const { data: updated, error: updateErr } = await supabase
            .from('BudgetRequest')
            .update({ status: 'approved', approverId, approvedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (updateErr) throw new Error(updateErr.message);

        // 2. Update category usage
        const items = request.expenseItems || [];
        const categoryUpdates: Record<string, number> = {};

        if (items.length === 0) {
            categoryUpdates[request.category] = request.amount;
        } else {
            items.forEach((item: any) => {
                const catName = item.category || request.category;
                categoryUpdates[catName] = (categoryUpdates[catName] || 0) + item.total;
            });
        }

        const requestYear = new Date().getFullYear() + 543;
        for (const [catName, amount] of Object.entries(categoryUpdates)) {
            const { data: cat } = await supabase
                .from('Category')
                .select('*')
                .eq('name', catName)
                .eq('year', requestYear)
                .single();

            if (cat) {
                await supabase
                    .from('Category')
                    .update({ used: (cat.used || 0) + amount })
                    .eq('id', cat.id);
            }
        }

        await supabaseActivityLogService.log(approverId, 'APPROVE_REQUEST', { requestId: id, amount: request.amount });
        return updated as BudgetRequest;
    },

    reject: async (id: string, approverId: string, reason: string): Promise<BudgetRequest> => {
        const { data, error } = await supabase
            .from('BudgetRequest')
            .update({
                status: 'rejected',
                approverId,
                approvedAt: new Date().toISOString(),
                rejectionReason: reason
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);

        await supabaseActivityLogService.log(approverId, 'REJECT_REQUEST', { requestId: id, reason });
        return data as BudgetRequest;
    },

    submitExpenseReport: async (id: string, reportData: { expenseItems: any[], actualTotal: number, returnAmount: number }): Promise<BudgetRequest> => {
        const { data: request, error: fetchErr } = await supabase
            .from('BudgetRequest')
            .select('*')
            .eq('id', id)
            .single();
        if (fetchErr || !request) throw new Error('Request not found');

        // Update request
        const { error: updateErr } = await supabase
            .from('BudgetRequest')
            .update({
                status: 'waiting_verification',
                actualAmount: reportData.actualTotal,
                returnAmount: reportData.returnAmount,
            })
            .eq('id', id);
        if (updateErr) throw new Error(updateErr.message);

        // Update existing items and create new ones
        for (const item of reportData.expenseItems) {
            if (item.id && !item.id.startsWith('temp-')) {
                await supabase
                    .from('BudgetRequestItem')
                    .update({ actualAmount: item.actualAmount })
                    .eq('id', item.id);
            } else {
                await supabase.from('BudgetRequestItem').insert({
                    requestId: id,
                    category: item.category || 'other',
                    description: item.description,
                    quantity: parseFloat(item.quantity) || 1,
                    unit: item.unit || 'หน่วย',
                    unitPrice: parseFloat(item.actualAmount) || 0,
                    total: 0,
                    actualAmount: parseFloat(item.actualAmount) || 0,
                });
            }
        }

        // Re-fetch
        const { data: full } = await supabase
            .from('BudgetRequest')
            .select('*, expenseItems:BudgetRequestItem(*)')
            .eq('id', id)
            .single();

        await supabaseActivityLogService.log(null, 'SUBMIT_EXPENSE_REPORT', { requestId: id, actualTotal: reportData.actualTotal });
        return full as BudgetRequest;
    },

    rejectExpenseReport: async (id: string, reason: string): Promise<BudgetRequest> => {
        const { data, error } = await supabase
            .from('BudgetRequest')
            .update({ status: 'approved', rejectionReason: reason })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);

        await supabaseActivityLogService.log(null, 'REJECT_EXPENSE_REPORT', { requestId: id, reason });
        return data as BudgetRequest;
    },

    complete: async (id: string): Promise<BudgetRequest> => {
        const { data: request, error: fetchErr } = await supabase
            .from('BudgetRequest')
            .select('*, expenseItems:BudgetRequestItem(*)')
            .eq('id', id)
            .single();
        if (fetchErr || !request) throw new Error('Request not found');

        // 1. Update to completed
        const { data: updated, error: updateErr } = await supabase
            .from('BudgetRequest')
            .update({ status: 'completed', completedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (updateErr) throw new Error(updateErr.message);

        const requestYear = new Date().getFullYear() + 543;

        // 2. Calculate budget adjustments per category
        const categoryStats: Record<string, { allocated: number, actual: number, catData: any }> = {};
        const items = request.expenseItems || [];

        if (items.length > 0) {
            for (const item of items) {
                const catName = item.category || request.category;
                const cat = await resolveCategory(catName, request.category, requestYear);
                if (cat) {
                    if (!categoryStats[cat.id]) categoryStats[cat.id] = { allocated: 0, actual: 0, catData: cat };
                    categoryStats[cat.id].allocated += item.total || 0;
                    categoryStats[cat.id].actual += item.actualAmount || 0;
                }
            }
        } else {
            const cat = await resolveCategory(request.category, request.category, requestYear);
            if (cat) {
                categoryStats[cat.id] = { allocated: request.amount, actual: request.actualAmount || 0, catData: cat };
            }
        }

        // 3. Apply budget changes
        for (const [catId, stats] of Object.entries(categoryStats)) {
            const netChange = stats.actual - stats.allocated;
            if (netChange === 0) continue;

            const cat = stats.catData;
            if (netChange < 0) {
                // Underspent — return funds
                const returnAmt = Math.abs(netChange);
                await supabase.from('Category').update({ used: (cat.used || 0) - returnAmt }).eq('id', catId);
                await supabase.from('BudgetLog').insert({
                    categoryId: catId, amount: returnAmt, type: 'REDUCE',
                    reason: `คืนงบประมาณส่วนเหลืองาน: ${request.project} (${cat.name})`, user: 'System'
                });
            } else {
                // Overspent — charge more
                await supabase.from('Category').update({ used: (cat.used || 0) + netChange }).eq('id', catId);
                await supabase.from('BudgetLog').insert({
                    categoryId: catId, amount: netChange, type: 'ADD',
                    reason: `ตัดงบประมาณเพิ่ม (เกินงบ): ${request.project} (${cat.name})`, user: 'System'
                });
            }
        }

        // 4. Create expense records
        if (items.length > 0) {
            for (const item of items) {
                if ((item.actualAmount || 0) > 0) {
                    const catName = item.category || request.category;
                    const cat = await resolveCategory(catName, request.category, requestYear);
                    if (cat) {
                        await supabase.from('Expense').insert({
                            categoryId: cat.id, amount: item.actualAmount || 0,
                            payee: request.requester, date: new Date().toISOString(),
                            description: `[${request.project}] ${item.description}`
                        });
                    }
                }
            }
        } else if (request.actualAmount && request.actualAmount > 0) {
            const cat = await resolveCategory(request.category, request.category, requestYear);
            if (cat) {
                await supabase.from('Expense').insert({
                    categoryId: cat.id, amount: request.actualAmount,
                    payee: request.requester, date: new Date().toISOString(),
                    description: `[${request.project}] Project Expense`
                });
            }
        }

        await supabaseActivityLogService.log(null, 'VERIFY_AND_COMPLETE_REQUEST', { requestId: id });
        return updated as BudgetRequest;
    },

    revertComplete: async (id: string): Promise<BudgetRequest> => {
        const { data: request, error: fetchErr } = await supabase
            .from('BudgetRequest')
            .select('*, expenseItems:BudgetRequestItem(*)')
            .eq('id', id)
            .single();
        if (fetchErr || !request) throw new Error('Request not found');

        if (request.status !== 'completed') throw new Error('Request is not completed');

        // 1. Revert status
        const { data: updated, error: updateErr } = await supabase
            .from('BudgetRequest')
            .update({ status: 'waiting_verification', completedAt: null })
            .eq('id', id)
            .select()
            .single();
        if (updateErr) throw new Error(updateErr.message);

        const requestYear = new Date().getFullYear() + 543;

        // 2. Reverse budget changes
        const categoryStats: Record<string, { allocated: number, actual: number, catData: any }> = {};
        const items = request.expenseItems || [];

        if (items.length > 0) {
            for (const item of items) {
                const catName = item.category || request.category;
                const cat = await resolveCategory(catName, request.category, requestYear);
                if (cat) {
                    if (!categoryStats[cat.id]) categoryStats[cat.id] = { allocated: 0, actual: 0, catData: cat };
                    categoryStats[cat.id].allocated += item.total || 0;
                    categoryStats[cat.id].actual += item.actualAmount || 0;
                }
            }
        } else {
            const cat = await resolveCategory(request.category, request.category, requestYear);
            if (cat) {
                categoryStats[cat.id] = { allocated: request.amount, actual: request.actualAmount || 0, catData: cat };
            }
        }

        for (const [catId, stats] of Object.entries(categoryStats)) {
            const netChange = stats.actual - stats.allocated;
            if (netChange === 0) continue;

            // Re-fetch current cat used value
            const { data: currentCat } = await supabase.from('Category').select('used').eq('id', catId).single();
            const currentUsed = currentCat?.used || 0;
            const cat = stats.catData;

            if (netChange < 0) {
                // Was underspent (reduced used) → now increase used back
                const returnAmt = Math.abs(netChange);
                await supabase.from('Category').update({ used: currentUsed + returnAmt }).eq('id', catId);
                await supabase.from('BudgetLog').insert({
                    categoryId: catId, amount: returnAmt, type: 'ADD',
                    reason: `ยกเลิกการปิดโครงการ (ดึงเงินคืนกลับ): ${request.project} (${cat.name})`, user: 'System'
                });
            } else {
                // Was overspent (increased used) → now reduce used back
                await supabase.from('Category').update({ used: currentUsed - netChange }).eq('id', catId);
                await supabase.from('BudgetLog').insert({
                    categoryId: catId, amount: netChange, type: 'REDUCE',
                    reason: `ยกเลิกการปิดโครงการ (คืนยอดตัดเกิน): ${request.project} (${cat.name})`, user: 'System'
                });
            }
        }

        // 3. Delete created expenses
        await supabase.from('Expense').delete().like('description', `[${request.project}]%`);

        await supabaseActivityLogService.log(null, 'REVERT_COMPLETE_REQUEST', { requestId: id });
        return updated as BudgetRequest;
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        const { error } = await supabase.from('BudgetRequest').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { success: true };
    },
};

