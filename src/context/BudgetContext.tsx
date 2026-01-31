
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetRequest, Category, BudgetContextType, SubActivity, SystemSettings, Department, Expense, User, BudgetPlan, BudgetLog } from '../types';
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
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subActivities, setSubActivities] = useState<SubActivity[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    orgName: 'DCC Company Ltd.',
    fiscalYear: 2569,
    overBudgetAlert: false,
    fiscalYearCutoff: '2026-09-30'
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  // Initial User (Load from LocalStorage)
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dcc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>([]); // User Management List
  const [budgetPlans, setBudgetPlans] = useState<BudgetPlan[]>([]); // New

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          reqData,
          catData,
          subData,
          setData,
          userData,
          planData,
          deptData
        ] = await Promise.all([
          budgetService.getRequests().catch(() => []),
          masterDataService.getCategories().catch(() => []),
          masterDataService.getSubActivities().catch(() => []),
          systemService.getSettings().catch(() => null),
          userService.getAll().catch(() => []),
          budgetService.getPlans().catch(() => []),
          systemService.getDepartments().catch(() => [])
        ]);

        if (reqData) setRequests(reqData);
        if (catData) setCategories(catData);
        if (subData) setSubActivities(subData);
        if (setData) setSettings(setData);
        if (userData) setUsers(userData);
        if (planData) setBudgetPlans(planData);
        if (deptData) setDepartments(deptData);

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchData();
  }, []);

  const updateSettings = async (newSettings: SystemSettings) => {
    try {
      await systemService.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const addDepartment = async (department: Department) => {
    try {
      const savedDept = await systemService.createDepartment(department);
      setDepartments(prev => [...prev, savedDept]);
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Error adding department: " + error);
    }
  };

  const updateDepartment = async (department: Department) => {
    try {
      const updatedDept = await systemService.updateDepartment(department);
      setDepartments(prev => prev.map(d => d.id === department.id ? updatedDept : d));
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Error updating department: " + error);
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      await systemService.deleteDepartment(id);
      setDepartments(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Error deleting department: " + error);
    }
  };

  const addRequest = async (request: BudgetRequest) => {
    try {
      const savedReq = await budgetService.createRequest(request);
      setRequests(prev => [savedReq, ...prev]);
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const updateRequestStatus = async (id: string, status: BudgetRequest['status']) => {
    try {
      const updatedReq = await budgetService.updateRequestStatus(id, status);
      setRequests(prev => prev.map(req => req.id === id ? updatedReq : req));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await budgetService.deleteRequest(id);
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const addCategory = async (category: Category) => {
    try {
      const savedCat = await masterDataService.createCategory(category);
      setCategories(prev => [...prev, savedCat]);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    try {
      const savedCat = await masterDataService.updateCategory(updatedCategory);
      setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? savedCat : cat));
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await masterDataService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const addSubActivity = async (subActivity: SubActivity) => {
    try {
      const savedSub = await masterDataService.createSubActivity(subActivity);
      setSubActivities(prev => [...prev, savedSub]);
    } catch (error) {
      console.error("Error adding sub activity:", error);
    }
  };

  const deleteSubActivity = async (id: string) => {
    try {
      await masterDataService.deleteSubActivity(id);
      setSubActivities(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error("Error deleting sub activity:", error);
    }
  };

  const getDashboardStats = () => {
    const currentYearCategories = categories.filter(cat => cat.year === settings.fiscalYear);
    const validCategoryNames = new Set(currentYearCategories.map(c => c.name));
    const totalBudget = currentYearCategories.reduce((sum, cat) => sum + cat.allocated, 0);

    const currentYearRequests = requests.filter(req => validCategoryNames.has(req.category));

    const totalUsed = currentYearRequests
      .filter(req => req.status === 'approved')
      .reduce((sum, req) => sum + req.amount, 0);

    const totalPending = currentYearRequests
      .filter(req => req.status === 'pending')
      .reduce((sum, req) => sum + req.amount, 0);

    const totalRemaining = totalBudget - totalUsed;
    const usagePercentage = totalBudget > 0 ? (totalUsed / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalUsed,
      totalPending,
      totalRemaining,
      usagePercentage
    };
  };

  const adjustBudget = async (categoryId: string, amount: number, type: 'ADD' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'REDUCE', reason: string) => {
    try {
      const updatedCategory = await budgetService.adjustBudget(categoryId, { amount, type, reason, user: user?.username });
      setCategories(prev => prev.map(cat => cat.id === categoryId ? updatedCategory : cat));
    } catch (error) {
      console.error("Error adjusting budget:", error);
    }
  };

  const getBudgetLogs = async (categoryId: string): Promise<BudgetLog[]> => {
    try {
      return await budgetService.getLogs(categoryId);
    } catch (error) {
      console.error("Error fetching logs:", error);
      return [];
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      await expenseService.create(expense);
      // Refresh categories to get updated 'used' amount
      const updatedCategories = await masterDataService.getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const getExpenses = async (categoryId: string): Promise<Expense[]> => {
    try {
      return await expenseService.getAll(categoryId);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseService.delete(id);
      // Refresh categories to get updated 'used' amount
      const updatedCategories = await masterDataService.getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const userData = await authService.login({ username, password });
      setUser(userData);
      localStorage.setItem('dcc_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dcc_user');
  };

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = await authService.updateProfile(user.id, updatedData);
      setUser(updatedUser);
      localStorage.setItem('dcc_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const changePassword = async (current: string, newPass: string) => {
    if (!user) return;
    try {
      await authService.changePassword({ userId: user.id, currentPassword: current, newPassword: newPass });
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  const updateUser = async (id: string, updatedData: Partial<User>) => {
    try {
      const updatedUser = await userService.update(id, updatedData);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(error.message || "Failed to update user");
      throw error;
    }
  };

  const addUser = async (newUser: Partial<User>) => {
    try {
      const createdUser = await userService.create(newUser);
      setUsers(prev => [createdUser, ...prev]);
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(error.message || "Failed to add user");
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const saveBudgetPlan = async (plan: Omit<BudgetPlan, 'id' | 'updatedAt'>) => {
    try {
      const savedPlan = await budgetService.savePlan(plan);
      setBudgetPlans(prev => {
        const existingIndex = prev.findIndex(p =>
          p.subActivityId === savedPlan.subActivityId &&
          p.year === savedPlan.year &&
          p.month === savedPlan.month
        );

        if (existingIndex >= 0) {
          const newPlans = [...prev];
          newPlans[existingIndex] = savedPlan;
          return newPlans;
        } else {
          return [...prev, savedPlan];
        }
      });
    } catch (error) {
      console.error("Error saving budget plan:", error);
    }
  };

  return (
    <BudgetContext.Provider value={{
      requests,
      categories,
      subActivities,
      settings,
      departments,
      user,
      users,
      login,
      logout,
      updateUserProfile,
      updateUser,
      addUser,
      deleteUser,
      changePassword,
      addRequest,
      updateRequestStatus,
      deleteRequest,
      addCategory,
      updateCategory,
      deleteCategory,
      addSubActivity,
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
        if (data.requests) setRequests(data.requests);
        if (data.categories) setCategories(data.categories);
        if (data.settings) setSettings(data.settings);
        if (data.departments) setDepartments(data.departments);
        if (data.currentUser) setUser(data.currentUser);
        alert('Data restored successfully (Session only)');
      }
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
