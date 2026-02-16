import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BudgetRequest, Category, BudgetContextType, SubActivity, SystemSettings, Department, Expense, User, BudgetPlan, BudgetLog, Permission } from '../types';
import {
  authService,
  userService,
  systemService,
  masterDataService,
  budgetService,
  expenseService
} from '../services/api';

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // --- Client State (Session) ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dcc_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Theme Management
  useEffect(() => {
    if (user?.theme) {
      document.documentElement.setAttribute('data-theme', user.theme);
    } else {
      document.documentElement.setAttribute('data-theme', 'blue'); // Default
    }
  }, [user?.theme]);

  const changeTheme = async (newTheme: string) => {
    if (user) {
      const updatedUser = { ...user, theme: newTheme as any };
      setUser(updatedUser);
      localStorage.setItem('dcc_user', JSON.stringify(updatedUser));
      document.documentElement.setAttribute('data-theme', newTheme);

      // Persist to backend
      try {
        await userService.update(user.id, { theme: newTheme as any });
      } catch (err) {
        console.error("Failed to persist theme", err);
      }
    }
  };


  // --- Server State (Queries) ---
  const { data: requests = [] } = useQuery({ queryKey: ['requests'], queryFn: budgetService.getRequests, enabled: !!user });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: masterDataService.getCategories, enabled: !!user });

  useEffect(() => {
    console.log("[BudgetContext] User:", user);
    console.log("[BudgetContext] Requests:", requests);
    console.log("[BudgetContext] Categories:", categories);
  }, [user, requests, categories]);

  const { data: subActivities = [] } = useQuery({ queryKey: ['subActivities'], queryFn: masterDataService.getSubActivities, enabled: !!user });
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: systemService.getDepartments, enabled: !!user });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: userService.getAll, enabled: !!user });
  const { data: budgetPlans = [] } = useQuery({ queryKey: ['budgetPlans'], queryFn: () => budgetService.getPlans(), enabled: !!user });

  const { data: settings = {
    orgName: 'DCC Company Ltd.',
    fiscalYear: 2569,
    overBudgetAlert: false,
    fiscalYearCutoff: '2026-09-30'
  } as SystemSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: systemService.getSettings,
    enabled: !!user,
    initialData: {
      orgName: 'DCC Company Ltd.',
      fiscalYear: 2569,
      overBudgetAlert: false,
      fiscalYearCutoff: '2026-09-30',
      permissions: {}
    }
  });

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;

    const rolePermissions = settings.permissions?.[user.role] || [];
    return rolePermissions.includes(permission);
  };

  // --- Mutations (Actions) ---

  // User Actions
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ username, password });
      setUser(response.user);
      localStorage.setItem('dcc_user', JSON.stringify(response.user));
      localStorage.setItem('dcc_token', response.token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const loginWithGoogle = async (token: string): Promise<boolean> => {
    try {
      const response = await authService.loginWithGoogle(token);
      setUser(response.user);
      localStorage.setItem('dcc_user', JSON.stringify(response.user));
      localStorage.setItem('dcc_token', response.token);
      return true;
    } catch (error) {
      console.error("Google Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dcc_user');
    localStorage.removeItem('dcc_token');
    queryClient.clear(); // Clear cache on logout
  };

  const updateUserProfileMutation = useMutation({
    mutationFn: (updatedData: Partial<User>) => {
      if (!user) throw new Error("No user");
      return authService.updateProfile(user.id, updatedData);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem('dcc_user', JSON.stringify(updatedUser));
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ current, newPass }: { current: string, newPass: string }) => {
      if (!user) throw new Error("No user");
      return authService.changePassword({ userId: user.id, currentPassword: current, newPassword: newPass });
    }
  });

  // Admin User Management
  const addUserMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<User> }) => userService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });

  // Settings & Departments
  const updateSettingsMutation = useMutation({
    mutationFn: systemService.updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
  });

  const addDepartmentMutation = useMutation({
    mutationFn: systemService.createDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] })
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: systemService.updateDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] })
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: systemService.deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] })
  });

  // Master Data
  const addCategoryMutation = useMutation({
    mutationFn: masterDataService.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const updateCategoryMutation = useMutation({
    mutationFn: masterDataService.updateCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }) // Expense/Budget updates affect this too
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: masterDataService.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const addSubActivityMutation = useMutation({
    mutationFn: masterDataService.createSubActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subActivities'] })
  });

  const updateSubActivityMutation = useMutation({
    mutationFn: masterDataService.updateSubActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subActivities'] })
  });

  const deleteSubActivityMutation = useMutation({
    mutationFn: masterDataService.deleteSubActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subActivities'] })
  });

  // ...

  // Requests
  const addRequestMutation = useMutation({
    mutationFn: budgetService.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Used budget changes
    }
  });

  const updateRequestStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: BudgetRequest['status'] }) => budgetService.updateRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const approveRequestMutation = useMutation({
    mutationFn: ({ id, approverId }: { id: string, approverId: string }) => budgetService.approveRequest(id, approverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const rejectRequestMutation = useMutation({
    mutationFn: ({ id, approverId, reason }: { id: string, approverId: string, reason: string }) => budgetService.rejectRequest(id, approverId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });

  const submitExpenseReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: { expenseItems: any[], actualTotal: number, returnAmount: number } }) => budgetService.submitExpenseReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });

  const rejectExpenseReportMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => budgetService.rejectExpenseReport(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });

  const completeRequestMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => budgetService.completeRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  // ... (deleteRequestMutation)

  const submitExpenseReport = async (id: string, data: { expenseItems: any[], actualTotal: number, returnAmount: number }) => { await submitExpenseReportMutation.mutateAsync({ id, data }); };
  const rejectExpenseReport = async (id: string, reason: string) => { await rejectExpenseReportMutation.mutateAsync({ id, reason }); };
  const completeRequest = async (id: string) => { await completeRequestMutation.mutateAsync({ id }); };

  const deleteRequestMutation = useMutation({
    mutationFn: budgetService.deleteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  // Budget Adjustments
  const adjustBudgetMutation = useMutation({
    mutationFn: (data: { categoryId: string, amount: number, type: any, reason: string, user?: string }) =>
      budgetService.adjustBudget(data.categoryId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  // Expenses
  const addExpenseMutation = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: expenseService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  /* Duplicate completeRequest removed */

  const revertCompleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => budgetService.revertComplete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const revertComplete = async (id: string) => { await revertCompleteMutation.mutateAsync({ id }); };

  const saveBudgetPlanMutation = useMutation({
    mutationFn: budgetService.savePlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgetPlans'] })
  });

  // --- Derived State (Stats) ---
  const getDashboardStats = () => {
    const currentYearCategories = categories.filter(cat => cat.year === settings.fiscalYear);
    const validCategoryNames = new Set(currentYearCategories.map(c => c.name));
    const totalBudget = currentYearCategories.reduce((sum, cat) => sum + cat.allocated, 0);

    const currentYearRequests = requests.filter(req => validCategoryNames.has(req.category));

    const totalUsed = currentYearCategories.reduce((sum, cat) => sum + (cat.used || 0), 0);

    const totalPending = currentYearRequests
      .filter(req => req.status === 'pending')
      .reduce((sum, req) => sum + req.amount, 0);

    const totalActual = currentYearRequests
      .filter(req => req.status === 'completed')
      .reduce((sum, req) => sum + (req.actualAmount || 0), 0);

    const totalRemaining = totalBudget - totalUsed;
    const usagePercentage = totalBudget > 0 ? (totalUsed / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalUsed,
      totalActual, // New field
      totalPending,
      totalRemaining,
      usagePercentage
    };
  };

  // Helper Wrappers (to match old Context API)
  const updateUserProfile = async (data: Partial<User>) => { await updateUserProfileMutation.mutateAsync(data); };
  const changePassword = async (current: string, newPass: string) => { await changePasswordMutation.mutateAsync({ current, newPass }); };
  const addUser = async (data: Partial<User>) => { await addUserMutation.mutateAsync(data); };
  const updateUser = async (id: string, data: Partial<User>) => { await updateUserMutation.mutateAsync({ id, data }); };
  const deleteUser = async (id: string) => { await deleteUserMutation.mutateAsync(id); };

  const updateSettings = async (s: SystemSettings) => { await updateSettingsMutation.mutateAsync(s); };
  const addDepartment = async (d: Department) => { await addDepartmentMutation.mutateAsync(d); };
  const updateDepartment = async (d: Department) => { await updateDepartmentMutation.mutateAsync(d); };
  const deleteDepartment = async (id: string) => { await deleteDepartmentMutation.mutateAsync(id); };

  const addCategory = async (c: Category) => { await addCategoryMutation.mutateAsync(c); };
  const updateCategory = async (c: Category) => { await updateCategoryMutation.mutateAsync(c); };
  const deleteCategory = async (id: string) => { await deleteCategoryMutation.mutateAsync(id); };

  const addSubActivity = async (s: SubActivity) => { await addSubActivityMutation.mutateAsync(s); };
  const updateSubActivity = async (s: SubActivity) => { await updateSubActivityMutation.mutateAsync(s); };
  const deleteSubActivity = async (id: string) => { await deleteSubActivityMutation.mutateAsync(id); };

  const addRequest = async (r: BudgetRequest) => { await addRequestMutation.mutateAsync(r); };
  const updateRequestStatus = async (id: string, status: BudgetRequest['status']) => { await updateRequestStatusMutation.mutateAsync({ id, status }); };
  const approveRequest = async (id: string, approverId: string) => { await approveRequestMutation.mutateAsync({ id, approverId }); };
  const rejectRequest = async (id: string, approverId: string, reason: string) => { await rejectRequestMutation.mutateAsync({ id, approverId, reason }); };

  const deleteRequest = async (id: string) => { await deleteRequestMutation.mutateAsync(id); };

  const adjustBudget = async (categoryId: string, amount: number, type: 'ADD' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'REDUCE', reason: string) => {
    await adjustBudgetMutation.mutateAsync({ categoryId, amount, type, reason, user: user?.username });
  };

  const addExpense = async (e: Omit<Expense, 'id' | 'createdAt'>) => { await addExpenseMutation.mutateAsync(e); };
  const deleteExpense = async (id: string) => { await deleteExpenseMutation.mutateAsync(id); };
  const saveBudgetPlan = async (p: Omit<BudgetPlan, 'id' | 'updatedAt'>) => { await saveBudgetPlanMutation.mutateAsync(p); };

  const getExpenses = async (categoryId: string): Promise<Expense[]> => {
    return expenseService.getAll(categoryId); // Direct call still ok, or could be a Query
  };

  const getBudgetLogs = async (categoryId: string): Promise<BudgetLog[]> => {
    return budgetService.getLogs(categoryId);
  };

  return (
    <BudgetContext.Provider value={{
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
      addExpense,
      getExpenses,
      deleteExpense,
      budgetPlans,
      saveBudgetPlan,
      restoreData: (data: any) => {
        // Naive restore: just set cache
        if (data.requests) queryClient.setQueryData(['requests'], data.requests);
        if (data.categories) queryClient.setQueryData(['categories'], data.categories);
        if (data.settings) queryClient.setQueryData(['settings'], data.settings);
        alert('Data restored to Cache');
      },
      changeTheme
    }}>
      {children}
    </BudgetContext.Provider >
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
