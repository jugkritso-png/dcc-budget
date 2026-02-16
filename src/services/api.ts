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

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('dcc_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
    };

    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API Request] ${endpoint}`, options);
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers,
        ...options,
    });

    if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('dcc_token');
        localStorage.removeItem('dcc_user');
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
        throw new Error('Unauthorized');
    }


    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        let errorMessage = errorBody.error || response.statusText || 'API request failed';

        // Append validation details if available
        if (errorBody.details && Array.isArray(errorBody.details)) {
            const details = errorBody.details.map((d: any) => `${d.path}: ${d.message}`).join(', ');
            errorMessage += ` (${details})`;
        }

        throw new Error(errorMessage);
    }

    // Some endpoints might return empty body (e.g. DELETE)
    if (response.status === 204) return {} as T;

    return response.json();
}

export const authService = {
    login: (credentials: { username: string; password: string }) =>
        request<{ user: User; token: string }>('/login', { method: 'POST', body: JSON.stringify(credentials) }),

    loginWithGoogle: (token: string) =>
        request<{ user: User; token: string }>('/google', { method: 'POST', body: JSON.stringify({ token }) }),

    updateProfile: (id: string, data: Partial<User>) =>
        request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    changePassword: (data: any) =>
        request<{ success: boolean }>('/users/change-password', { method: 'POST', body: JSON.stringify(data) }),
};

export const userService = {
    getAll: () => request<User[]>('/users'),
    create: (user: Partial<User>) => request<User>('/users', { method: 'POST', body: JSON.stringify(user) }),
    update: (id: string, user: Partial<User>) => request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
    delete: (id: string) => request<{ success: boolean }>(`/users/${id}`, { method: 'DELETE' }),
};

export const systemService = {
    getSettings: () => request<SystemSettings>('/settings'),
    updateSettings: (settings: SystemSettings) => request<{ success: boolean }>('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

    getDepartments: () => request<Department[]>('/departments'),
    createDepartment: (dept: Department) => request<Department>('/departments', { method: 'POST', body: JSON.stringify(dept) }),
    updateDepartment: (dept: Department) => request<Department>(`/departments/${dept.id}`, { method: 'PUT', body: JSON.stringify(dept) }),
    deleteDepartment: (id: string) => request<{ success: boolean }>(`/departments/${id}`, { method: 'DELETE' }),
};

export const masterDataService = {
    getCategories: () => request<Category[]>('/categories'),
    createCategory: (cat: Category) => request<Category>('/categories', { method: 'POST', body: JSON.stringify(cat) }),
    updateCategory: (cat: Category) => request<Category>(`/categories/${cat.id}`, { method: 'PUT', body: JSON.stringify(cat) }),
    deleteCategory: (id: string) => request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),

    getSubActivities: () => request<SubActivity[]>('/sub-activities'),
    createSubActivity: (sub: SubActivity) => request<SubActivity>('/sub-activities', { method: 'POST', body: JSON.stringify(sub) }),
    updateSubActivity: (sub: SubActivity) => request<SubActivity>(`/sub-activities/${sub.id}`, { method: 'PUT', body: JSON.stringify(sub) }),
    deleteSubActivity: (id: string) => request<{ success: boolean }>(`/sub-activities/${id}`, { method: 'DELETE' }),
};

export const budgetService = {
    getRequests: () => request<BudgetRequest[]>('/requests'),
    createRequest: (req: BudgetRequest) => request<BudgetRequest>('/requests', { method: 'POST', body: JSON.stringify(req) }),
    updateRequestStatus: (id: string, status: string) => request<BudgetRequest>(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    approveRequest: (id: string, approverId: string) => request<BudgetRequest>(`/requests/${id}/approve`, { method: 'PUT', body: JSON.stringify({ approverId }) }),
    rejectRequest: (id: string, approverId: string, reason: string) => request<BudgetRequest>(`/requests/${id}/reject`, { method: 'PUT', body: JSON.stringify({ approverId, reason }) }),
    completeRequest: (id: string) => request<BudgetRequest>(`/requests/${id}/complete`, { method: 'PUT' }),
    submitExpenseReport: (id: string, data: { expenseItems: any[], actualTotal: number, returnAmount: number }) => request<BudgetRequest>(`/requests/${id}/submit-expense`, { method: 'PUT', body: JSON.stringify(data) }),
    rejectExpenseReport: (id: string, reason: string) => request<BudgetRequest>(`/requests/${id}/reject-expense`, { method: 'PUT', body: JSON.stringify({ reason }) }),
    revertComplete: (id: string) => request<BudgetRequest>(`/requests/${id}/revert-complete`, { method: 'PUT' }),
    deleteRequest: (id: string) => request<{ success: boolean }>(`/requests/${id}`, { method: 'DELETE' }),

    getPlans: (year?: number) => request<BudgetPlan[]>(`/budget-plans${year ? `?year=${year}` : ''}`),
    savePlan: (plan: Omit<BudgetPlan, 'id' | 'updatedAt'>) => request<BudgetPlan>('/budget-plans', { method: 'POST', body: JSON.stringify(plan) }),

    adjustBudget: (categoryId: string, data: { amount: number, type: string, reason: string, user?: string }) =>
        request<Category>(`/categories/${categoryId}/adjust`, { method: 'POST', body: JSON.stringify(data) }),

    getLogs: (categoryId: string) => request<BudgetLog[]>(`/categories/${categoryId}/logs`),
};

export const expenseService = {
    create: (expense: Omit<Expense, 'id' | 'createdAt'>) => request<Expense>('/expenses', { method: 'POST', body: JSON.stringify(expense) }),
    getAll: (categoryId: string) => request<Expense[]>(`/categories/${categoryId}/expenses`),
    delete: (id: string) => request<{ success: boolean }>(`/expenses/${id}`, { method: 'DELETE' }),
};
