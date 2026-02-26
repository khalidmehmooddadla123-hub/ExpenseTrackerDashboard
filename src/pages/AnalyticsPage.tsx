import  { useState, useMemo } from 'react';
import { TrendingUp, Trophy, Wallet, Calendar, Filter } from 'lucide-react';
import { useExpenseContext } from '@/context/ExpenseContext';
import { useSettingsContext } from '@/context/SettingsContext';
// import { useDateFilter } from '@/hooks/useDateFilter';
import { StatCard } from '@/components/dashboard/StatCard';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import {
  getCategoryStats,
  getTotal,
  getMonthlyData,
  getPieData,
  filterCurrentMonth,
  filterPreviousMonth,
  formatCurrency,
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

  // const total        = useMemo(() => getTotal(filteredExpenses), [filteredExpenses]);
  const categoryStats= useMemo(() => getCategoryStats(filteredExpenses), [filteredExpenses]);
  const pieData      = useMemo(() => getPieData(filteredExpenses), [filteredExpenses]);
  const monthly6     = useMemo(() => getMonthlyData(expenses, 6), [expenses]);

  // Month comparison
  const curMonthTotal  = useMemo(() => getTotal(filterCurrentMonth(expenses)), [expenses]);
  const prevMonthTotal = useMemo(() => getTotal(filterPreviousMonth(expenses)), [expenses]);
  const monthChangePct = prevMonthTotal > 0
    ? ((curMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
    : 0;

  const budgetPct = settings.budget > 0
    ? Math.min(100, (curMonthTotal / settings.budget) * 100)
    : 0;

  const highestStat = categoryStats[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-800">Analytics & Insights</h1>
        <p className="text-sm text-slate-500 mt-0.5">Detailed spending analysis and trends</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Dropdown
          options={TIME_OPTIONS}
          value={timeFilter}
          onChange={(v) => setTimeFilter(v as FilterTime)}
          icon={<Calendar size={13} />}
        />
        <Dropdown
          options={CAT_OPTIONS}
          value={catFilter}
          onChange={setCatFilter}
          icon={<Filter size={13} />}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Monthly Comparison"
          value={`${monthChangePct >= 0 ? '+' : ''}${monthChangePct.toFixed(1)}%`}
          subtext="vs last month"
          icon={<TrendingUp size={17} />}
          iconBg="bg-blue-100"
          iconColor={monthChangePct >= 0 ? 'text-red-500' : 'text-emerald-600'}
        />
        <StatCard
          label="Highest Category"
          value={highestStat?.label ?? 'N/A'}
          subtext={highestStat ? `${formatCurrency(highestStat.total)} spent` : 'No data'}
          icon={<Trophy size={17} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          label="Budget Status"
          value={`${budgetPct.toFixed(0)}%`}
          subtext={`${formatCurrency(settings.budget - curMonthTotal)} remaining`}
          icon={<Wallet size={17} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        <div className="lg:col-span-3">
          <MonthlyTrendChart data={monthly6} />
        </div>
        <div className="lg:col-span-2">
          <CategoryPieChart data={pieData} />
        </div>
      </div>

      {/* Breakdown */}
      <CategoryBreakdown stats={categoryStats} />
    </div>
  );
}
