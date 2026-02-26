import { useState, useMemo, useCallback } from 'react';
import { parseISO } from 'date-fns';
import type { Expense, FilterTime } from '@/types';

export function useDateFilter(expenses: Expense[]) {
  const [timeFilter, setTimeFilter] = useState<FilterTime>('all');

  const filteredByTime = useMemo(() => {
    const now = new Date();
    switch (timeFilter) {
      case 'current':
        return expenses.filter((e) => {
          const d = parseISO(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
      case 'previous': {
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return expenses.filter((e) => {
          const d = parseISO(e.date);
          return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear();
        });
      }
      default:
        return expenses;
    }
  }, [expenses, timeFilter]);

  const resetFilter = useCallback(() => setTimeFilter('all'), []);

  return { timeFilter, setTimeFilter, filteredByTime, resetFilter };
}
