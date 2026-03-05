module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://lflhxsxubxymxpnxeqts.supabase.co") || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzgwMDUsImV4cCI6MjA4NzA1NDAwNX0.XDfGg6X9B5dBSAsytA4VUHQ53gvBi81n5kXKbgm-m2g") || process.env.VITE_SUPABASE_ANON_KEY || '';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/src/services/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService,
    "budgetService",
    ()=>budgetService,
    "expenseService",
    ()=>expenseService,
    "masterDataService",
    ()=>masterDataService,
    "systemService",
    ()=>systemService,
    "userService",
    ()=>userService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
const authService = {
    login: async (credentials)=>{
        // Use email for Supabase Auth. Format username as email if needed.
        const email = credentials.username.includes('@') ? credentials.username : `${credentials.username}@wu.ac.th`;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
            email: email,
            password: credentials.password
        });
        if (error) throw new Error(error.message);
        // Fetch user profile
        const { data: profile, error: profileError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('User').select('*').eq('id', data.user.id).maybeSingle();
        if (profileError) {
            console.error('[Login] Profile fetch error:', profileError.message, profileError.code);
        }
        console.log('[Login] Profile result:', profile);
        return {
            user: profile || {
                id: data.user.id,
                email: data.user.email,
                role: 'user',
                username: credentials.username,
                name: credentials.username,
                position: '',
                department: ''
            },
            token: data.session.access_token
        };
    },
    loginWithGoogle: async (token)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithIdToken({
            provider: 'google',
            token: token
        });
        if (error) throw new Error(error.message);
        const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('User').select('*').eq('id', data.user.id).maybeSingle();
        return {
            user: profile || {
                id: data.user.id,
                email: data.user.email,
                role: 'user'
            },
            token: data.session.access_token
        };
    },
    updateProfile: async (id, updateData)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('User').update(updateData).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    changePassword: async (data)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.updateUser({
            password: data.newPassword
        });
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const userService = {
    getAll: async ()=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('User').select('*').order('createdAt', {
            ascending: false
        });
        if (error) throw new Error(error.message);
        return data;
    },
    create: async (user)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('User').insert(user).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    update: async (id, user)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('User').update(user).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    delete: async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('User').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const systemService = {
    getSettings: async ()=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('SystemSetting').select('*');
        if (error) throw new Error(error.message);
        const settingsObj = (data || []).reduce((acc, curr)=>{
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return {
            orgName: settingsObj['ORG_NAME'] || 'DCC Company Ltd.',
            fiscalYear: parseInt(settingsObj['FISCAL_YEAR'] || '2569'),
            overBudgetAlert: settingsObj['OVER_BUDGET_ALERT'] === 'true',
            fiscalYearCutoff: settingsObj['FISCAL_YEAR_CUTOFF'] || '2026-09-30',
            permissions: settingsObj['PERMISSIONS'] ? JSON.parse(settingsObj['PERMISSIONS']) : {}
        };
    },
    updateSettings: async (settings)=>{
        const upsert = async (key, value)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('SystemSetting').upsert({
                key,
                value
            });
            if (error) throw new Error(error.message);
        };
        await upsert('ORG_NAME', settings.orgName);
        await upsert('FISCAL_YEAR', settings.fiscalYear.toString());
        await upsert('OVER_BUDGET_ALERT', String(settings.overBudgetAlert));
        await upsert('FISCAL_YEAR_CUTOFF', settings.fiscalYearCutoff);
        if (settings.permissions) {
            await upsert('PERMISSIONS', JSON.stringify(settings.permissions));
        }
        return {
            success: true
        };
    },
    getDepartments: async ()=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Department').select('*');
        if (error) throw new Error(error.message);
        return data;
    },
    createDepartment: async (dept)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Department').insert(dept).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    updateDepartment: async (dept)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Department').update(dept).eq('id', dept.id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteDepartment: async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Department').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const masterDataService = {
    getCategories: async ()=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').select('*');
        if (error) throw new Error(error.message);
        return data;
    },
    createCategory: async (cat)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').insert(cat).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    updateCategory: async (cat)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').update(cat).eq('id', cat.id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteCategory: async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    },
    getSubActivities: async ()=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('SubActivity').select('*');
        if (error) throw new Error(error.message);
        const subs = data || [];
        const buildHierarchy = (parentId)=>{
            return subs.filter((sub)=>sub.parentId === parentId).map((sub)=>({
                    ...sub,
                    children: buildHierarchy(sub.id)
                }));
        };
        return buildHierarchy(null);
    },
    createSubActivity: async (sub)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('SubActivity').insert(sub).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    updateSubActivity: async (sub)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('SubActivity').update(sub).eq('id', sub.id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteSubActivity: async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('SubActivity').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const budgetService = {
    getRequests: async ()=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').order('createdAt', {
            ascending: false
        });
        if (error) throw new Error(error.message);
        return data;
    },
    createRequest: async (req)=>{
        const { expenseItems, ...rest } = req;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').insert(rest).select().single();
        if (error) throw new Error(error.message);
        if (expenseItems && expenseItems.length > 0) {
            const items = expenseItems.map((item)=>({
                    ...item,
                    requestId: data.id
                }));
            const { error: itemError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequestItem').insert(items);
            if (itemError) console.error("Error inserting items:", itemError);
        }
        return {
            ...data,
            expenseItems
        };
    },
    updateRequestStatus: async (id, status)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').update({
            status
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    approveRequest: async (id, approverId)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').update({
            status: 'approved',
            approverId,
            approvedAt: new Date().toISOString()
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        // Note: For full accuracy with category `used` field, an RPC or Edge function is strongly recommended. 
        // We will just do a basic client-side update as a fallback to keep the app working.
        const req = data;
        const { data: categoryData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').select('*').eq('name', req.category).maybeSingle();
        if (categoryData) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').update({
                used: (categoryData.used || 0) + req.amount
            }).eq('id', categoryData.id);
        }
        return data;
    },
    rejectRequest: async (id, approverId, reason)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').update({
            status: 'rejected',
            approverId,
            rejectionReason: reason
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    completeRequest: async (id)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').update({
            status: 'completed'
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    submitExpenseReport: async (id, submitData)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').update({
            status: 'waiting_verification',
            actualAmount: submitData.actualTotal,
            returnAmount: submitData.returnAmount
        }).eq('id', id);
        if (error) throw new Error(error.message);
        if (submitData.expenseItems && submitData.expenseItems.length > 0) {
            for (const item of submitData.expenseItems){
                if (item.id && !item.id.startsWith('temp-')) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequestItem').update({
                        actualAmount: item.actualAmount
                    }).eq('id', item.id);
                } else {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequestItem').insert({
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
        const { data: updatedReq } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').eq('id', id).single();
        return updatedReq;
    },
    rejectExpenseReport: async (id, reason)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').update({
            status: 'approved',
            rejectionReason: reason
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    revertComplete: async (id)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').update({
            status: 'waiting_verification',
            completedAt: null
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteRequest: async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetRequest').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    },
    getPlans: async (year)=>{
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetPlan').select('*');
        if (year) query = query.eq('year', year);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
    },
    savePlan: async (plan)=>{
        const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetPlan').select('id').eq('subActivityId', plan.subActivityId).eq('year', plan.year).eq('month', plan.month).maybeSingle();
        if (existing) {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetPlan').update({
                amount: plan.amount
            }).eq('id', existing.id).select().single();
            if (error) throw new Error(error.message);
            return data;
        } else {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetPlan').insert(plan).select().single();
            if (error) throw new Error(error.message);
            return data;
        }
    },
    adjustBudget: async (categoryId, adjustData)=>{
        const { data: category } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').select('allocated').eq('id', categoryId).maybeSingle();
        if (!category) throw new Error('Category not found');
        let newAllocated = category.allocated;
        const adjustAmount = adjustData.amount;
        if (adjustData.type === 'ADD' || adjustData.type === 'TRANSFER_IN') {
            newAllocated += adjustAmount;
        } else if (adjustData.type === 'REDUCE' || adjustData.type === 'TRANSFER_OUT') {
            newAllocated -= adjustAmount;
        }
        const { data: updatedCategory, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Category').update({
            allocated: newAllocated
        }).eq('id', categoryId).select().single();
        if (error) throw new Error(error.message);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetLog').insert({
            categoryId,
            amount: adjustAmount,
            type: adjustData.type,
            reason: adjustData.reason,
            user: adjustData.user
        });
        return updatedCategory;
    },
    getLogs: async (categoryId)=>{
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('BudgetLog').select('*').order('createdAt', {
            ascending: false
        });
        if (categoryId) query = query.eq('categoryId', categoryId);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
    }
};
const expenseService = {
    create: async (expense)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Expense').insert(expense).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    getAll: async (categoryId)=>{
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Expense').select('*').order('date', {
            ascending: false
        });
        if (categoryId) query = query.eq('categoryId', categoryId);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
    },
    delete: async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Expense').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
}),
"[project]/src/lib/supabase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://lflhxsxubxymxpnxeqts.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzgwMDUsImV4cCI6MjA4NzA1NDAwNX0.XDfGg6X9B5dBSAsytA4VUHQ53gvBi81n5kXKbgm-m2g"));
}
}),
"[project]/src/context/BudgetContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BudgetProvider",
    ()=>BudgetProvider,
    "useBudget",
    ()=>useBudget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const BudgetContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const BudgetProvider = ({ children })=>{
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
    // --- Client State (Session) ---
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem('dcc_user');
        if (saved) setUser(JSON.parse(saved));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session)=>{
            if (event === 'SIGNED_OUT') {
                setUser(null);
                localStorage.removeItem('dcc_user');
                localStorage.removeItem('dcc_token');
                queryClient.clear();
            }
        });
        return ()=>subscription.unsubscribe();
    }, [
        queryClient,
        supabase.auth
    ]);
    // Theme Management
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (user?.theme) {
            document.documentElement.setAttribute('data-theme', user.theme);
        } else {
            document.documentElement.setAttribute('data-theme', 'blue'); // Default
        }
    }, [
        user?.theme
    ]);
    const changeTheme = async (newTheme)=>{
        if (user) {
            const updatedUser = {
                ...user,
                theme: newTheme
            };
            setUser(updatedUser);
            localStorage.setItem('dcc_user', JSON.stringify(updatedUser));
            document.documentElement.setAttribute('data-theme', newTheme);
            // Persist to backend
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userService"].update(user.id, {
                    theme: newTheme
                });
            } catch (err) {
                console.error("Failed to persist theme", err);
            }
        }
    };
    // --- Server State (Queries) ---
    const { data: requests = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'requests'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].getRequests,
        enabled: !!user
    });
    const { data: categories = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'categories'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].getCategories,
        enabled: !!user
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log("[BudgetContext] User:", user);
        console.log("[BudgetContext] Requests:", requests);
        console.log("[BudgetContext] Categories:", categories);
    }, [
        user,
        requests,
        categories
    ]);
    const { data: subActivities = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'subActivities'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].getSubActivities,
        enabled: !!user
    });
    const { data: departments = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'departments'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["systemService"].getDepartments,
        enabled: !!user
    });
    const { data: users = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'users'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userService"].getAll,
        enabled: !!user
    });
    const { data: budgetPlans = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'budgetPlans'
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].getPlans(),
        enabled: !!user
    });
    const { data: expenses = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'expenses'
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["expenseService"].getAll(),
        enabled: !!user
    });
    const { data: budgetLogs = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'budgetLogs'
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].getLogs(),
        enabled: !!user
    });
    const { data: settings = {
        orgName: 'DCC Company Ltd.',
        fiscalYear: 2569,
        overBudgetAlert: false,
        fiscalYearCutoff: '2026-09-30'
    } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'settings'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["systemService"].getSettings,
        enabled: !!user,
        initialData: {
            orgName: 'DCC Company Ltd.',
            fiscalYear: 2569,
            overBudgetAlert: false,
            fiscalYearCutoff: '2026-09-30',
            permissions: {}
        }
    });
    const hasPermission = (permission)=>{
        if (!user) return false;
        if (user.role === 'admin') return true;
        const rolePermissions = settings.permissions?.[user.role] || [];
        return rolePermissions.includes(permission);
    };
    // --- Mutations (Actions) ---
    // User Actions
    const login = async (username, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].login({
                username,
                password
            });
            setUser(response.user);
            localStorage.setItem('dcc_user', JSON.stringify(response.user));
            localStorage.setItem('dcc_token', response.token);
            return true;
        } catch (error) {
            console.error("Login Error in Context:", error);
            throw error; // Forward the error to the component so we can see the message
        }
    };
    const loginWithGoogle = async (token)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].loginWithGoogle(token);
            setUser(response.user);
            localStorage.setItem('dcc_user', JSON.stringify(response.user));
            localStorage.setItem('dcc_token', response.token);
            return true;
        } catch (error) {
            console.error("Google Login error:", error);
            return false;
        }
    };
    const logout = async ()=>{
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('dcc_user');
        localStorage.removeItem('dcc_token');
        queryClient.clear(); // Clear cache on logout
    };
    const updateUserProfileMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (updatedData)=>{
            if (!user) throw new Error("No user");
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].updateProfile(user.id, updatedData);
        },
        onSuccess: (updatedUser)=>{
            setUser(updatedUser);
            localStorage.setItem('dcc_user', JSON.stringify(updatedUser));
        }
    });
    const changePasswordMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ current, newPass })=>{
            if (!user) throw new Error("No user");
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].changePassword({
                userId: user.id,
                currentPassword: current,
                newPassword: newPass
            });
        }
    });
    // Admin User Management
    const addUserMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userService"].create,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'users'
                ]
            })
    });
    const updateUserMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userService"].update(id, data),
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'users'
                ]
            })
    });
    const deleteUserMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userService"].delete,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'users'
                ]
            })
    });
    // Settings & Departments
    const updateSettingsMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["systemService"].updateSettings,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'settings'
                ]
            })
    });
    const addDepartmentMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["systemService"].createDepartment,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'departments'
                ]
            })
    });
    const updateDepartmentMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["systemService"].updateDepartment,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'departments'
                ]
            })
    });
    const deleteDepartmentMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["systemService"].deleteDepartment,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'departments'
                ]
            })
    });
    // Master Data
    const addCategoryMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].createCategory,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            })
    });
    const updateCategoryMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].updateCategory,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            }) // Expense/Budget updates affect this too
    });
    const deleteCategoryMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].deleteCategory,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            })
    });
    const addSubActivityMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].createSubActivity,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'subActivities'
                ]
            })
    });
    const updateSubActivityMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].updateSubActivity,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'subActivities'
                ]
            })
    });
    const deleteSubActivityMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["masterDataService"].deleteSubActivity,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'subActivities'
                ]
            })
    });
    // ...
    // Requests
    const addRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].createRequest,
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            }); // Used budget changes
        }
    });
    const updateRequestStatusMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id, status })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].updateRequestStatus(id, status),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            });
        }
    });
    const approveRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id, approverId })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].approveRequest(id, approverId),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            });
        }
    });
    const rejectRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id, approverId, reason })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].rejectRequest(id, approverId, reason),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
        }
    });
    const submitExpenseReportMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].submitExpenseReport(id, data),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
        }
    });
    const rejectExpenseReportMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id, reason })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].rejectExpenseReport(id, reason),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
        }
    });
    const completeRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].completeRequest(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            });
        }
    });
    // ... (deleteRequestMutation)
    const submitExpenseReport = async (id, data)=>{
        await submitExpenseReportMutation.mutateAsync({
            id,
            data
        });
    };
    const rejectExpenseReport = async (id, reason)=>{
        await rejectExpenseReportMutation.mutateAsync({
            id,
            reason
        });
    };
    const completeRequest = async (id)=>{
        await completeRequestMutation.mutateAsync({
            id
        });
    };
    const deleteRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].deleteRequest,
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            });
        }
    });
    // Budget Adjustments
    const adjustBudgetMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].adjustBudget(data.categoryId, data),
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            })
    });
    // Expenses
    const addExpenseMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["expenseService"].create,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            })
    });
    const deleteExpenseMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["expenseService"].delete,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            })
    });
    /* Duplicate completeRequest removed */ const revertCompleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].revertComplete(id),
        onSuccess: async ()=>{
            await queryClient.invalidateQueries({
                queryKey: [
                    'requests'
                ]
            });
            await queryClient.invalidateQueries({
                queryKey: [
                    'categories'
                ]
            });
        }
    });
    const revertComplete = async (id)=>{
        await revertCompleteMutation.mutateAsync({
            id
        });
    };
    const saveBudgetPlanMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].savePlan,
        onSuccess: ()=>queryClient.invalidateQueries({
                queryKey: [
                    'budgetPlans'
                ]
            })
    });
    // --- Derived State (Stats) ---
    const getDashboardStats = ()=>{
        const currentYearCategories = categories.filter((cat)=>cat.year === settings.fiscalYear);
        const validCategoryNames = new Set(currentYearCategories.map((c)=>c.name));
        const totalBudget = currentYearCategories.reduce((sum, cat)=>sum + cat.allocated, 0);
        const currentYearRequests = requests.filter((req)=>validCategoryNames.has(req.category));
        const totalUsed = currentYearCategories.reduce((sum, cat)=>sum + (cat.used || 0), 0);
        const totalPending = currentYearRequests.filter((req)=>req.status === 'pending').reduce((sum, req)=>sum + req.amount, 0);
        const totalActual = currentYearRequests.filter((req)=>req.status === 'completed').reduce((sum, req)=>sum + (req.actualAmount || 0), 0);
        const totalRemaining = totalBudget - totalUsed;
        const usagePercentage = totalBudget > 0 ? totalUsed / totalBudget * 100 : 0;
        return {
            totalBudget,
            totalUsed,
            totalActual,
            totalPending,
            totalRemaining,
            usagePercentage
        };
    };
    // Helper Wrappers (to match old Context API)
    const updateUserProfile = async (data)=>{
        await updateUserProfileMutation.mutateAsync(data);
    };
    const changePassword = async (current, newPass)=>{
        await changePasswordMutation.mutateAsync({
            current,
            newPass
        });
    };
    const addUser = async (data)=>{
        await addUserMutation.mutateAsync(data);
    };
    const updateUser = async (id, data)=>{
        await updateUserMutation.mutateAsync({
            id,
            data
        });
    };
    const deleteUser = async (id)=>{
        await deleteUserMutation.mutateAsync(id);
    };
    const updateSettings = async (s)=>{
        await updateSettingsMutation.mutateAsync(s);
    };
    const addDepartment = async (d)=>{
        await addDepartmentMutation.mutateAsync(d);
    };
    const updateDepartment = async (d)=>{
        await updateDepartmentMutation.mutateAsync(d);
    };
    const deleteDepartment = async (id)=>{
        await deleteDepartmentMutation.mutateAsync(id);
    };
    const addCategory = async (c)=>{
        await addCategoryMutation.mutateAsync(c);
    };
    const updateCategory = async (c)=>{
        await updateCategoryMutation.mutateAsync(c);
    };
    const deleteCategory = async (id)=>{
        await deleteCategoryMutation.mutateAsync(id);
    };
    const addSubActivity = async (s)=>{
        await addSubActivityMutation.mutateAsync(s);
    };
    const updateSubActivity = async (s)=>{
        await updateSubActivityMutation.mutateAsync(s);
    };
    const deleteSubActivity = async (id)=>{
        await deleteSubActivityMutation.mutateAsync(id);
    };
    const addRequest = async (r)=>{
        await addRequestMutation.mutateAsync(r);
    };
    const updateRequestStatus = async (id, status)=>{
        await updateRequestStatusMutation.mutateAsync({
            id,
            status
        });
    };
    const approveRequest = async (id, approverId)=>{
        await approveRequestMutation.mutateAsync({
            id,
            approverId
        });
    };
    const rejectRequest = async (id, approverId, reason)=>{
        await rejectRequestMutation.mutateAsync({
            id,
            approverId,
            reason
        });
    };
    const deleteRequest = async (id)=>{
        await deleteRequestMutation.mutateAsync(id);
    };
    const adjustBudget = async (categoryId, amount, type, reason)=>{
        await adjustBudgetMutation.mutateAsync({
            categoryId,
            amount,
            type,
            reason,
            user: user?.username
        });
    };
    const addExpense = async (e)=>{
        await addExpenseMutation.mutateAsync(e);
    };
    const deleteExpense = async (id)=>{
        await deleteExpenseMutation.mutateAsync(id);
    };
    const saveBudgetPlan = async (p)=>{
        await saveBudgetPlanMutation.mutateAsync(p);
    };
    const getExpenses = async (categoryId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["expenseService"].getAll(categoryId); // Direct call still ok, or could be a Query
    };
    const getBudgetLogs = async (categoryId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["budgetService"].getLogs(categoryId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BudgetContext.Provider, {
        value: {
            requests,
            categories,
            subActivities,
            settings,
            hasPermission,
            departments,
            user,
            users,
            login,
            loginWithGoogle,
            logout,
            updateUserProfile,
            updateUser,
            addUser,
            deleteUser,
            changePassword,
            addRequest,
            updateRequestStatus,
            approveRequest,
            rejectRequest,
            submitExpenseReport,
            rejectExpenseReport,
            completeRequest,
            revertComplete,
            deleteRequest,
            addCategory,
            updateCategory,
            deleteCategory,
            addSubActivity,
            updateSubActivity,
            deleteSubActivity,
            updateSettings,
            addDepartment,
            updateDepartment,
            deleteDepartment,
            getDashboardStats,
            adjustBudget,
            getBudgetLogs,
            getExpenses,
            budgetLogs,
            addExpense,
            expenses,
            deleteExpense,
            budgetPlans,
            saveBudgetPlan,
            restoreData: (data)=>{
                // Naive restore: just set cache
                if (data.requests) queryClient.setQueryData([
                    'requests'
                ], data.requests);
                if (data.categories) queryClient.setQueryData([
                    'categories'
                ], data.categories);
                if (data.settings) queryClient.setQueryData([
                    'settings'
                ], data.settings);
                alert('Data restored to Cache');
            },
            changeTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/BudgetContext.tsx",
        lineNumber: 412,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useBudget = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};
}),
"[project]/src/components/shared/Providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$BudgetContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/BudgetContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-oauth/google/dist/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000
                }
            }
        }));
    // Use a placeholder client ID if not available in env to prevent build crashes
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || 'placeholder-client-id.apps.googleusercontent.com';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: clientId,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$BudgetContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BudgetProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Providers.tsx",
                lineNumber: 24,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/shared/Providers.tsx",
            lineNumber: 23,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/Providers.tsx",
        lineNumber: 22,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__67227058._.js.map