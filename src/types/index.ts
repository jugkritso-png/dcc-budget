
export interface BudgetSummary {
  total: number;
  remaining: number;
  pending: number;
  used: number;
  refundPending: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  employeeId?: string;
  bio?: string;
  avatar?: string; // base64
  theme?: 'light' | 'dark' | 'system';
  language?: 'th' | 'en';
  role: 'admin' | 'user';
}

export interface ExpenseLineItem {
  id: string;
  category: 'compensation' | 'operating' | 'materials' | 'utilities' | 'equipment' | 'other';
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string; // e.g., "ชิ้น", "คน", "วัน", "เดือน"
  total: number; // calculated: quantity * unitPrice
}

export interface BudgetRequest {
  id: string;
  project: string;
  category: string;
  activity: string; // This will map to "Sub-activity" / กิจกรรมย่อย
  amount: number;
  date: string;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  requester: string;
  notes?: string;
  // New fields from the request
  department?: string;
  approvalRef?: string; // เลขหนังสืออนุมัติ
  urgency?: 'normal' | 'urgent' | 'critical';
  startDate?: string;
  endDate?: string;
  reason?: string;
  expenseItems?: ExpenseLineItem[]; // รายละเอียดประมาณการค่าใช้จ่าย
}

export interface Category {
  id: string;
  name: string;
  code: string;
  segment: string;
  allocated: number;
  used: number;
  color: string;
  colorLabel: string;
  year: number;
  // Walailak University Budget Codes
  businessPlace?: string; // รหัสสถานประกอบการ (1000 = มวล)
  businessArea?: string; // ประเภทธุรกิจ (1000 = ทั่วไป, อื่นๆ = วิสาหกิจ/หลักสูตรพิเศษ)
  fund?: 'I' | 'E'; // แหล่งเงินทุน (I = Internal/ภายใน, E = External/ภายนอก)
  fundCenter?: string; // หน่วยงานที่รับงบประมาณ
  costCenter?: string; // หน่วยงานที่ใช้งบประมาณจริง
  functionalArea?: string; // กิจกรรมย่อย
  commitmentItem?: string; // หมวดรายจ่าย
}

export interface SubActivity {
  id: string;
  categoryId: string;
  name: string;
  allocated: number;
}

export interface ChartData {
  name: string;
  planned: number;
  actual: number;
}

export enum Page {
  DASHBOARD = 'dashboard',
  BUDGET = 'budget',
  MANAGEMENT = 'management',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  CREATE_REQUEST = 'create_request',
  NOTIFICATIONS = 'notifications',
}

export interface SystemSettings {
  orgName: string;
  fiscalYear: number;
  overBudgetAlert: boolean;
  fiscalYearCutoff: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  payee: string;
  date: string;
  description?: string;
  createdAt?: string;
}

export type BudgetContextType = {
  requests: BudgetRequest[];
  categories: Category[];
  subActivities: SubActivity[];
  settings: SystemSettings;
  departments: Department[];
  user: User | null;
  users: User[]; // List of all users
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (user: Partial<User>) => Promise<void>;
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<void>;
  addRequest: (request: BudgetRequest) => Promise<void>;
  updateRequestStatus: (id: string, status: BudgetRequest['status']) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addSubActivity: (subActivity: SubActivity) => Promise<void>;
  deleteSubActivity: (id: string) => Promise<void>;
  updateSettings: (settings: SystemSettings) => Promise<void>;
  addDepartment: (department: Department) => Promise<void>;
  updateDepartment: (department: Department) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  getDashboardStats: () => {
    totalBudget: number;
    totalUsed: number;
    totalPending: number;
    totalRemaining: number;
    usagePercentage: number;
  };
  adjustBudget: (categoryId: string, amount: number, type: 'ADD' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'REDUCE', reason: string) => Promise<void>;
  getBudgetLogs: (categoryId: string) => Promise<BudgetLog[]>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  getExpenses: (categoryId: string) => Promise<Expense[]>;
  deleteExpense: (id: string) => Promise<void>;
  budgetPlans: BudgetPlan[];
  saveBudgetPlan: (plan: Omit<BudgetPlan, 'id' | 'updatedAt'>) => Promise<void>;
};

export interface BudgetPlan {
  id: string;
  subActivityId: string;
  year: number;
  month: number;
  amount: number;
  updatedAt?: string;
}

export interface BudgetLog {
  id: string;
  categoryId: string;
  amount: number;
  type: 'ADD' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'REDUCE';
  reason: string;
  user?: string;
  createdAt: string; // ISO string for frontend
}
