(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activityLogService",
    ()=>activityLogService,
    "authService",
    ()=>authService,
    "budgetService",
    ()=>budgetService,
    "expenseService",
    ()=>expenseService,
    "masterDataService",
    ()=>masterDataService,
    "notificationService",
    ()=>notificationService,
    "systemService",
    ()=>systemService,
    "userService",
    ()=>userService
]);
(()=>{
    const e = new Error("Cannot find module '../lib/getSupabase()/client'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
// Deferred initialization to be SSR-safe
const getSupabase = ()=>createClient();
const authService = {
    login: async (credentials)=>{
        const cleanUsername = credentials.username.trim();
        const cleanPassword = credentials.password;
        let email = cleanUsername.includes('@') ? cleanUsername : '';
        if (!email) {
            const { data: resolvedEmail, error: rpcError } = await getSupabase().rpc('get_user_email', {
                p_username: cleanUsername
            });
            if (!rpcError && resolvedEmail) {
                email = resolvedEmail;
            } else {
                email = `${cleanUsername}@wu.ac.th`;
            }
        }
        const { data, error } = await getSupabase().auth.signInWithPassword({
            email: email,
            password: cleanPassword
        });
        if (error) throw new Error(error.message);
        // Fetch user profile
        // Fetch user profile via our API route to bypass RLS
        let profile = null;
        try {
            const res = await fetch(`/api/profile?id=${data.user.id}&email=${data.user.email || ''}`);
            if (res.ok) {
                const result = await res.json();
                if (result.profile) {
                    profile = result.profile;
                    console.log("LOGIN -> DB profile fetch success:", profile.role);
                }
            } else {
                console.error("LOGIN -> Error fetching profile via API:", await res.text());
            }
        } catch (e) {
            console.error("LOGIN -> Failed to fetch profile via API:", e);
        }
        const userObj = profile || {
            id: data.user.id,
            email: data.user.email,
            role: 'user',
            username: credentials.username,
            name: credentials.username,
            position: '',
            department: ''
        };
        return {
            user: userObj,
            token: data.session.access_token
        };
    },
    loginWithGoogle: async (token)=>{
        const { data, error } = await getSupabase().auth.signInWithIdToken({
            provider: 'google',
            token: token
        });
        if (error) throw new Error(error.message);
        const { data: profile } = await getSupabase().from('User').select('*').eq('id', data.user.id).maybeSingle();
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
        const { data, error } = await getSupabase().from('User').update(updateData).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    changePassword: async (data)=>{
        const { error } = await getSupabase().auth.updateUser({
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
        const { data, error } = await getSupabase().from('User').select('*').order('createdAt', {
            ascending: false
        });
        if (error) throw new Error(error.message);
        return data;
    },
    create: async (user)=>{
        const { data, error } = await getSupabase().from('User').insert(user).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    update: async (id, user)=>{
        const { data, error } = await getSupabase().from('User').update(user).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    delete: async (id)=>{
        const { error } = await getSupabase().from('User').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const systemService = {
    getSettings: async ()=>{
        const { data, error } = await getSupabase().from('SystemSetting').select('*');
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
        const upsert = (key, value)=>getSupabase().from('SystemSetting').upsert({
                key,
                value
            }).then(({ error })=>{
                if (error) throw new Error(error.message);
            });
        // Run all upserts in parallel instead of sequentially
        await Promise.all([
            upsert('ORG_NAME', settings.orgName),
            upsert('FISCAL_YEAR', settings.fiscalYear.toString()),
            upsert('OVER_BUDGET_ALERT', String(settings.overBudgetAlert)),
            upsert('FISCAL_YEAR_CUTOFF', settings.fiscalYearCutoff),
            ...settings.permissions ? [
                upsert('PERMISSIONS', JSON.stringify(settings.permissions))
            ] : []
        ]);
        return {
            success: true
        };
    },
    getDepartments: async ()=>{
        const { data, error } = await getSupabase().from('Department').select('*');
        if (error) throw new Error(error.message);
        return data;
    },
    createDepartment: async (dept)=>{
        const { data, error } = await getSupabase().from('Department').insert(dept).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    updateDepartment: async (dept)=>{
        const { data, error } = await getSupabase().from('Department').update(dept).eq('id', dept.id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteDepartment: async (id)=>{
        const { error } = await getSupabase().from('Department').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const masterDataService = {
    getCategories: async ()=>{
        const { data, error } = await getSupabase().from('Category').select('*');
        if (error) throw new Error(error.message);
        return data;
    },
    createCategory: async (cat)=>{
        const { data, error } = await getSupabase().from('Category').insert(cat).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    updateCategory: async (cat)=>{
        const { data, error } = await getSupabase().from('Category').update(cat).eq('id', cat.id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteCategory: async (id)=>{
        const { error } = await getSupabase().from('Category').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    },
    getSubActivities: async ()=>{
        const { data, error } = await getSupabase().from('SubActivity').select('*');
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
        const { data, error } = await getSupabase().from('SubActivity').insert(sub).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    updateSubActivity: async (sub)=>{
        const { data, error } = await getSupabase().from('SubActivity').update(sub).eq('id', sub.id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteSubActivity: async (id)=>{
        const { error } = await getSupabase().from('SubActivity').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const budgetService = {
    uploadAttachment: async (file)=>{
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { data, error } = await getSupabase().storage.from('attachments').upload(filePath, file);
        if (error) {
            throw new Error(error.message);
        }
        const { data: publicUrlData } = getSupabase().storage.from('attachments').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    },
    getRequests: async ()=>{
        const { data, error } = await getSupabase().from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').order('createdAt', {
            ascending: false
        });
        if (error) throw new Error(error.message);
        return data;
    },
    createRequest: async (req)=>{
        const { expenseItems, id, documentNumber, ...rest } = req;
        // Map documentNumber to approvalRef if approvalRef is not provided
        const payloadToInsert = {
            ...rest,
            approvalRef: rest.approvalRef || documentNumber
        };
        const { data, error } = await getSupabase().from('BudgetRequest').insert(payloadToInsert).select().single();
        if (error) throw new Error(error.message);
        if (expenseItems && expenseItems.length > 0) {
            const items = expenseItems.map(({ id: itemId, ...itemRest })=>({
                    ...itemRest,
                    requestId: data.id
                }));
            const { error: itemError } = await getSupabase().from('BudgetRequestItem').insert(items);
            if (itemError) console.error("Error inserting items:", itemError);
        }
        return {
            ...data,
            expenseItems
        };
    },
    updateRequestStatus: async (id, status)=>{
        const { data, error } = await getSupabase().from('BudgetRequest').update({
            status
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    approveRequest: async (id, approverId)=>{
        // 1. Get current request to know the step
        const { data: currentReq } = await getSupabase().from('BudgetRequest').select('*').eq('id', id).single();
        if (!currentReq) throw new Error('Request not found');
        const step = currentReq.currentStep || 'manager';
        let nextStep = step;
        let nextStatus = 'pending';
        if (step === 'manager') {
            nextStep = 'finance';
        } else if (step === 'finance') {
            nextStep = 'director';
        } else if (step === 'director') {
            nextStatus = 'approved';
        }
        // 2. Update status and step
        const updateData = {
            currentStep: nextStep,
            status: nextStatus,
            approverId,
            updatedAt: new Date().toISOString()
        };
        if (nextStatus === 'approved') {
            updateData.approvedAt = new Date().toISOString();
        }
        const { data, error } = await getSupabase().from('BudgetRequest').update(updateData).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        // 3. Log the approval
        await getSupabase().from('ApprovalLog').insert({
            requestId: id,
            approverId,
            action: 'approve',
            stage: step
        });
        // 4. Update category budget ONLY on final approval
        if (nextStatus === 'approved') {
            const req = data;
            const { data: categoryData } = await getSupabase().from('Category').select('*').eq('name', req.category).maybeSingle();
            if (categoryData) {
                await getSupabase().from('Category').update({
                    used: (categoryData.used || 0) + req.amount
                }).eq('id', categoryData.id);
            }
        }
        return data;
    },
    rejectRequest: async (id, approverId, reason)=>{
        // 1. Get current request to know the step
        const { data: currentReq } = await getSupabase().from('BudgetRequest').select('currentStep').eq('id', id).single();
        const step = currentReq?.currentStep || 'manager';
        const { data, error } = await getSupabase().from('BudgetRequest').update({
            status: 'rejected',
            approverId,
            rejectionReason: reason,
            updatedAt: new Date().toISOString()
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        // 2. Log the rejection
        await getSupabase().from('ApprovalLog').insert({
            requestId: id,
            approverId,
            action: 'reject',
            stage: step,
            comment: reason
        });
        return data;
    },
    getApprovalLogs: async (requestId)=>{
        const { data, error } = await getSupabase().from('ApprovalLog').select('*, user:User(name, role, avatar)').eq('requestId', requestId).order('createdAt', {
            ascending: true
        });
        if (error) throw new Error(error.message);
        return data;
    },
    getAllApprovalLogs: async ()=>{
        const { data, error } = await getSupabase().from('ApprovalLog').select('*, user:User(name, role, avatar)').order('createdAt', {
            ascending: true
        });
        if (error) throw new Error(error.message);
        return data;
    },
    completeRequest: async (id)=>{
        const { data, error } = await getSupabase().from('BudgetRequest').update({
            status: 'completed'
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    submitExpenseReport: async (id, submitData)=>{
        const { error } = await getSupabase().from('BudgetRequest').update({
            status: 'waiting_verification',
            actualAmount: submitData.actualTotal,
            returnAmount: submitData.returnAmount,
            attachments: submitData.attachments
        }).eq('id', id);
        if (error) throw new Error(error.message);
        if (submitData.expenseItems && submitData.expenseItems.length > 0) {
            for (const item of submitData.expenseItems){
                if (item.id && !item.id.startsWith('temp-')) {
                    await getSupabase().from('BudgetRequestItem').update({
                        actualAmount: item.actualAmount
                    }).eq('id', item.id);
                } else {
                    await getSupabase().from('BudgetRequestItem').insert({
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
        const { data: updatedReq } = await getSupabase().from('BudgetRequest').select('*, expenseItems:BudgetRequestItem(*)').eq('id', id).single();
        return updatedReq;
    },
    rejectExpenseReport: async (id, reason)=>{
        const { data, error } = await getSupabase().from('BudgetRequest').update({
            status: 'approved',
            rejectionReason: reason
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    revertComplete: async (id)=>{
        const { data, error } = await getSupabase().from('BudgetRequest').update({
            status: 'waiting_verification',
            completedAt: null
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    deleteRequest: async (id)=>{
        const { error } = await getSupabase().from('BudgetRequest').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    },
    getPlans: async (year)=>{
        let query = getSupabase().from('BudgetPlan').select('*');
        if (year) query = query.eq('year', year);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
    },
    savePlan: async (plan)=>{
        const { data: existing } = await getSupabase().from('BudgetPlan').select('id').eq('subActivityId', plan.subActivityId).eq('year', plan.year).eq('month', plan.month).maybeSingle();
        if (existing) {
            const { data, error } = await getSupabase().from('BudgetPlan').update({
                amount: plan.amount
            }).eq('id', existing.id).select().single();
            if (error) throw new Error(error.message);
            return data;
        } else {
            const { data, error } = await getSupabase().from('BudgetPlan').insert(plan).select().single();
            if (error) throw new Error(error.message);
            return data;
        }
    },
    adjustBudget: async (categoryId, adjustData)=>{
        const { data: category } = await getSupabase().from('Category').select('allocated').eq('id', categoryId).maybeSingle();
        if (!category) throw new Error('Category not found');
        let newAllocated = category.allocated;
        const adjustAmount = adjustData.amount;
        if (adjustData.type === 'ADD' || adjustData.type === 'TRANSFER_IN') {
            newAllocated += adjustAmount;
        } else if (adjustData.type === 'REDUCE' || adjustData.type === 'TRANSFER_OUT') {
            newAllocated -= adjustAmount;
        }
        const { data: updatedCategory, error } = await getSupabase().from('Category').update({
            allocated: newAllocated
        }).eq('id', categoryId).select().single();
        if (error) throw new Error(error.message);
        await getSupabase().from('BudgetLog').insert({
            categoryId,
            amount: adjustAmount,
            type: adjustData.type,
            reason: adjustData.reason,
            user: adjustData.user
        });
        return updatedCategory;
    },
    getLogs: async (categoryId)=>{
        let query = getSupabase().from('BudgetLog').select('*').order('createdAt', {
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
        const { data, error } = await getSupabase().from('Expense').insert(expense).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    getAll: async (categoryId)=>{
        let query = getSupabase().from('Expense').select('*').order('date', {
            ascending: false
        });
        if (categoryId) query = query.eq('categoryId', categoryId);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
    },
    delete: async (id)=>{
        const { error } = await getSupabase().from('Expense').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const notificationService = {
    getAll: async (userId)=>{
        const { data, error } = await getSupabase().from('Notification').select('*').eq('userId', userId).order('createdAt', {
            ascending: false
        });
        if (error) throw new Error(error.message);
        return data;
    },
    markAsRead: async (id)=>{
        const { data, error } = await getSupabase().from('Notification').update({
            isRead: true
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    markAllAsRead: async (userId)=>{
        const { error } = await getSupabase().from('Notification').update({
            isRead: true
        }).eq('userId', userId).eq('isRead', false);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    },
    create: async (notification)=>{
        const { data, error } = await getSupabase().from('Notification').insert(notification).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    delete: async (id)=>{
        const { error } = await getSupabase().from('Notification').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return {
            success: true
        };
    }
};
const activityLogService = {
    getAll: async ()=>{
        const { data, error } = await getSupabase().from('ActivityLog').select(`
                *,
                user:User (
                    name,
                    role,
                    avatar,
                    username
                )
            `).order('createdAt', {
            ascending: false
        });
        if (error) throw new Error(error.message);
        return data;
    },
    log: async (log)=>{
        const { data, error } = await getSupabase().from('ActivityLog').insert(log).select().single();
        if (error) throw new Error(error.message);
        return data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://lflhxsxubxymxpnxeqts.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbGh4c3h1Ynh5bXhwbnhlcXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NzgwMDUsImV4cCI6MjA4NzA1NDAwNX0.XDfGg6X9B5dBSAsytA4VUHQ53gvBi81n5kXKbgm-m2g"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/BudgetContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BudgetProvider",
    ()=>BudgetProvider,
    "useBudget",
    ()=>useBudget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const BudgetContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const BudgetProvider = ({ children })=>{
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // --- Client State (Session) ---
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BudgetProvider.useEffect": ()=>{
            const savedSidebar = localStorage.getItem('dcc_sidebar_collapsed');
            if (savedSidebar) {
                setIsSidebarCollapsed(savedSidebar === 'true');
            }
            const checkSession = {
                "BudgetProvider.useEffect.checkSession": async ()=>{
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const saved = localStorage.getItem('dcc_user');
                    if (saved) {
                        try {
                            const parsedUser = JSON.parse(saved);
                            // Verify actual role in DB via API to bypass RLS
                            try {
                                const res = await fetch(`/api/profile?id=${parsedUser.id}&email=${parsedUser.email || ''}`);
                                if (res.ok) {
                                    const result = await res.json();
                                    if (result.profile) {
                                        const dbUser = result.profile;
                                        console.log("DB User on load:", dbUser.role);
                                        setUser({
                                            ...parsedUser,
                                            ...dbUser
                                        });
                                        localStorage.setItem('dcc_user', JSON.stringify({
                                            ...parsedUser,
                                            ...dbUser
                                        }));
                                    } else {
                                        console.log("Profile not found in DB via API");
                                        setUser(parsedUser);
                                    }
                                } else {
                                    console.log("Local User on load API fallback:", parsedUser.role);
                                    setUser(parsedUser);
                                }
                            } catch (err) {
                                console.error("API fetch error:", err);
                                setUser(parsedUser);
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    const { data: { subscription } } = supabase.auth.onAuthStateChange({
                        "BudgetProvider.useEffect.checkSession": async (event, session)=>{
                            if (event === 'SIGNED_OUT') {
                                setUser(null);
                                localStorage.removeItem('dcc_user');
                                localStorage.removeItem('dcc_token');
                                queryClient.clear();
                            } else if (event === 'SIGNED_IN' && session?.user) {
                                try {
                                    const res = await fetch(`/api/profile?id=${session.user.id}&email=${session.user.email || ''}`);
                                    if (res.ok) {
                                        const result = await res.json();
                                        if (result.profile) {
                                            const mergedUser = {
                                                ...session.user,
                                                ...result.profile
                                            };
                                            setUser(mergedUser);
                                            localStorage.setItem('dcc_user', JSON.stringify(mergedUser));
                                        }
                                    }
                                } catch (e) {
                                    console.error("API fetch error on auth change", e);
                                }
                            }
                        }
                    }["BudgetProvider.useEffect.checkSession"]);
                    return ({
                        "BudgetProvider.useEffect.checkSession": ()=>subscription.unsubscribe()
                    })["BudgetProvider.useEffect.checkSession"];
                }
            }["BudgetProvider.useEffect.checkSession"];
            checkSession();
        }
    }["BudgetProvider.useEffect"], [
        queryClient,
        supabase.auth
    ]);
    // Theme Management
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BudgetProvider.useEffect": ()=>{
            if (user?.theme) {
                document.documentElement.setAttribute('data-theme', user.theme);
            } else {
                document.documentElement.setAttribute('data-theme', 'blue'); // Default
            }
        }
    }["BudgetProvider.useEffect"], [
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].update(user.id, {
                    theme: newTheme
                });
            } catch (err) {
                console.error("Failed to persist theme", err);
            }
        }
    };
    const toggleSidebar = ()=>{
        setIsSidebarCollapsed((prev)=>{
            const next = !prev;
            localStorage.setItem('dcc_sidebar_collapsed', String(next));
            return next;
        });
    };
    // --- Server State (Queries) ---
    // staleTime: 5 min — prevents refetch on every tab focus / mount
    const STALE = 5 * 60 * 1000;
    const { data: requests = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'requests'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].getRequests,
        enabled: !!user,
        staleTime: STALE
    });
    const { data: categories = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'categories'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].getCategories,
        enabled: !!user,
        staleTime: STALE
    });
    const { data: subActivities = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'subActivities'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].getSubActivities,
        enabled: !!user,
        staleTime: STALE
    });
    const { data: departments = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'departments'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemService"].getDepartments,
        enabled: !!user,
        staleTime: STALE
    });
    const { data: users = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'users'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].getAll,
        enabled: !!user,
        staleTime: STALE
    });
    const { data: budgetPlans = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'budgetPlans'
        ],
        queryFn: {
            "BudgetProvider.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].getPlans()
        }["BudgetProvider.useQuery"],
        enabled: !!user,
        staleTime: STALE
    });
    const { data: expenses = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'expenses'
        ],
        queryFn: {
            "BudgetProvider.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expenseService"].getAll()
        }["BudgetProvider.useQuery"],
        enabled: !!user,
        staleTime: STALE
    });
    const { data: budgetLogs = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'budgetLogs'
        ],
        queryFn: {
            "BudgetProvider.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].getLogs()
        }["BudgetProvider.useQuery"],
        enabled: !!user,
        staleTime: STALE
    });
    const { data: notifications = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'notifications',
            user?.id
        ],
        queryFn: {
            "BudgetProvider.useQuery": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationService"].getAll(user.id)
        }["BudgetProvider.useQuery"],
        enabled: !!user,
        staleTime: STALE
    });
    const { data: activityLogs = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'activityLogs'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityLogService"].getAll,
        enabled: !!user && user.role === 'admin',
        staleTime: STALE
    });
    // Real-time Notifications Subscription
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BudgetProvider.useEffect": ()=>{
            if (!user) return;
            const channel = supabase.channel('realtime_notifications').on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Notification',
                filter: `userId=eq.${user.id}`
            }, {
                "BudgetProvider.useEffect.channel": (payload)=>{
                    console.log('New notification received:', payload);
                    queryClient.invalidateQueries({
                        queryKey: [
                            'notifications',
                            user.id
                        ]
                    });
                    // Optional: Browser notification or toast
                    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.Notification && window.Notification.permission === 'granted') {
                        new window.Notification(payload.new.title, {
                            body: payload.new.message
                        });
                    }
                }
            }["BudgetProvider.useEffect.channel"]).subscribe();
            return ({
                "BudgetProvider.useEffect": ()=>{
                    supabase.removeChannel(channel);
                }
            })["BudgetProvider.useEffect"];
        }
    }["BudgetProvider.useEffect"], [
        user,
        supabase,
        queryClient
    ]);
    const logActivityMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[logActivityMutation]": (log)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityLogService"].log(log)
        }["BudgetProvider.useMutation[logActivityMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[logActivityMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'activityLogs'
                    ]
                });
            }
        }["BudgetProvider.useMutation[logActivityMutation]"]
    });
    const logActivity = async (action, details, entityId, entityType)=>{
        if (!user) return;
        try {
            await logActivityMutation.mutateAsync({
                userId: user.id,
                action,
                details,
                entityId,
                entityType,
                userAgent: ("TURBOPACK compile-time truthy", 1) ? window.navigator.userAgent : "TURBOPACK unreachable"
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    };
    const { data: settings = {
        orgName: 'DCC Company Ltd.',
        fiscalYear: 2569,
        overBudgetAlert: false,
        fiscalYearCutoff: '2026-09-30'
    } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'settings'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemService"].getSettings,
        enabled: !!user,
        staleTime: STALE,
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
        if (user.role?.toLowerCase() === 'admin') return true;
        const rolePermissions = settings.permissions?.[user.role] || [];
        return rolePermissions.includes(permission);
    };
    // --- Mutations (Actions) ---
    // User Actions
    const login = async (username, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].login({
                username,
                password
            });
            setUser(response.user);
            localStorage.setItem('dcc_user', JSON.stringify(response.user));
            localStorage.setItem('dcc_token', response.token);
            // Log login activity
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["activityLogService"].log({
                userId: response.user.id,
                action: 'LOGIN',
                details: 'เข้าสู่ระบบด้วยชื่อผู้ใช้งาน',
                userAgent: ("TURBOPACK compile-time truthy", 1) ? window.navigator.userAgent : "TURBOPACK unreachable"
            }).catch((err)=>console.error('Failed to log login:', err));
            return true;
        } catch (error) {
            console.error("Login Error in Context:", error);
            throw error; // Forward the error to the component so we can see the message
        }
    };
    const loginWithGoogle = async (token)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].loginWithGoogle(token);
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
        // Immediate redirect to login with a full reload to ensure clear state
        window.location.href = '/login';
    };
    const updateUserProfileMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[updateUserProfileMutation]": (updatedData)=>{
                if (!user) throw new Error("No user");
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].updateProfile(user.id, updatedData);
            }
        }["BudgetProvider.useMutation[updateUserProfileMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[updateUserProfileMutation]": (updatedUser)=>{
                setUser(updatedUser);
                localStorage.setItem('dcc_user', JSON.stringify(updatedUser));
            }
        }["BudgetProvider.useMutation[updateUserProfileMutation]"]
    });
    const changePasswordMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[changePasswordMutation]": ({ current, newPass })=>{
                if (!user) throw new Error("No user");
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].changePassword({
                    userId: user.id,
                    currentPassword: current,
                    newPassword: newPass
                });
            }
        }["BudgetProvider.useMutation[changePasswordMutation]"]
    });
    // Admin User Management
    const addUserMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].create,
        onSuccess: {
            "BudgetProvider.useMutation[addUserMutation]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'users'
                    ]
                });
                logActivity('CREATE_USER', `สร้างผู้ใช้งานใหม่: ${data.name} (@${data.username})`, data.id, 'User');
            }
        }["BudgetProvider.useMutation[addUserMutation]"]
    });
    const updateUserMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[updateUserMutation]": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].update(id, data)
        }["BudgetProvider.useMutation[updateUserMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[updateUserMutation]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'users'
                    ]
                });
                logActivity('UPDATE_USER', `แก้ไขข้อมูลผู้ใช้งาน: ${data.name} (@${data.username})`, data.id, 'User');
            }
        }["BudgetProvider.useMutation[updateUserMutation]"]
    });
    const deleteUserMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userService"].delete,
        onSuccess: {
            "BudgetProvider.useMutation[deleteUserMutation]": (_, id)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'users'
                    ]
                });
                logActivity('DELETE_USER', `ลบผู้ใช้งาน (ID: ${id})`, id, 'User');
            }
        }["BudgetProvider.useMutation[deleteUserMutation]"]
    });
    // Settings & Departments
    const updateSettingsMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemService"].updateSettings,
        onSuccess: {
            "BudgetProvider.useMutation[updateSettingsMutation]": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'settings'
                    ]
                });
                logActivity('UPDATE_SETTINGS', `แก้ไขการตั้งค่าระบบ: ปีงบประมาณ ${variables.fiscalYear}`, 'system', 'Settings');
            }
        }["BudgetProvider.useMutation[updateSettingsMutation]"]
    });
    const addDepartmentMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemService"].createDepartment,
        onSuccess: {
            "BudgetProvider.useMutation[addDepartmentMutation]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'departments'
                    ]
                });
                logActivity('CREATE_DEPARTMENT', `เพิ่มแผนกใหม่: ${data.name}`, data.id, 'Department');
            }
        }["BudgetProvider.useMutation[addDepartmentMutation]"]
    });
    const updateDepartmentMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemService"].updateDepartment,
        onSuccess: {
            "BudgetProvider.useMutation[updateDepartmentMutation]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'departments'
                    ]
                });
                logActivity('UPDATE_DEPARTMENT', `แก้ไขข้อมูลแผนก: ${data.name}`, data.id, 'Department');
            }
        }["BudgetProvider.useMutation[updateDepartmentMutation]"]
    });
    const deleteDepartmentMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemService"].deleteDepartment,
        onSuccess: {
            "BudgetProvider.useMutation[deleteDepartmentMutation]": (_, id)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'departments'
                    ]
                });
                logActivity('DELETE_DEPARTMENT', `ลบแผนก (ID: ${id})`, id, 'Department');
            }
        }["BudgetProvider.useMutation[deleteDepartmentMutation]"]
    });
    // Master Data
    const addCategoryMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].createCategory,
        onSuccess: {
            "BudgetProvider.useMutation[addCategoryMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'categories'
                    ]
                })
        }["BudgetProvider.useMutation[addCategoryMutation]"]
    });
    const updateCategoryMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].updateCategory,
        onSuccess: {
            "BudgetProvider.useMutation[updateCategoryMutation]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'categories'
                    ]
                });
                logActivity('UPDATE_CATEGORY', `แก้ไขข้อมูลหมวดหมู่: ${data.name}`, data.id, 'Category');
            }
        }["BudgetProvider.useMutation[updateCategoryMutation]"]
    });
    const deleteCategoryMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].deleteCategory,
        onSuccess: {
            "BudgetProvider.useMutation[deleteCategoryMutation]": (_, id)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'categories'
                    ]
                });
                logActivity('DELETE_CATEGORY', `ลบหมวดหมู่ (ID: ${id})`, id, 'Category');
            }
        }["BudgetProvider.useMutation[deleteCategoryMutation]"]
    });
    const addSubActivityMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].createSubActivity,
        onSuccess: {
            "BudgetProvider.useMutation[addSubActivityMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'subActivities'
                    ]
                })
        }["BudgetProvider.useMutation[addSubActivityMutation]"]
    });
    const updateSubActivityMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].updateSubActivity,
        onSuccess: {
            "BudgetProvider.useMutation[updateSubActivityMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'subActivities'
                    ]
                })
        }["BudgetProvider.useMutation[updateSubActivityMutation]"]
    });
    const deleteSubActivityMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["masterDataService"].deleteSubActivity,
        onSuccess: {
            "BudgetProvider.useMutation[deleteSubActivityMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'subActivities'
                    ]
                })
        }["BudgetProvider.useMutation[deleteSubActivityMutation]"]
    });
    // ...
    // Requests
    const addRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].createRequest,
        onSuccess: {
            "BudgetProvider.useMutation[addRequestMutation]": ()=>{
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
        }["BudgetProvider.useMutation[addRequestMutation]"]
    });
    const updateRequestStatusMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[updateRequestStatusMutation]": ({ id, status })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].updateRequestStatus(id, status)
        }["BudgetProvider.useMutation[updateRequestStatusMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[updateRequestStatusMutation]": ()=>{
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
        }["BudgetProvider.useMutation[updateRequestStatusMutation]"]
    });
    const approveRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[approveRequestMutation]": ({ id, approverId })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].approveRequest(id, approverId)
        }["BudgetProvider.useMutation[approveRequestMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[approveRequestMutation]": (data)=>{
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
                if (data.requesterId) {
                    sendNotification(data.requesterId, 'คำขอโครงการได้รับอนุมัติ ✅', `โครงการ "${data.project}" ได้รับการอนุมัติแล้ว`, 'success', `/budget?id=${data.id}`);
                }
                logActivity('APPROVE_REQUEST', `อนุมัติโครงการ: ${data.project} (งบประมาณ: ${data.amount.toLocaleString()} บาท)`, data.id, 'BudgetRequest');
            }
        }["BudgetProvider.useMutation[approveRequestMutation]"]
    });
    const rejectRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[rejectRequestMutation]": ({ id, approverId, reason })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].rejectRequest(id, approverId, reason)
        }["BudgetProvider.useMutation[rejectRequestMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[rejectRequestMutation]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'requests'
                    ]
                });
                if (data.requesterId) {
                    sendNotification(data.requesterId, 'คำขอโครงการถูกปฏิเสธ ❌', `โครงการ "${data.project}" ถูกปฏิเสธ: ${variables.reason}`, 'error', `/budget?id=${data.id}`);
                }
                logActivity('REJECT_REQUEST', `ปฏิเสธโครงการ: ${data.project} (เหตุผล: ${variables.reason})`, data.id, 'BudgetRequest');
            }
        }["BudgetProvider.useMutation[rejectRequestMutation]"]
    });
    const submitExpenseReportMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[submitExpenseReportMutation]": ({ id, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].submitExpenseReport(id, data)
        }["BudgetProvider.useMutation[submitExpenseReportMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[submitExpenseReportMutation]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'requests'
                    ]
                });
                // Notify approvers/finance
                const admins = users.filter({
                    "BudgetProvider.useMutation[submitExpenseReportMutation].admins": (u)=>u.role === 'admin' || u.role === 'approver' || u.role === 'finance'
                }["BudgetProvider.useMutation[submitExpenseReportMutation].admins"]);
                admins.forEach({
                    "BudgetProvider.useMutation[submitExpenseReportMutation]": (admin)=>{
                        if (admin.id !== user?.id) {
                            sendNotification(admin.id, 'รายงานผลการใช้จ่ายใหม่ 📑', `มีการส่งรายงานผลสำหรับโครงการ "${data.project}" รอการตรวจสอบ`, 'primary', `/budget?id=${data.id}`);
                        }
                    }
                }["BudgetProvider.useMutation[submitExpenseReportMutation]"]);
                logActivity('SUBMIT_EXPENSE', `ส่งรายงานผลการใช้จ่ายโครงการ: ${data.project} (จำนวนเงิน: ${data.actualAmount?.toLocaleString()} บาท)`, data.id, 'BudgetRequest');
            }
        }["BudgetProvider.useMutation[submitExpenseReportMutation]"]
    });
    const rejectExpenseReportMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[rejectExpenseReportMutation]": ({ id, reason })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].rejectExpenseReport(id, reason)
        }["BudgetProvider.useMutation[rejectExpenseReportMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[rejectExpenseReportMutation]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'requests'
                    ]
                });
                if (data.requesterId) {
                    sendNotification(data.requesterId, 'รายงานผลการใช้จ่ายถูกส่งคืน ⚠️', `รายงานผลสำหรับโครงการ "${data.project}" ถูกส่งคืนให้แก้ไข: ${variables.reason}`, 'warning', `/budget?id=${data.id}`);
                }
                logActivity('REJECT_EXPENSE', `ส่งคืนรายงานผลการใช้จ่ายโครงการ: ${data.project} (เหตุผล: ${variables.reason})`, data.id, 'BudgetRequest');
            }
        }["BudgetProvider.useMutation[rejectExpenseReportMutation]"]
    });
    const completeRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[completeRequestMutation]": ({ id })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].completeRequest(id)
        }["BudgetProvider.useMutation[completeRequestMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[completeRequestMutation]": ()=>{
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
        }["BudgetProvider.useMutation[completeRequestMutation]"]
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
    const uploadAttachment = async (file)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].uploadAttachment(file);
    };
    const deleteRequestMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].deleteRequest,
        onSuccess: {
            "BudgetProvider.useMutation[deleteRequestMutation]": ()=>{
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
        }["BudgetProvider.useMutation[deleteRequestMutation]"]
    });
    // Budget Adjustments
    const adjustBudgetMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[adjustBudgetMutation]": (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].adjustBudget(data.categoryId, data)
        }["BudgetProvider.useMutation[adjustBudgetMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[adjustBudgetMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'categories'
                    ]
                })
        }["BudgetProvider.useMutation[adjustBudgetMutation]"]
    });
    // Expenses
    const addExpenseMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expenseService"].create,
        onSuccess: {
            "BudgetProvider.useMutation[addExpenseMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'categories'
                    ]
                })
        }["BudgetProvider.useMutation[addExpenseMutation]"]
    });
    const deleteExpenseMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expenseService"].delete,
        onSuccess: {
            "BudgetProvider.useMutation[deleteExpenseMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'categories'
                    ]
                })
        }["BudgetProvider.useMutation[deleteExpenseMutation]"]
    });
    /* Duplicate completeRequest removed */ const revertCompleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[revertCompleteMutation]": ({ id })=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].revertComplete(id)
        }["BudgetProvider.useMutation[revertCompleteMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[revertCompleteMutation]": async ()=>{
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
        }["BudgetProvider.useMutation[revertCompleteMutation]"]
    });
    const revertComplete = async (id)=>{
        await revertCompleteMutation.mutateAsync({
            id
        });
    };
    const saveBudgetPlanMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].savePlan,
        onSuccess: {
            "BudgetProvider.useMutation[saveBudgetPlanMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'budgetPlans'
                    ]
                })
        }["BudgetProvider.useMutation[saveBudgetPlanMutation]"]
    });
    // --- Derived State (Stats) — memoized so it only recomputes when source data changes ---
    const dashboardStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BudgetProvider.useMemo[dashboardStats]": ()=>{
            const currentYearCategories = categories.filter({
                "BudgetProvider.useMemo[dashboardStats].currentYearCategories": (cat)=>cat.year === settings.fiscalYear
            }["BudgetProvider.useMemo[dashboardStats].currentYearCategories"]);
            const validCategoryNames = new Set(currentYearCategories.map({
                "BudgetProvider.useMemo[dashboardStats]": (c)=>c.name
            }["BudgetProvider.useMemo[dashboardStats]"]));
            const totalBudget = currentYearCategories.reduce({
                "BudgetProvider.useMemo[dashboardStats].totalBudget": (sum, cat)=>sum + cat.allocated
            }["BudgetProvider.useMemo[dashboardStats].totalBudget"], 0);
            const currentYearRequests = requests.filter({
                "BudgetProvider.useMemo[dashboardStats].currentYearRequests": (req)=>validCategoryNames.has(req.category)
            }["BudgetProvider.useMemo[dashboardStats].currentYearRequests"]);
            const totalUsed = currentYearCategories.reduce({
                "BudgetProvider.useMemo[dashboardStats].totalUsed": (sum, cat)=>sum + (cat.used || 0)
            }["BudgetProvider.useMemo[dashboardStats].totalUsed"], 0);
            const totalPending = currentYearRequests.filter({
                "BudgetProvider.useMemo[dashboardStats].totalPending": (req)=>req.status === 'pending'
            }["BudgetProvider.useMemo[dashboardStats].totalPending"]).reduce({
                "BudgetProvider.useMemo[dashboardStats].totalPending": (sum, req)=>sum + req.amount
            }["BudgetProvider.useMemo[dashboardStats].totalPending"], 0);
            const totalActual = currentYearRequests.filter({
                "BudgetProvider.useMemo[dashboardStats].totalActual": (req)=>req.status === 'completed'
            }["BudgetProvider.useMemo[dashboardStats].totalActual"]).reduce({
                "BudgetProvider.useMemo[dashboardStats].totalActual": (sum, req)=>sum + (req.actualAmount || 0)
            }["BudgetProvider.useMemo[dashboardStats].totalActual"], 0);
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
        }
    }["BudgetProvider.useMemo[dashboardStats]"], [
        categories,
        requests,
        settings.fiscalYear
    ]);
    const getDashboardStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BudgetProvider.useCallback[getDashboardStats]": ()=>dashboardStats
    }["BudgetProvider.useCallback[getDashboardStats]"], [
        dashboardStats
    ]);
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
    const markNotificationAsReadMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationService"].markAsRead,
        onSuccess: {
            "BudgetProvider.useMutation[markNotificationAsReadMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'notifications',
                        user?.id
                    ]
                })
        }["BudgetProvider.useMutation[markNotificationAsReadMutation]"]
    });
    const markAllNotificationsAsReadMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "BudgetProvider.useMutation[markAllNotificationsAsReadMutation]": (userId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationService"].markAllAsRead(userId)
        }["BudgetProvider.useMutation[markAllNotificationsAsReadMutation]"],
        onSuccess: {
            "BudgetProvider.useMutation[markAllNotificationsAsReadMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'notifications',
                        user?.id
                    ]
                })
        }["BudgetProvider.useMutation[markAllNotificationsAsReadMutation]"]
    });
    const deleteNotificationMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationService"].delete,
        onSuccess: {
            "BudgetProvider.useMutation[deleteNotificationMutation]": ()=>queryClient.invalidateQueries({
                    queryKey: [
                        'notifications',
                        user?.id
                    ]
                })
        }["BudgetProvider.useMutation[deleteNotificationMutation]"]
    });
    const markNotificationAsRead = async (id)=>{
        await markNotificationAsReadMutation.mutateAsync(id);
    };
    const markAllNotificationsAsRead = async ()=>{
        if (user) await markAllNotificationsAsReadMutation.mutateAsync(user.id);
    };
    const deleteNotification = async (id)=>{
        await deleteNotificationMutation.mutateAsync(id);
    };
    const sendNotification = async (userId, title, message, type = 'info', link)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notificationService"].create({
            userId,
            title,
            message,
            type,
            link
        });
    // Note: We don't necessarily need to invalidate our own queries if we are sending to someone else,
    // but the recipient will get it via real-time.
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["expenseService"].getAll(categoryId); // Direct call still ok, or could be a Query
    };
    const getBudgetLogs = async (categoryId)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].getLogs(categoryId);
    };
    const getApprovalLogs = async (requestId)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].getApprovalLogs(requestId);
    };
    const getAllApprovalLogs = async ()=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["budgetService"].getAllApprovalLogs();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BudgetContext.Provider, {
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
            uploadAttachment,
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
            changeTheme,
            notifications,
            markNotificationAsRead,
            markAllNotificationsAsRead,
            deleteNotification,
            sendNotification,
            activityLogs,
            logActivity,
            getApprovalLogs,
            getAllApprovalLogs,
            isSidebarCollapsed,
            toggleSidebar
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/BudgetContext.tsx",
        lineNumber: 659,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(BudgetProvider, "GfiC0DrIBoyxGVAI8NZKG93WPy8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c = BudgetProvider;
const useBudget = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};
_s1(useBudget, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "BudgetProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shared/Providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$BudgetContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/BudgetContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-oauth/google/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Providers({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Providers.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000
                    }
                }
            })
    }["Providers.useState"]);
    // Use a placeholder client ID if not available in env to prevent build crashes
    const clientId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.VITE_GOOGLE_CLIENT_ID || 'placeholder-client-id.apps.googleusercontent.com';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: clientId,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$BudgetContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BudgetProvider"], {
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
_s(Providers, "JiCu5uXEILp7Vc6I3fg5vEzBjr8=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_292fb48e._.js.map