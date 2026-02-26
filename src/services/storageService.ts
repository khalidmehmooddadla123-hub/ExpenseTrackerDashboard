import type { Expense, Settings } from '@/types';
import { SEED_EXPENSES, DEFAULT_SETTINGS } from '@/utils/constants';

const KEYS = {
  EXPENSES: 'et_expenses',
  SETTINGS: 'et_settings',
} as const;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to persist to localStorage');
  }
}

export const storageService = {
  getExpenses(): Expense[] {
    return safeGet<Expense[]>(KEYS.EXPENSES, SEED_EXPENSES);
  },
  saveExpenses(expenses: Expense[]): void {
    safeSet(KEYS.EXPENSES, expenses);
  },
  clearExpenses(): void {
    localStorage.removeItem(KEYS.EXPENSES);
  },

  getSettings(): Settings {
    return safeGet<Settings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(settings: Settings): void {
    safeSet(KEYS.SETTINGS, settings);
  },
};
