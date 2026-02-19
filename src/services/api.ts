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
import {
    supabaseAuthService,
    supabaseUserService,
    supabaseCategoryService,
    supabaseSubActivityService,
    supabaseExpenseService,
    supabaseSystemService,
    supabaseBudgetPlanService,
    supabaseActivityLogService,
    supabaseBudgetRequestService,
} from './supabaseService';

// ============================================================
// AUTH SERVICE → Supabase Auth
// ============================================================
export const authService = {
    login: (credentials: { username: string; password: string }) =>
        supabaseAuthService.login(credentials),

    loginWithGoogle: (token: string) =>
        supabaseAuthService.loginWithGoogle(token),

    updateProfile: (id: string, data: Partial<User>) =>
        supabaseUserService.updateProfile(id, data),

    changePassword: (data: any) =>
        supabaseUserService.changePassword(data),
};

// ============================================================
// USER SERVICE → Supabase direct queries
// ============================================================
export const userService = {
    getAll: () => supabaseUserService.getAll(),
    create: (user: Partial<User>) => supabaseUserService.create(user),
    update: (id: string, user: Partial<User>) => supabaseUserService.update(id, user),
    delete: (id: string) => supabaseUserService.delete(id),
};

// ============================================================
// SYSTEM SERVICE → Supabase direct queries
// ============================================================
export const systemService = {
    getSettings: () => supabaseSystemService.getSettings(),
    updateSettings: (settings: SystemSettings) => supabaseSystemService.updateSettings(settings),
    getDepartments: () => supabaseSystemService.getDepartments(),
    createDepartment: (dept: Department) => supabaseSystemService.createDepartment(dept),
    updateDepartment: (dept: Department) => supabaseSystemService.updateDepartment(dept),
    deleteDepartment: (id: string) => supabaseSystemService.deleteDepartment(id),
};

// ============================================================
// MASTER DATA SERVICE → Supabase direct queries
// ============================================================
export const masterDataService = {
    getCategories: () => supabaseCategoryService.getAll(),
    createCategory: (cat: Category) => supabaseCategoryService.create(cat),
    updateCategory: (cat: Category) => supabaseCategoryService.update(cat),
    deleteCategory: (id: string) => supabaseCategoryService.delete(id),

    getSubActivities: () => supabaseSubActivityService.getAll(),
    createSubActivity: (sub: SubActivity) => supabaseSubActivityService.create(sub),
    updateSubActivity: (sub: SubActivity) => supabaseSubActivityService.update(sub),
    deleteSubActivity: (id: string) => supabaseSubActivityService.delete(id),
};

// ============================================================
// BUDGET SERVICE → ALL via Supabase direct queries
// ============================================================
export const budgetService = {
    getRequests: () => supabaseBudgetRequestService.getAll(),
    createRequest: (req: BudgetRequest) => supabaseBudgetRequestService.create(req),
    updateRequestStatus: (id: string, status: string) => supabaseBudgetRequestService.updateStatus(id, status),
    approveRequest: (id: string, approverId: string) => supabaseBudgetRequestService.approve(id, approverId),
    rejectRequest: (id: string, approverId: string, reason: string) => supabaseBudgetRequestService.reject(id, approverId, reason),
    completeRequest: (id: string) => supabaseBudgetRequestService.complete(id),
    submitExpenseReport: (id: string, data: { expenseItems: any[], actualTotal: number, returnAmount: number }) => supabaseBudgetRequestService.submitExpenseReport(id, data),
    rejectExpenseReport: (id: string, reason: string) => supabaseBudgetRequestService.rejectExpenseReport(id, reason),
    revertComplete: (id: string) => supabaseBudgetRequestService.revertComplete(id),
    deleteRequest: (id: string) => supabaseBudgetRequestService.delete(id),

    getPlans: (year?: number) => supabaseBudgetPlanService.getAll(year),
    savePlan: (plan: Omit<BudgetPlan, 'id' | 'updatedAt'>) => supabaseBudgetPlanService.save(plan),
    adjustBudget: (categoryId: string, data: { amount: number, type: string, reason: string, user?: string }) =>
        supabaseCategoryService.adjustBudget(categoryId, data),
    getLogs: (categoryId: string) => supabaseCategoryService.getLogs(categoryId),
};

// ============================================================
// EXPENSE SERVICE → Supabase direct queries
// ============================================================
export const expenseService = {
    create: (expense: Omit<Expense, 'id' | 'createdAt'>) => supabaseExpenseService.create(expense),
    getAll: (categoryId: string) => supabaseExpenseService.getAll(categoryId),
    delete: (id: string) => supabaseExpenseService.delete(id),
};

