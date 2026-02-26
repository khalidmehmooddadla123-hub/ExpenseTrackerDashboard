export type CategoryId =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'bills'
  | 'shopping'
  | 'health'
  | 'education'
  | 'other';

export type PaymentMethod = 'Credit Card' | 'Cash' | 'Bank Transfer' | 'Digital Wallet';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: CategoryId;
  date: string; // ISO date string YYYY-MM-DD
  payment: PaymentMethod;
  notes: string;
  createdAt: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
}

export interface Settings {
  name: string;
  email: string;
  budget: number;
  budgetAlerts: boolean;
  expenseReminders: boolean;
  monthlyReports: boolean;
  theme: 'light' | 'dark';
}

export interface ExpenseFormData {
  title: string;
  amount: string;
  category: CategoryId | '';
  date: string;
  payment: PaymentMethod;
  notes: string;
}

export interface ExpenseFormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

export interface CategoryStat {
  category: CategoryId;
  label: string;
  color: string;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  year: number;
  monthIndex: number;
}

export interface DashboardStats {
  totalMonthly: number;
  highestCategory: string;
  highestCategoryAmount: number;
  budgetPercentage: number;
  budgetRemaining: number;
  avgDailySpend: number;
}

export type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'LOAD_EXPENSES'; payload: Expense[] };

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  undoFn?: () => void;
}

export type FilterTime = 'all' | 'current' | 'previous';
