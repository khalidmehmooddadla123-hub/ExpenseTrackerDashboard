import {
  DollarSign,
  Trophy,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { useSettingsContext } from "@/context/SettingsContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingBarChart } from "@/components/dashboard/SpendingBarChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { formatCurrency } from "@/utils/helpers";

export default function DashboardPage() {
  const {
    currentMonthTotal,
    highestCategory,
    last7DaysData,
    pieData,
    recentExpenses,
  } = useExpenses();
  const { settings } = useSettingsContext();

  const initials = (settings.name || "JD")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const budgetPct =
    settings.budget > 0
      ? Math.min(100, (currentMonthTotal / settings.budget) * 100)
      : 0;
  const budgetRemaining = settings.budget - currentMonthTotal;
  const budgetBarColor =
    budgetPct >= 90 ? "#ef4444" : budgetPct >= 70 ? "#f97316" : "#10b981";

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
    /* w-full + min-w-0 ensures this page never forces the parent wider than the viewport */
    <div>
     
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

      {/* ── Budget warning banner ── */}
      {budgetPct >= 80 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-4 text-xs sm:text-sm text-amber-800">
          <AlertTriangle size={14} className="shrink-0 text-amber-500 mt-0.5" />
          <span>
            You've used <strong>{budgetPct.toFixed(0)}%</strong> of your monthly
            budget!
          </span>
        </div>
      )}

      {/* ── Stat cards ──
           2 columns on all mobile sizes, 4 columns on lg+ 
           gap-2 on mobile (tighter), gap-3 on sm+            */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <StatCard
          label="Total Expenses"
          value={formatCurrency(currentMonthTotal)}
          subtext="Current month"
          icon={<DollarSign size={14} />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Top Category"
          value={highestCategory?.label ?? "None"}
          subtext={
            highestCategory ? formatCurrency(highestCategory.amount) : "—"
          }
          icon={<Trophy size={14} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Budget Used"
          value={`${budgetPct.toFixed(0)}%`}
          subtext={
            budgetRemaining >= 0
              ? `${formatCurrency(budgetRemaining)} left`
              : "Over budget"
          }
          icon={<CalendarDays size={14} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          extra={budgetBar}
        />
        <StatCard
          label="Daily Average"
          value={formatCurrency(avgDaily)}
          subtext="This month"
          icon={<TrendingUp size={14} />}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />
      </div>

      {/* ── Charts ──
           Single column on mobile, 3+2 split on lg+ 
           min-w-0 on each child prevents chart overflow  */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
        <div className="lg:col-span-3 min-w-0">
          <SpendingBarChart data={last7DaysData} />
        </div>
        <div className="lg:col-span-2 min-w-0">
          <CategoryPieChart data={pieData} />
        </div>
      </div>

      {/* ── Recent expenses ── */}
      <RecentExpenses expenses={recentExpenses} />
    </div>
  );
}
