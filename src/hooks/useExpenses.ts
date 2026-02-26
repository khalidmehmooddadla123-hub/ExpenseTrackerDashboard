import { useMemo } from 'react';
import { useExpenseContext } from '@/context/ExpenseContext';
import {
  filterCurrentMonth,
  filterPreviousMonth,
  getCategoryStats,
  getHighestCategory,
  getMonthlyData,
  getLast7DaysData,
  getPieData,
  getTotal,
} from '@/utils/helpers';

export function useExpenses() {
  const ctx = useExpenseContext();

  const currentMonthExpenses = useMemo(
    () => filterCurrentMonth(ctx.expenses),
    [ctx.expenses]
  );

  const previousMonthExpenses = useMemo(
    () => filterPreviousMonth(ctx.expenses),
    [ctx.expenses]
  );

  const currentMonthTotal = useMemo(
    () => getTotal(currentMonthExpenses),
    [currentMonthExpenses]
  );

  const previousMonthTotal = useMemo(
    () => getTotal(previousMonthExpenses),
    [previousMonthExpenses]
  );

  const categoryStats = useMemo(
    () => getCategoryStats(currentMonthExpenses),
    [currentMonthExpenses]
  );

  const highestCategory = useMemo(
    () => getHighestCategory(currentMonthExpenses),
    [currentMonthExpenses]
  );

  const monthly6Data = useMemo(
    () => getMonthlyData(ctx.expenses, 6),
    [ctx.expenses]
  );

  const last7DaysData = useMemo(
    () => getLast7DaysData(ctx.expenses),
    [ctx.expenses]
  );

  const pieData = useMemo(
    () => getPieData(currentMonthExpenses),
    [currentMonthExpenses]
  );

  const recentExpenses = useMemo(
    () => [...ctx.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [ctx.expenses]
  );

  return {
    ...ctx,
    currentMonthExpenses,
    previousMonthExpenses,
    currentMonthTotal,
    previousMonthTotal,
    categoryStats,
    highestCategory,
    monthly6Data,
    last7DaysData,
    pieData,
    recentExpenses,
  };
}
