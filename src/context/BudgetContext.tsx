'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BudgetRequest, Category, BudgetContextType, SubActivity, SystemSettings, Department, Expense, User, BudgetPlan, BudgetLog, Permission, Notification, ActivityLog, ApprovalLog } from '../types';
import {
  authService,
  userService,
  systemService,
  masterDataService,
  budgetService,
  expenseService,
  notificationService,
  activityLogService
} from '../services/api';
import { createClient } from '../lib/supabase/client';

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // --- Client State (Session) ---
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const savedSidebar = localStorage.getItem('dcc_sidebar_collapsed');
    if (savedSidebar) {
      setIsSidebarCollapsed(savedSidebar === 'true');
    }

    const checkSession = async () => {
      if (typeof window === 'undefined') return;

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
                setUser({ ...parsedUser, ...dbUser });
                localStorage.setItem('dcc_user', JSON.stringify({ ...parsedUser, ...dbUser }));
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
        } catch (e) { console.error(e) }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
                const mergedUser = { ...session.user, ...result.profile };
                setUser(mergedUser as User);
                localStorage.setItem('dcc_user', JSON.stringify(mergedUser));
              }
            }
          } catch (e) { console.error("API fetch error on auth change", e); }
        }
      });
      return () => subscription.unsubscribe();
    };
    checkSession();
  }, [queryClient, supabase.auth]);

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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('dcc_sidebar_collapsed', String(next));
      return next;
    });
  };


  // --- Server State (Queries) ---
  // staleTime: 5 min — prevents refetch on every tab focus / mount
  const STALE = 5 * 60 * 1000;

  const { data: requests = [] } = useQuery({ queryKey: ['requests'], queryFn: budgetService.getRequests, enabled: !!user, staleTime: STALE });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: masterDataService.getCategories, enabled: !!user, staleTime: STALE });
  const { data: subActivities = [] } = useQuery({ queryKey: ['subActivities'], queryFn: masterDataService.getSubActivities, enabled: !!user, staleTime: STALE });
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: systemService.getDepartments, enabled: !!user, staleTime: STALE });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: userService.getAll, enabled: !!user, staleTime: STALE });
  const { data: budgetPlans = [] } = useQuery({ queryKey: ['budgetPlans'], queryFn: () => budgetService.getPlans(), enabled: !!user, staleTime: STALE });
  const { data: expenses = [] } = useQuery({ queryKey: ['expenses'], queryFn: () => expenseService.getAll(), enabled: !!user, staleTime: STALE });
  const { data: budgetLogs = [] } = useQuery({ queryKey: ['budgetLogs'], queryFn: () => budgetService.getLogs(), enabled: !!user, staleTime: STALE });
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications', user?.id], queryFn: () => notificationService.getAll(user!.id), enabled: !!user, staleTime: STALE });
  const { data: activityLogs = [] } = useQuery({ queryKey: ['activityLogs'], queryFn: activityLogService.getAll, enabled: !!user && user.role === 'admin', staleTime: STALE });

  // Real-time Notifications Subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Notification',
          filter: `userId=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });

          // Optional: Browser notification or toast
          if (typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted') {
            new window.Notification(payload.new.title, { body: payload.new.message });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, queryClient]);

  const logActivityMutation = useMutation({
    mutationFn: (log: Omit<ActivityLog, 'id' | 'createdAt' | 'user'>) => activityLogService.log(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    }
  });

  const logActivity = async (action: string, details: string, entityId?: string, entityType?: string) => {
    if (!user) return;
    try {
      await logActivityMutation.mutateAsync({
        userId: user.id,
        action,
        details,
        entityId,
        entityType,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
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
  } as SystemSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: systemService.getSettings,
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

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role?.toLowerCase() === 'admin') return true;

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

      // Log login activity
      activityLogService.log({
        userId: response.user.id,
        action: 'LOGIN',
        details: 'เข้าสู่ระบบด้วยชื่อผู้ใช้งาน',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      }).catch(err => console.error('Failed to log login:', err));

      return true;
    } catch (error) {
      console.error("Login Error in Context:", error);
      throw error; // Forward the error to the component so we can see the message
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

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('dcc_user');
    localStorage.removeItem('dcc_token');
    queryClient.clear(); // Clear cache on logout

    // Immediate redirect to login with a full reload to ensure clear state
    window.location.href = '/login';
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      logActivity('CREATE_USER', `สร้างผู้ใช้งานใหม่: ${data.name} (@${data.username})`, data.id, 'User');
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<User> }) => userService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      logActivity('UPDATE_USER', `แก้ไขข้อมูลผู้ใช้งาน: ${data.name} (@${data.username})`, data.id, 'User');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      logActivity('DELETE_USER', `ลบผู้ใช้งาน (ID: ${id})`, id, 'User');
    }
  });

  // Settings & Departments
  const updateSettingsMutation = useMutation({
    mutationFn: systemService.updateSettings,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      logActivity('UPDATE_SETTINGS', `แก้ไขการตั้งค่าระบบ: ปีงบประมาณ ${variables.fiscalYear}`, 'system', 'Settings');
    }
  });

  const addDepartmentMutation = useMutation({
    mutationFn: systemService.createDepartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      logActivity('CREATE_DEPARTMENT', `เพิ่มแผนกใหม่: ${data.name}`, data.id, 'Department');
    }
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: systemService.updateDepartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      logActivity('UPDATE_DEPARTMENT', `แก้ไขข้อมูลแผนก: ${data.name}`, data.id, 'Department');
    }
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: systemService.deleteDepartment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      logActivity('DELETE_DEPARTMENT', `ลบแผนก (ID: ${id})`, id, 'Department');
    }
  });

  // Master Data
  const addCategoryMutation = useMutation({
    mutationFn: masterDataService.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  });

  const updateCategoryMutation = useMutation({
    mutationFn: masterDataService.updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      logActivity('UPDATE_CATEGORY', `แก้ไขข้อมูลหมวดหมู่: ${data.name}`, data.id, 'Category');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: masterDataService.deleteCategory,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      logActivity('DELETE_CATEGORY', `ลบหมวดหมู่ (ID: ${id})`, id, 'Category');
    }
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });

      if (data.requesterId) {
        sendNotification(
          data.requesterId,
          'คำขอโครงการได้รับอนุมัติ ✅',
          `โครงการ "${data.project}" ได้รับการอนุมัติแล้ว`,
          'success',
          `/budget?id=${data.id}`
        );
      }

      logActivity(
        'APPROVE_REQUEST',
        `อนุมัติโครงการ: ${data.project} (งบประมาณ: ${data.amount.toLocaleString()} บาท)`,
        data.id,
        'BudgetRequest'
      );
    }
  });

  const rejectRequestMutation = useMutation({
    mutationFn: ({ id, approverId, reason }: { id: string, approverId: string, reason: string }) => budgetService.rejectRequest(id, approverId, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });

      if (data.requesterId) {
        sendNotification(
          data.requesterId,
          'คำขอโครงการถูกปฏิเสธ ❌',
          `โครงการ "${data.project}" ถูกปฏิเสธ: ${variables.reason}`,
          'error',
          `/budget?id=${data.id}`
        );
      }

      logActivity(
        'REJECT_REQUEST',
        `ปฏิเสธโครงการ: ${data.project} (เหตุผล: ${variables.reason})`,
        data.id,
        'BudgetRequest'
      );
    }
  });

  const submitExpenseReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: { expenseItems: any[], actualTotal: number, returnAmount: number } }) => budgetService.submitExpenseReport(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });

      // Notify approvers/finance
      const admins = users.filter(u => u.role === 'admin' || u.role === 'approver' || u.role === 'finance');
      admins.forEach(admin => {
        if (admin.id !== user?.id) {
          sendNotification(
            admin.id,
            'รายงานผลการใช้จ่ายใหม่ 📑',
            `มีการส่งรายงานผลสำหรับโครงการ "${data.project}" รอการตรวจสอบ`,
            'primary',
            `/budget?id=${data.id}`
          );
        }
      });

      logActivity(
        'SUBMIT_EXPENSE',
        `ส่งรายงานผลการใช้จ่ายโครงการ: ${data.project} (จำนวนเงิน: ${data.actualAmount?.toLocaleString()} บาท)`,
        data.id,
        'BudgetRequest'
      );
    }
  });

  const rejectExpenseReportMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => budgetService.rejectExpenseReport(id, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });

      if (data.requesterId) {
        sendNotification(
          data.requesterId,
          'รายงานผลการใช้จ่ายถูกส่งคืน ⚠️',
          `รายงานผลสำหรับโครงการ "${data.project}" ถูกส่งคืนให้แก้ไข: ${variables.reason}`,
          'warning',
          `/budget?id=${data.id}`
        );
      }

      logActivity(
        'REJECT_EXPENSE',
        `ส่งคืนรายงานผลการใช้จ่ายโครงการ: ${data.project} (เหตุผล: ${variables.reason})`,
        data.id,
        'BudgetRequest'
      );
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

  const submitExpenseReport = async (id: string, data: { expenseItems: any[], actualTotal: number, returnAmount: number, attachments?: string[] }) => { await submitExpenseReportMutation.mutateAsync({ id, data }); };
  const rejectExpenseReport = async (id: string, reason: string) => { await rejectExpenseReportMutation.mutateAsync({ id, reason }); };
  const completeRequest = async (id: string) => { await completeRequestMutation.mutateAsync({ id }); };
  const uploadAttachment = async (file: File) => { return await budgetService.uploadAttachment(file); };

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

  // --- Derived State (Stats) — memoized so it only recomputes when source data changes ---
  const dashboardStats = useMemo(() => {
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
    return { totalBudget, totalUsed, totalActual, totalPending, totalRemaining, usagePercentage };
  }, [categories, requests, settings.fiscalYear]);

  const getDashboardStats = useCallback(() => dashboardStats, [dashboardStats]);

  // Helper Wrappers (to match old Context API)
  const updateUserProfile = async (data: Partial<User>) => { await updateUserProfileMutation.mutateAsync(data); };
  const changePassword = async (current: string, newPass: string) => { await changePasswordMutation.mutateAsync({ current, newPass }); };
  const addUser = async (data: Partial<User>) => { await addUserMutation.mutateAsync(data); };
  const updateUser = async (id: string, data: Partial<User>) => { await updateUserMutation.mutateAsync({ id, data }); };
  const deleteUser = async (id: string) => { await deleteUserMutation.mutateAsync(id); };

  const markNotificationAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
  });

  const markAllNotificationsAsReadMutation = useMutation({
    mutationFn: (userId: string) => notificationService.markAllAsRead(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })
  });

  const markNotificationAsRead = async (id: string) => { await markNotificationAsReadMutation.mutateAsync(id); };
  const markAllNotificationsAsRead = async () => { if (user) await markAllNotificationsAsReadMutation.mutateAsync(user.id); };
  const deleteNotification = async (id: string) => { await deleteNotificationMutation.mutateAsync(id); };

  const sendNotification = async (userId: string, title: string, message: string, type: any = 'info', link?: string) => {
    await notificationService.create({ userId, title, message, type, link });
    // Note: We don't necessarily need to invalidate our own queries if we are sending to someone else,
    // but the recipient will get it via real-time.
  };

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

  const getApprovalLogs = async (requestId: string) => {
    return await budgetService.getApprovalLogs(requestId);
  };

  const getAllApprovalLogs = async () => {
    return await budgetService.getAllApprovalLogs();
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
      restoreData: (data: any) => {
        // Naive restore: just set cache
        if (data.requests) queryClient.setQueryData(['requests'], data.requests);
        if (data.categories) queryClient.setQueryData(['categories'], data.categories);
        if (data.settings) queryClient.setQueryData(['settings'], data.settings);
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
