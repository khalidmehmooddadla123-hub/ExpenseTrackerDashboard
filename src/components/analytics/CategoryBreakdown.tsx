import { Card, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';
import { EmptyState } from '@/components/ui/Spinner';
import { BarChart3 } from 'lucide-react';
import type { CategoryStat } from '@/types';

interface CategoryBreakdownProps {
  stats: CategoryStat[];
}

export function CategoryBreakdown({ stats }: CategoryBreakdownProps) {
  return (
    <Card>
      <CardTitle className="mb-5">Category Breakdown</CardTitle>
      {stats.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={48} />}
          title="No data for selected period"
          description="Try changing the filters above"
        />
      ) : (
        <div className="space-y-4">
          {stats.map((s) => (
            <div key={s.category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: s.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">{s.label}</span>
                  <span className="text-xs text-slate-400">({s.count} expenses)</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {formatCurrency(s.total)}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${s.percentage}%`, background: s.color }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {s.percentage.toFixed(1)}% of total spending
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
