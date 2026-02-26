import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import type { Expense, CategoryStat, MonthlyData } from '@/types';
import { MONTHS_SHORT, getCategoryById, CATEGORIES } from './constants';

// Tailwind class merger
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date for display
export function formatDate(dateStr: string, fmt = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

// Format short date
export function formatShortDate(dateStr: string): string {
  return formatDate(dateStr, 'MMM d');
}

// Get current month/year
export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

// Filter expenses by current month
export function filterCurrentMonth(expenses: Expense[]): Expense[] {
  const { month, year } = getCurrentMonthYear();
  return expenses.filter((e) => {
    const d = parseISO(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

// Filter expenses by previous month
export function filterPreviousMonth(expenses: Expense[]): Expense[] {
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return expenses.filter((e) => {
    const d = parseISO(e.date);
    return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear();
  });
}

// Get total amount
export function getTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

// Get category stats
export function getCategoryStats(expenses: Expense[]): CategoryStat[] {
  const total = getTotal(expenses);
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] ?? 0) + e.amount;
  });

  return CATEGORIES.map((cat) => ({
    category: cat.id,
    label: cat.label,
    color: cat.color,
    total: map[cat.id] ?? 0,
    count: expenses.filter((e) => e.category === cat.id).length,
    percentage: total > 0 ? ((map[cat.id] ?? 0) / total) * 100 : 0,
  }))
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);
}

// Get monthly data for last N months
export function getMonthlyData(expenses: Expense[], months = 6): MonthlyData[] {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
    const total = expenses
      .filter((e) => {
        const ed = parseISO(e.date);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      month: MONTHS_SHORT[d.getMonth()],
      total,
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
    };
  });
}

// Get last N days bar chart data
export function getLast7DaysData(
  expenses: Expense[]
): { label: string; total: number; date: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const total = expenses
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      total,
      date: dateStr,
    };
  });
}

// Get highest spending category
export function getHighestCategory(
  expenses: Expense[]
): { label: string; amount: number } | null {
  const stats = getCategoryStats(expenses);
  if (!stats.length) return null;
  const top = stats[0];
  return { label: top.label, amount: top.total };
}

// Pie chart data
export function getPieData(expenses: Expense[]): { name: string; value: number; color: string }[] {
  const stats = getCategoryStats(expenses);
  return stats.map((s) => ({ name: s.label, value: s.total, color: s.color }));
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Export expenses to CSV
export function exportToCSV(expenses: Expense[]): void {
  const headers = 'Title,Amount,Category,Date,Payment,Notes\n';
  const rows = expenses
    .map(
      (e) =>
        `"${e.title}",${e.amount},${getCategoryById(e.category).label},${e.date},${e.payment},"${e.notes}"`
    )
    .join('\n');
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
