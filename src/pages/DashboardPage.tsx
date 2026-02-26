
import { DollarSign, Trophy, CalendarDays, TrendingUp, AlertTriangle } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { useSettingsContext } from '@/context/SettingsContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { SpendingBarChart } from '@/components/dashboard/SpendingBarChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { formatCurrency } from '@/utils/helpers';

export default function DashboardPage() {
  const { currentMonthTotal, highestCategory, last7DaysData, pieData, recentExpenses } = useExpenses();
  const { settings } = useSettingsContext();

  // Compute initials (same as sidebar)
  const initials = (settings.name || 'JD')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const budgetPct = settings.budget > 0
    ? Math.min(100, (currentMonthTotal / settings.budget) * 100)
    : 0;
  const budgetRemaining = settings.budget - currentMonthTotal;
  const budgetBarColor =
    budgetPct >= 90 ? '#ef4444' : budgetPct >= 70 ? '#f97316' : '#10b981';

  const now = new Date();
  const avgDaily = now.getDate() > 0 ? currentMonthTotal / now.getDate() : 0;

  const budgetBar = (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${budgetPct}%`, background: budgetBarColor }}
      />
    </div>
  );

  return (
    <div>
      {/* Header with title, date, and initials */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {now.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#8E51FF] to-[#AD46FF] flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
      </div>

      {/* Budget warning */}
      {budgetPct >= 80 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
          <AlertTriangle size={16} className="shrink-0 text-amber-500" />
          You've used <strong className="mx-1">{budgetPct.toFixed(0)}%</strong> of your monthly budget!
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Expenses"
          value={formatCurrency(currentMonthTotal)}
          subtext="Current month"
          icon={<DollarSign size={17} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Highest Category"
          value={highestCategory?.label ?? 'N/A'}
          subtext={highestCategory ? formatCurrency(highestCategory.amount) + ' spent' : '—'}
          icon={<Trophy size={17} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Budget Status"
          value={`${budgetPct.toFixed(1)}%`}
          subtext={
            budgetRemaining >= 0
              ? `${formatCurrency(budgetRemaining)} remaining`
              : `${formatCurrency(Math.abs(budgetRemaining))} over budget`
          }
          icon={<CalendarDays size={17} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          extra={budgetBar}
        />
        <StatCard
          label="Avg. Daily Spend"
          value={formatCurrency(avgDaily)}
          subtext="This month"
          icon={<TrendingUp size={17} />}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        <div className="lg:col-span-3">
          <SpendingBarChart data={last7DaysData} />
        </div>
        <div className="lg:col-span-2">
          <CategoryPieChart data={pieData} />
        </div>
      </div>

      {/* Recent Expenses */}
      <RecentExpenses expenses={recentExpenses} />
    </div>
  );
}