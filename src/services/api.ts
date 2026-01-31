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
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || response.statusText || 'API request failed');
    }

    // Some endpoints might return empty body (e.g. DELETE)
    if (response.status === 204) return {} as T;

    return response.json();
}

export const authService = {
    login: (credentials: { username: string; password: string }) =>
        request<User>('/login', { method: 'POST', body: JSON.stringify(credentials) }),

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
    deleteSubActivity: (id: string) => request<{ success: boolean }>(`/sub-activities/${id}`, { method: 'DELETE' }),
};

export const budgetService = {
    getRequests: () => request<BudgetRequest[]>('/requests'),
    createRequest: (req: BudgetRequest) => request<BudgetRequest>('/requests', { method: 'POST', body: JSON.stringify(req) }),
    updateRequestStatus: (id: string, status: string) => request<BudgetRequest>(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
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
