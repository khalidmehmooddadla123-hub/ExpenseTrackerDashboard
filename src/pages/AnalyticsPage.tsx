import  { useState, useMemo } from 'react';
import { TrendingUp, Trophy, Wallet, Calendar, Filter } from 'lucide-react';
import { useExpenseContext } from '@/context/ExpenseContext';
import { useSettingsContext } from '@/context/SettingsContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import {
  getCategoryStats, getTotal, getMonthlyData, getPieData,
  filterCurrentMonth, filterPreviousMonth, formatCurrency,
} from '@/utils/helpers';
import { CATEGORIES } from '@/utils/constants';
import type { FilterTime } from '@/types';

const TIME_OPTIONS: DropdownOption[] = [
  { value: 'current', label: 'Current Month' },
  { value: 'previous', label: 'Previous Month' },
  { value: 'all', label: 'All Time' },
];

const CAT_OPTIONS: DropdownOption[] = [
  { value: '', label: 'All Categories' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: c.label, dot: c.color })),
];

export default function AnalyticsPage() {
  const { expenses } = useExpenseContext();
  const { settings } = useSettingsContext();
  const [timeFilter, setTimeFilter] = useState<FilterTime>('current');
  const [catFilter, setCatFilter] = useState('');

  const filteredExpenses = useMemo(() => {
    let base = expenses;
    if (timeFilter === 'current') base = filterCurrentMonth(expenses);
    else if (timeFilter === 'previous') base = filterPreviousMonth(expenses);
    if (catFilter) base = base.filter((e) => e.category === catFilter);
    return base;
  }, [expenses, timeFilter, catFilter]);

  const categoryStats = useMemo(() => getCategoryStats(filteredExpenses), [filteredExpenses]);
  const pieData       = useMemo(() => getPieData(filteredExpenses), [filteredExpenses]);
  const monthly6      = useMemo(() => getMonthlyData(expenses, 6), [expenses]);

  const curMonthTotal  = useMemo(() => getTotal(filterCurrentMonth(expenses)), [expenses]);
  const prevMonthTotal = useMemo(() => getTotal(filterPreviousMonth(expenses)), [expenses]);
  const monthChangePct = prevMonthTotal > 0
    ? ((curMonthTotal - prevMonthTotal) / prevMonthTotal) * 100 : 0;
  const budgetPct = settings.budget > 0
    ? Math.min(100, (curMonthTotal / settings.budget) * 100) : 0;
  const highestStat = categoryStats[0];

  return (
    <div className="w-full min-w-0">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Detailed spending analysis and trends</p>
      </div>

      {/* Filters — stacked on mobile, row on sm+ */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Dropdown
          options={TIME_OPTIONS}
          value={timeFilter}
          onChange={(v) => setTimeFilter(v as FilterTime)}
          icon={<Calendar size={13} />}
          triggerClassName="w-full sm:w-auto sm:min-w-[160px]"
        />
        <Dropdown
          options={CAT_OPTIONS}
          value={catFilter}
          onChange={setCatFilter}
          icon={<Filter size={13} />}
          triggerClassName="w-full sm:w-auto sm:min-w-[160px]"
        />
      </div>

      {/* Stat cards — 1 col on mobile, 3 on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
        <StatCard
          label="vs Last Month"
          value={`${monthChangePct >= 0 ? '+' : ''}${monthChangePct.toFixed(1)}%`}
          subtext="Monthly comparison"
          icon={<TrendingUp size={14} />}
          iconBg="bg-blue-100"
          iconColor={monthChangePct >= 0 ? 'text-red-500' : 'text-emerald-600'}
        />
        <StatCard
          label="Top Category"
          value={highestStat?.label ?? 'N/A'}
          subtext={highestStat ? formatCurrency(highestStat.total) : 'No data'}
          icon={<Trophy size={14} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          label="Budget Used"
          value={`${budgetPct.toFixed(0)}%`}
          subtext={`${formatCurrency(settings.budget - curMonthTotal)} remaining`}
          icon={<Wallet size={14} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
        <div className="lg:col-span-3 min-w-0">
          <MonthlyTrendChart data={monthly6} />
        </div>
        <div className="lg:col-span-2 min-w-0">
          <CategoryPieChart data={pieData} />
        </div>
      </div>

      <CategoryBreakdown stats={categoryStats} />
    </div>
  );
}
