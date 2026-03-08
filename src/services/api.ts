import { createClient } from "../lib/supabase/client";
// Deferred initialization to be SSR-safe
const getSupabase = () => createClient();
import {
  BudgetRequest,
  Category,
  SubActivity,
  SystemSettings,
  Department,
  Expense,
  User,
  BudgetPlan,
  BudgetLog,
  Notification,
  ActivityLog,
  ApprovalLog,
} from "../types";
import { generateId } from "../lib/utils";

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const cleanUsername = credentials.username.trim();
    const cleanPassword = credentials.password;
    let email = cleanUsername.includes("@") ? cleanUsername : "";

    if (!email) {
      const { data: resolvedEmail, error: rpcError } = await getSupabase().rpc(
        "get_user_email",
        { p_username: cleanUsername },
      );
      if (!rpcError && resolvedEmail) {
        email = resolvedEmail;
      } else {
        email = `${cleanUsername}@wu.ac.th`;
      }
    }

    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: email,
      password: cleanPassword,
    });

    if (error) throw new Error(error.message);

    // Fetch user profile securely with SDK (RLS applies)
    const { data: profileData, error: profileError } = await getSupabase()
      .from("User")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error("LOGIN -> Error fetching profile via SDK:", profileError.message);
    }
    
    const profile = profileData || null;
    if (profile) console.log("LOGIN -> DB profile fetch success:", profile.role);

    const userObj = profile || {
      id: data.user.id,
      email: data.user.email,
      role: "user", // Default fallback
      username: credentials.username,
      name: credentials.username,
      position: "",
      department: "",
    };

    return {
      user: userObj as User,
      token: data.session.access_token,
    };
  },

  loginWithGoogle: async (token: string) => {
    const { data, error } = await getSupabase().auth.signInWithIdToken({
      provider: "google",
      token: token,
    });
    if (error) throw new Error(error.message);

    const { data: profile } = await getSupabase()
      .from("User")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    return {
      user: (profile || {
        id: data.user.id,
        email: data.user.email,
        role: "user",
      }) as User,
      token: data.session.access_token,
    };
  },

  updateProfile: async (id: string, updateData: Partial<User>) => {
    const { data, error } = await getSupabase()
      .from("User")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as User;
  },

  changePassword: async (data: any) => {
    const { error } = await getSupabase().auth.updateUser({
      password: data.newPassword,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

export const userService = {
  getAll: async () => {
    const { data, error } = await getSupabase()
      .from("User")
      .select("*")
      .order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data as User[];
  },
  create: async (user: Partial<User>) => {
    const { data, error } = await getSupabase()
      .from("User")
      .insert({ ...user, updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as User;
  },
  update: async (id: string, user: Partial<User>) => {
    const { data, error } = await getSupabase()
      .from("User")
      .update(user)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as User;
  },
  delete: async (id: string) => {
    const { error } = await getSupabase().from("User").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

export const systemService = {
  getSettings: async () => {
    const { data, error } = await getSupabase()
      .from("SystemSetting")
      .select("*");
    if (error) throw new Error(error.message);

    const settingsObj = (data || []).reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return {
      orgName: settingsObj["ORG_NAME"] || "DCC Company Ltd.",
      fiscalYear: parseInt(settingsObj["FISCAL_YEAR"] || "2569"),
      overBudgetAlert: settingsObj["OVER_BUDGET_ALERT"] === "true",
      fiscalYearCutoff: settingsObj["FISCAL_YEAR_CUTOFF"] || "2026-09-30",
      permissions: settingsObj["PERMISSIONS"]
        ? JSON.parse(settingsObj["PERMISSIONS"])
        : {},
    } as SystemSettings;
  },
  updateSettings: async (settings: SystemSettings) => {
    const upsert = (key: string, value: string) =>
      getSupabase()
        .from("SystemSetting")
        .upsert({ key, value })
        .then(({ error }: { error: any }) => {
          if (error) throw new Error(error.message);
        });

    // Run all upserts in parallel instead of sequentially
    await Promise.all([
      upsert("ORG_NAME", settings.orgName),
      upsert("FISCAL_YEAR", settings.fiscalYear.toString()),
      upsert("OVER_BUDGET_ALERT", String(settings.overBudgetAlert)),
      upsert("FISCAL_YEAR_CUTOFF", settings.fiscalYearCutoff),
      ...(settings.permissions
        ? [upsert("PERMISSIONS", JSON.stringify(settings.permissions))]
        : []),
    ]);
    return { success: true };
  },

  getDepartments: async () => {
    const { data, error } = await getSupabase().from("Department").select("*");
    if (error) throw new Error(error.message);
    return data as Department[];
  },
  createDepartment: async (dept: Department) => {
    const { data, error } = await getSupabase()
      .from("Department")
      .insert({ ...dept, updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Department;
  },
  updateDepartment: async (dept: Department) => {
    const { data, error } = await getSupabase()
      .from("Department")
      .update(dept)
      .eq("id", dept.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Department;
  },
  deleteDepartment: async (id: string) => {
    const { error } = await getSupabase()
      .from("Department")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

export const masterDataService = {
  getCategories: async () => {
    const { data, error } = await getSupabase().from("Category").select("*");
    if (error) throw new Error(error.message);
    return data as Category[];
  },
  createCategory: async (cat: Category) => {
    const { data, error } = await getSupabase()
      .from("Category")
      .insert({ ...cat, updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Category;
  },
  updateCategory: async (cat: Category) => {
    const { data, error } = await getSupabase()
      .from("Category")
      .update(cat)
      .eq("id", cat.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Category;
  },
  deleteCategory: async (id: string) => {
    const supabase = getSupabase();
    // 1. Delete associated budget plans via sub-activities
    const { data: subs } = await supabase.from("SubActivity").select("id").eq("categoryId", id);
    if (subs && subs.length > 0) {
      const subIds = subs.map((s: { id: string }) => s.id);
      await supabase.from("BudgetPlan").delete().in("subActivityId", subIds);
    }

    // 2. Cascade delete dependent items
    await supabase.from("SubActivity").delete().eq("categoryId", id);
    await supabase.from("BudgetLog").delete().eq("categoryId", id);
    await supabase.from("Expense").delete().eq("categoryId", id);

    // 3. Delete the category itself
    const { error } = await supabase.from("Category").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  getSubActivities: async () => {
    const { data, error } = await getSupabase().from("SubActivity").select("*");
    if (error) throw new Error(error.message);

    const subs = data || [];
    const buildHierarchy = (parentId: string | null): any[] => {
      return subs
        .filter((sub: any) => sub.parentId === parentId)
        .map((sub: any) => ({
          ...sub,
          children: buildHierarchy(sub.id),
        }));
    };
    return buildHierarchy(null) as SubActivity[];
  },
  createSubActivity: async (sub: SubActivity) => {
    const { data, error } = await getSupabase()
      .from("SubActivity")
      .insert({ ...sub, updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as SubActivity;
  },
  updateSubActivity: async (sub: SubActivity) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, childrenList, used, ...subData } = sub as any;
    const { data, error } = await getSupabase()
      .from("SubActivity")
      .update({ ...subData, updatedAt: new Date().toISOString() })
      .eq("id", sub.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as SubActivity;
  },
  deleteSubActivity: async (id: string) => {
    const supabase = getSupabase();
    // 1. Delete associated budget plans
    await supabase.from("BudgetPlan").delete().eq("subActivityId", id);

    // 2. Delete any children sub-activities
    await supabase.from("SubActivity").delete().eq("parentId", id);

    // 3. Delete the sub-activity itself
    const { error } = await supabase.from("SubActivity").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

export const budgetService = {
  uploadAttachment: async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await getSupabase()
      .storage.from("attachments")
      .upload(filePath, file);

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrlData } = getSupabase()
      .storage.from("attachments")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },
  getRequests: async () => {
    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .select("*, expenseItems:BudgetRequestItem(*)")
      .order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data as BudgetRequest[];
  },
  createRequest: async (req: BudgetRequest) => {
    const { expenseItems, id, documentNumber, ...rest } = req;

    // Map documentNumber to approvalRef if approvalRef is not provided
    const payloadToInsert: any = {
      ...rest,
      id: id || generateId(),
      approvalRef: rest.approvalRef || documentNumber,
    };

    if (!payloadToInsert.subActivityId) {
      payloadToInsert.subActivityId = null;
    }

    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .insert({ ...payloadToInsert, updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);

    if (expenseItems && expenseItems.length > 0) {
      const items = expenseItems.map(({ id: itemId, ...itemRest }: any) => ({
        ...itemRest,
        id: itemId || generateId(),
        requestId: data.id,
        category: itemRest.category || req.category || "",
        updatedAt: new Date().toISOString(),
      }));
      const { error: itemError } = await getSupabase()
        .from("BudgetRequestItem")
        .insert(items);
      if (itemError) {
        console.error("Error inserting items:", itemError);
        throw new Error(`Error inserting items: ${itemError.message}`);
      }
    }
    return { ...data, expenseItems } as BudgetRequest;
  },
  updateRequestStatus: async (id: string, status: string) => {
    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as BudgetRequest;
  },
  approveRequest: async (id: string, approverId: string, comment?: string) => {
    // 1. Get current request to know the step
    const { data: currentReq } = await getSupabase()
      .from("BudgetRequest")
      .select("*")
      .eq("id", id)
      .single();
    if (!currentReq) throw new Error("Request not found");

    const step = currentReq.currentStep || "manager";
    let nextStep = step;
    let nextStatus = "pending";

    if (step === "manager") {
      nextStep = "finance";
    } else if (step === "finance") {
      nextStep = "director";
    } else if (step === "director") {
      nextStatus = "approved";
    }

    // 2. Update status and step
    const updateData: any = {
      currentStep: nextStep,
      status: nextStatus,
      approverId,
      updatedAt: new Date().toISOString(),
    };

    if (nextStatus === "approved") {
      updateData.approvedAt = new Date().toISOString();
    }

    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    // 3. Log the approval
    await getSupabase().from("ApprovalLog").insert({
      requestId: id,
      approverId,
      action: "approve",
      stage: step,
      comment, // Log the opinion if provided
    });

    // 4. Update category budget ONLY on final approval
    if (nextStatus === "approved") {
      const req = data as BudgetRequest;
      const { data: categoryData } = await getSupabase()
        .from("Category")
        .select("*")
        .eq("name", req.category)
        .maybeSingle();
      if (categoryData) {
        await getSupabase()
          .from("Category")
          .update({ used: (categoryData.used || 0) + req.amount })
          .eq("id", categoryData.id);
      }
    }

    return data as BudgetRequest;
  },
  rejectRequest: async (id: string, approverId: string, reason: string) => {
    // 1. Get current request to know the step
    const { data: currentReq } = await getSupabase()
      .from("BudgetRequest")
      .select("currentStep")
      .eq("id", id)
      .single();
    const step = currentReq?.currentStep || "manager";

    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .update({
        status: "rejected",
        approverId,
        rejectionReason: reason,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    // 2. Log the rejection
    await getSupabase().from("ApprovalLog").insert({
      requestId: id,
      approverId,
      action: "reject",
      stage: step,
      comment: reason,
    });

    return data as BudgetRequest;
  },
  getApprovalLogs: async (requestId: string) => {
    const { data, error } = await getSupabase()
      .from("ApprovalLog")
      .select("*, user:User(name, role, avatar)")
      .eq("requestId", requestId)
      .order("createdAt", { ascending: true });

    if (error) throw new Error(error.message);
    return data as ApprovalLog[];
  },
  getAllApprovalLogs: async () => {
    const { data, error } = await getSupabase()
      .from("ApprovalLog")
      .select("*, user:User(name, role, avatar)")
      .order("createdAt", { ascending: true });

    if (error) throw new Error(error.message);
    return data as ApprovalLog[];
  },
  completeRequest: async (id: string) => {
    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .update({ status: "completed" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as BudgetRequest;
  },
  submitExpenseReport: async (
    id: string,
    submitData: {
      expenseItems: any[];
      actualTotal: number;
      returnAmount: number;
      attachments?: string[];
    },
  ) => {
    const { error } = await getSupabase()
      .from("BudgetRequest")
      .update({
        status: "waiting_verification",
        actualAmount: submitData.actualTotal,
        returnAmount: submitData.returnAmount,
        attachments: submitData.attachments,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    if (submitData.expenseItems && submitData.expenseItems.length > 0) {
      for (const item of submitData.expenseItems) {
        if (item.id && !item.id.startsWith("temp-")) {
          await getSupabase()
            .from("BudgetRequestItem")
            .update({ actualAmount: item.actualAmount })
            .eq("id", item.id);
        } else {
          await getSupabase()
            .from("BudgetRequestItem")
            .insert({
              requestId: id,
              category: item.category || "other",
              description: item.description,
              quantity: parseFloat(item.quantity) || 1,
              unit: item.unit || "หน่วย",
              unitPrice: parseFloat(item.actualAmount) || 0,
              total: 0,
              actualAmount: parseFloat(item.actualAmount) || 0,
            });
        }
      }
    }

    const { data: updatedReq } = await getSupabase()
      .from("BudgetRequest")
      .select("*, expenseItems:BudgetRequestItem(*)")
      .eq("id", id)
      .single();
    return updatedReq as BudgetRequest;
  },
  rejectExpenseReport: async (id: string, reason: string) => {
    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .update({ status: "approved", rejectionReason: reason })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as BudgetRequest;
  },
  revertComplete: async (id: string) => {
    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .update({ status: "waiting_verification", completedAt: null })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as BudgetRequest;
  },
  updateRequest: async (id: string, updates: Partial<BudgetRequest>) => {
    const { expenseItems, ...rest } = updates;
    const { data, error } = await getSupabase()
      .from("BudgetRequest")
      .update({ ...rest, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);

    if (expenseItems && expenseItems.length > 0) {
      // For simplicity in management mode, we'll replace items if they are provided,
      // though a more robust system might do incremental updates.
      // For now, let's just update the main record.
    }
    return data as BudgetRequest;
  },
  deleteRequest: async (id: string) => {
    const { error } = await getSupabase()
      .from("BudgetRequest")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  getPlans: async (year?: number) => {
    let query = getSupabase().from("BudgetPlan").select("*");
    if (year) query = query.eq("year", year);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as BudgetPlan[];
  },
  savePlan: async (plan: Omit<BudgetPlan, "id" | "updatedAt">) => {
    const { data: existing } = await getSupabase()
      .from("BudgetPlan")
      .select("id")
      .eq("subActivityId", plan.subActivityId)
      .eq("year", plan.year)
      .eq("month", plan.month)
      .maybeSingle();

    if (existing) {
      const { data, error } = await getSupabase()
        .from("BudgetPlan")
        .update({ amount: plan.amount })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as BudgetPlan;
    } else {
      const { data, error } = await getSupabase()
        .from("BudgetPlan")
        .insert({ ...plan, updatedAt: new Date().toISOString() })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as BudgetPlan;
    }
  },

  adjustBudget: async (
    categoryId: string,
    adjustData: { amount: number; type: string; reason: string; user?: string },
  ) => {
    const { data: category } = await getSupabase()
      .from("Category")
      .select("allocated")
      .eq("id", categoryId)
      .maybeSingle();
    if (!category) throw new Error("Category not found");

    let newAllocated = category.allocated;
    const adjustAmount = adjustData.amount;
    if (adjustData.type === "ADD" || adjustData.type === "TRANSFER_IN") {
      newAllocated += adjustAmount;
    } else if (
      adjustData.type === "REDUCE" ||
      adjustData.type === "TRANSFER_OUT"
    ) {
      newAllocated -= adjustAmount;
    }

    const { data: updatedCategory, error } = await getSupabase()
      .from("Category")
      .update({ allocated: newAllocated })
      .eq("id", categoryId)
      .select()
      .single();
    if (error) throw new Error(error.message);

    await getSupabase().from("BudgetLog").insert({
      categoryId,
      amount: adjustAmount,
      type: adjustData.type,
      reason: adjustData.reason,
      user: adjustData.user,
    });

    return updatedCategory as Category;
  },

  getLogs: async (categoryId?: string) => {
    let query = getSupabase()
      .from("BudgetLog")
      .select("*")
      .order("createdAt", { ascending: false });
    if (categoryId) query = query.eq("categoryId", categoryId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as BudgetLog[];
  },
};

export const expenseService = {
  create: async (expense: Omit<Expense, "id" | "createdAt">) => {
    const { data, error } = await getSupabase()
      .from("Expense")
      .insert({ ...expense, updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Expense;
  },
  getAll: async (categoryId?: string) => {
    let query = getSupabase()
      .from("Expense")
      .select("*")
      .order("date", { ascending: false });
    if (categoryId) query = query.eq("categoryId", categoryId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Expense[];
  },
  delete: async (id: string) => {
    const { error } = await getSupabase().from("Expense").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

export const notificationService = {
  getAll: async (userId: string) => {
    const { data, error } = await getSupabase()
      .from("Notification")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Notification[];
  },
  markAsRead: async (id: string) => {
    const { data, error } = await getSupabase()
      .from("Notification")
      .update({ isRead: true })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Notification;
  },
  markAllAsRead: async (userId: string) => {
    const { error } = await getSupabase()
      .from("Notification")
      .update({ isRead: true })
      .eq("userId", userId)
      .eq("isRead", false);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  create: async (
    notification: Omit<Notification, "id" | "createdAt" | "isRead">,
  ) => {
    const { data, error } = await getSupabase()
      .from("Notification")
      .insert(notification)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Notification;
  },
  delete: async (id: string) => {
    const { error } = await getSupabase()
      .from("Notification")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
  sendLineNotification: async (message: string) => {
    try {
      const response = await fetch('/api/notify/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        console.warn('Line notification could not be sent (is token configured?)');
      }
    } catch (e) {
      console.error('Failed to call Line notify route', e);
    }
  }
};

export const activityLogService = {
  getAll: async () => {
    const { data, error } = await getSupabase()
      .from("ActivityLog")
      .select(
        `
                *,
                user:User (
                    name,
                    role,
                    avatar,
                    username
                )
            `,
      )
      .order("createdAt", { ascending: false });
    if (error) throw new Error(error.message);
    return data as unknown as ActivityLog[];
  },
  log: async (log: Omit<ActivityLog, "id" | "createdAt" | "user">) => {
    const { data, error } = await getSupabase()
      .from("ActivityLog")
      .insert(log)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as ActivityLog;
  },
};
