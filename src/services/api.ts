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

const API_URL = '/api';

// Helper to get token
const getAuthHeaders = () => {
    const token = localStorage.getItem('dcc_token');
    return token ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    } : {
        'Content-Type': 'application/json'
    };
};

// Helper for Fetch
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
    const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    return response.json();
};

// ============================================================
// AUTH SERVICE
// ============================================================
export const authService = {
    login: async (credentials: { username: string; password: string }) => {
        return fetchAPI('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    loginWithGoogle: async (token: string) => {
        return fetchAPI('/google', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    },

    updateProfile: async (id: string, data: Partial<User>) => {
        return fetchAPI(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Backend endpoint: POST /api/users/change-password
    // Payload: { userId, currentPassword, newPassword } -> validation schema expects these?
    // Let's assume standard payload. If controller expects "id" in body or uses req.user.id, we need to match.
    // Based on userController check (next step), we might need to adjust.
    // Assuming schema is: { currentPassword, newPassword } and userId from token? 
    // Or body: { userId, currentPassword, newPassword }?
    // Safe bet: send all.
    changePassword: async (data: { userId: string; currentPassword: string; newPassword: string }) => {
        return fetchAPI('/users/change-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============================================================
// USER SERVICE
// ============================================================
export const userService = {
    getAll: async () => fetchAPI('/users'),
    create: async (user: Partial<User>) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(user) }),
    update: async (id: string, user: Partial<User>) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
    delete: async (id: string) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
};

// ============================================================
// SYSTEM SERVICE
// ============================================================
export const systemService = {
    getSettings: async () => fetchAPI('/settings'),
    updateSettings: async (settings: SystemSettings) => fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(settings) }),
    getDepartments: async () => fetchAPI('/departments'),
    createDepartment: async (dept: Department) => fetchAPI('/departments', { method: 'POST', body: JSON.stringify(dept) }),
    updateDepartment: async (dept: Department) => fetchAPI(`/departments/${dept.id}`, { method: 'PUT', body: JSON.stringify(dept) }),
    deleteDepartment: async (id: string) => fetchAPI(`/departments/${id}`, { method: 'DELETE' }),
};

// ============================================================
// MASTER DATA SERVICE (Categories & SubActivities)
// ============================================================
export const masterDataService = {
    getCategories: async () => fetchAPI('/categories'),
    createCategory: async (cat: Category) => fetchAPI('/categories', { method: 'POST', body: JSON.stringify(cat) }),
    updateCategory: async (cat: Category) => fetchAPI(`/categories/${cat.id}`, { method: 'PUT', body: JSON.stringify(cat) }),
    deleteCategory: async (id: string) => fetchAPI(`/categories/${id}`, { method: 'DELETE' }),

    getSubActivities: async () => fetchAPI('/sub-activities'),
    createSubActivity: async (sub: SubActivity) => fetchAPI('/sub-activities', { method: 'POST', body: JSON.stringify(sub) }),
    updateSubActivity: async (sub: SubActivity) => fetchAPI(`/sub-activities/${sub.id}`, { method: 'PUT', body: JSON.stringify(sub) }),
    deleteSubActivity: async (id: string) => fetchAPI(`/sub-activities/${id}`, { method: 'DELETE' }),
};

// ============================================================
// BUDGET SERVICE
// ============================================================
export const budgetService = {
    getRequests: async () => fetchAPI('/requests'),
    createRequest: async (req: BudgetRequest) => fetchAPI('/requests', { method: 'POST', body: JSON.stringify(req) }),

    // Status Updates
    updateRequestStatus: async (id: string, status: string) => fetchAPI(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    approveRequest: async (id: string, approverId: string) => fetchAPI(`/requests/${id}/approve`, { method: 'PUT', body: JSON.stringify({ approverId }) }),
    rejectRequest: async (id: string, approverId: string, reason: string) => fetchAPI(`/requests/${id}/reject`, { method: 'PUT', body: JSON.stringify({ approverId, reason }) }),
    completeRequest: async (id: string) => fetchAPI(`/requests/${id}/complete`, { method: 'PUT' }),
    revertComplete: async (id: string) => fetchAPI(`/requests/${id}/revert-complete`, { method: 'PUT' }),

    // Expense Report
    // Route: router.put('/requests/:id/submit-expense', budgetController.submitExpense);
    submitExpenseReport: async (id: string, data: { expenseItems: any[], actualTotal: number, returnAmount: number }) =>
        fetchAPI(`/requests/${id}/submit-expense`, { method: 'PUT', body: JSON.stringify(data) }),

    // Route: router.put('/requests/:id/reject-expense', budgetController.rejectExpense);
    rejectExpenseReport: async (id: string, reason: string) =>
        fetchAPI(`/requests/${id}/reject-expense`, { method: 'PUT', body: JSON.stringify({ reason }) }),

    deleteRequest: async (id: string) => fetchAPI(`/requests/${id}`, { method: 'DELETE' }),

    // Budget Plans
    getPlans: async (year?: number) => fetchAPI(`/budget-plans${year ? `?year=${year}` : ''}`),
    savePlan: async (plan: Omit<BudgetPlan, 'id' | 'updatedAt'>) => fetchAPI('/budget-plans', { method: 'POST', body: JSON.stringify(plan) }),

    // Budget Adjustments (Moved to Category Controller)
    adjustBudget: async (categoryId: string, data: { amount: number, type: string, reason: string, user?: string }) =>
        fetchAPI(`/categories/${categoryId}/adjust`, { method: 'POST', body: JSON.stringify(data) }),

    getLogs: async (categoryId: string) => fetchAPI(`/categories/${categoryId}/logs`),
};

// ============================================================
// EXPENSE SERVICE
// ============================================================
export const expenseService = {
    create: async (expense: Omit<Expense, 'id' | 'createdAt'>) => fetchAPI('/expenses', { method: 'POST', body: JSON.stringify(expense) }),
    getAll: async (categoryId: string) => fetchAPI(`/categories/${categoryId}/expenses`),
    delete: async (id: string) => fetchAPI(`/expenses/${id}`, { method: 'DELETE' }),
};

// ============================================================
// ACTIVITY LOG SERVICE
// ============================================================
export const activityLogService = {
    getAll: async () => fetchAPI('/activity-logs'),
};
