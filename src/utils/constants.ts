import type { Category, CategoryId, PaymentMethod, Expense, Settings } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    label: 'Food & Dining',
    color: '#f97316',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-700',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'transport',
    label: 'Transport',
    color: '#3b82f6',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    color: '#ec4899',
    bgClass: 'bg-pink-100',
    textClass: 'text-pink-700',
    badgeClass: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'bills',
    label: 'Bills & Utilities',
    color: '#0ea5e9',
    bgClass: 'bg-sky-100',
    textClass: 'text-sky-700',
    badgeClass: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    color: '#8b5cf6',
    bgClass: 'bg-violet-100',
    textClass: 'text-violet-700',
    badgeClass: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'health',
    label: 'Health',
    color: '#10b981',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'education',
    label: 'Education',
    color: '#f59e0b',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-700',
    badgeClass: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'other',
    label: 'Other',
    color: '#64748b',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
    badgeClass: 'bg-slate-100 text-slate-600',
  },
];

export const getCategoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[7];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Credit Card',
  'Cash',
  'Bank Transfer',
  'Digital Wallet',
];

export const MONTHS_SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

export const DEFAULT_SETTINGS: Settings = {
  name: 'John Doe',
  email: 'john@example.com',
  budget: 2000,
  budgetAlerts: true,
  expenseReminders: false,
  monthlyReports: true,
  theme: 'light',
};

export const SEED_EXPENSES: Expense[] = [
  { id: '1',  title: 'Grocery Shopping',    amount: 125.50, category: 'food',          date: '2026-02-25', payment: 'Credit Card',    notes: '', createdAt: '2026-02-25T10:00:00Z' },
  { id: '2',  title: 'Uber to Airport',     amount: 45.00,  category: 'transport',     date: '2026-02-24', payment: 'Digital Wallet', notes: '', createdAt: '2026-02-24T08:30:00Z' },
  { id: '3',  title: 'Movie Tickets',       amount: 28.00,  category: 'entertainment', date: '2026-02-23', payment: 'Credit Card',    notes: '', createdAt: '2026-02-23T19:00:00Z' },
  { id: '4',  title: 'Internet Bill',       amount: 79.99,  category: 'bills',         date: '2026-02-22', payment: 'Bank Transfer',  notes: '', createdAt: '2026-02-22T09:00:00Z' },
  { id: '5',  title: 'New Shoes',           amount: 89.99,  category: 'shopping',      date: '2026-02-21', payment: 'Credit Card',    notes: '', createdAt: '2026-02-21T14:00:00Z' },
  { id: '6',  title: 'Lunch at Restaurant', amount: 42.50,  category: 'food',          date: '2026-02-20', payment: 'Cash',           notes: '', createdAt: '2026-02-20T12:30:00Z' },
  { id: '7',  title: 'Doctor Consultation', amount: 150.00, category: 'health',        date: '2026-02-19', payment: 'Credit Card',    notes: '', createdAt: '2026-02-19T11:00:00Z' },
  { id: '8',  title: 'Online Course',       amount: 199.00, category: 'education',     date: '2026-02-18', payment: 'Credit Card',    notes: '', createdAt: '2026-02-18T16:00:00Z' },
  { id: '9',  title: 'Coffee Shop',         amount: 12.50,  category: 'food',          date: '2026-02-17', payment: 'Cash',           notes: '', createdAt: '2026-02-17T08:00:00Z' },
  { id: '10', title: 'Gas Station',         amount: 55.80,  category: 'transport',     date: '2026-02-16', payment: 'Credit Card',    notes: '', createdAt: '2026-02-16T17:00:00Z' },
  { id: '11', title: 'Streaming Service',   amount: 15.99,  category: 'entertainment', date: '2026-02-15', payment: 'Credit Card',    notes: '', createdAt: '2026-02-15T00:00:00Z' },
  { id: '12', title: 'Dinner with Friends', amount: 68.00,  category: 'food',          date: '2026-02-14', payment: 'Credit Card',    notes: '', createdAt: '2026-02-14T20:00:00Z' },
  { id: '13', title: 'Electricity Bill',    amount: 95.00,  category: 'bills',         date: '2026-02-13', payment: 'Bank Transfer',  notes: '', createdAt: '2026-02-13T09:00:00Z' },
  { id: '14', title: 'Gym Membership',      amount: 49.99,  category: 'health',        date: '2026-02-12', payment: 'Credit Card',    notes: '', createdAt: '2026-02-12T07:00:00Z' },
  { id: '15', title: 'Books',               amount: 38.00,  category: 'education',     date: '2026-02-11', payment: 'Credit Card',    notes: '', createdAt: '2026-02-11T15:00:00Z' },
  { id: '16', title: 'Groceries',           amount: 95.00,  category: 'food',          date: '2026-01-10', payment: 'Credit Card',    notes: '', createdAt: '2026-01-10T10:00:00Z' },
  { id: '17', title: 'Bus Pass',            amount: 40.00,  category: 'transport',     date: '2026-01-15', payment: 'Cash',           notes: '', createdAt: '2026-01-15T09:00:00Z' },
  { id: '18', title: 'Rent',                amount: 900.00, category: 'bills',         date: '2026-01-01', payment: 'Bank Transfer',  notes: '', createdAt: '2026-01-01T09:00:00Z' },
  { id: '19', title: 'Concert',             amount: 80.00,  category: 'entertainment', date: '2025-12-20', payment: 'Credit Card',    notes: '', createdAt: '2025-12-20T20:00:00Z' },
  { id: '20', title: 'Pharmacy',            amount: 35.00,  category: 'health',        date: '2025-12-15', payment: 'Cash',           notes: '', createdAt: '2025-12-15T11:00:00Z' },
  { id: '21', title: 'Online Shopping',     amount: 120.00, category: 'shopping',      date: '2025-11-25', payment: 'Credit Card',    notes: '', createdAt: '2025-11-25T14:00:00Z' },
  { id: '22', title: 'Water Bill',          amount: 45.00,  category: 'bills',         date: '2025-11-10', payment: 'Bank Transfer',  notes: '', createdAt: '2025-11-10T09:00:00Z' },
  { id: '23', title: 'Taxi',                amount: 22.00,  category: 'transport',     date: '2025-10-18', payment: 'Cash',           notes: '', createdAt: '2025-10-18T18:00:00Z' },
];
