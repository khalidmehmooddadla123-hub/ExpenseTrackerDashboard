import  { memo, useCallback } from 'react';
import { Pencil, Trash2, FileText } from 'lucide-react';
import { CategoryBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Spinner';
import { formatDate, formatCurrency } from '@/utils/helpers';
import type { Expense } from '@/types';

interface ExpenseRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

/* ─── Desktop: one table row ─── */
export const ExpenseRow = memo(function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-3 py-3 text-sm font-medium text-slate-800">
        <span className="line-clamp-1">{expense.title}</span>
      </td>
      <td className="px-3 py-3">
        <CategoryBadge categoryId={expense.category} />
      </td>
      <td className="px-3 py-3 text-sm text-slate-500 whitespace-nowrap">
        {formatDate(expense.date, 'MMM d, yyyy')}
      </td>
      <td className="px-3 py-3 text-sm text-slate-500 whitespace-nowrap">
        {expense.payment}
      </td>
      <td className="px-3 py-3 text-sm font-semibold text-red-500 whitespace-nowrap">
        {formatCurrency(expense.amount)}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}
            className="text-blue-500 hover:bg-blue-50 w-7 h-7" title="Edit">
            <Pencil size={13} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)}
            className="text-red-500 hover:bg-red-50 w-7 h-7" title="Delete">
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
});

/* ─── Mobile: card layout ─── */
const ExpenseCard = memo(function ExpenseCard({ expense, onEdit, onDelete }: ExpenseRowProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">

      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-slate-800 leading-snug flex-1 min-w-0 wrap-break-word">
          {expense.title}
        </p>
        <span className="text-sm font-bold text-red-500 shrink-0 whitespace-nowrap ml-2">
          {formatCurrency(expense.amount)}
        </span>
      </div>

      {/* Category + date */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
        <CategoryBadge categoryId={expense.category} />
        <span className="text-[11px] text-slate-400">
          {formatDate(expense.date, 'MMM d, yyyy')}
        </span>
      </div>

      {/* Payment method + action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">{expense.payment}</span>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}
            className="text-blue-500 hover:bg-blue-50 w-7 h-7" title="Edit">
            <Pencil size={13} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)}
            className="text-red-500 hover:bg-red-50 w-7 h-7" title="Delete">
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
});

/* ─── Main table component ─── */
interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const handleDelete = useCallback((id: string) => onDelete(id), [onDelete]);

  if (!expenses.length) {
    return (
      <EmptyState
        icon={<FileText size={40} />}
        title="No expenses found"
        description="Try adjusting your filters or add a new expense"
      />
    );
  }

  return (
    <>
      {/* ── Mobile card list — shown below md (768px) ── */}
      <div className="md:hidden space-y-2 p-3">
        {expenses.map((e) => (
          <ExpenseCard key={e.id} expense={e} onEdit={onEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* ── Desktop table — shown at md (768px) and above ── */}
      {/* overflow-x-auto allows horizontal scroll on the TABLE ONLY if needed, not the whole page */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              {['Title', 'Category', 'Date', 'Payment', 'Amount', 'Actions'].map((h) => (
                <th key={h}
                  className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <ExpenseRow key={e.id} expense={e} onEdit={onEdit} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
