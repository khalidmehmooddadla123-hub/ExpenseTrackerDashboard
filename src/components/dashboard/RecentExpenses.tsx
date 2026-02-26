import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { CategoryBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Spinner';
import { formatCurrency, formatShortDate } from '@/utils/helpers';
import type { Expense } from '@/types';
import { Receipt } from 'lucide-react';

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      {expenses.length === 0 ? (
        <EmptyState icon={<Receipt size={40} />} title="No expenses yet" />
      ) : (
        <div className="divide-y divide-slate-100">
          {expenses.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryBadge categoryId={e.category} />
                  <span className="text-[11px] text-slate-400">{formatShortDate(e.date)}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800 shrink-0">
                {formatCurrency(e.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
