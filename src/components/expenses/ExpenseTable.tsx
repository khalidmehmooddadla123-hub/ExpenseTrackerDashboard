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

export const ExpenseRow = memo(function ExpenseRow({
  expense,
  onEdit,
  onDelete,
}: ExpenseRowProps) {
  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-slate-800" data-label="Title">
        {expense.title}
      </td>
      <td className="px-4 py-3" data-label="Category">
        <CategoryBadge categoryId={expense.category} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap" data-label="Date">
        {formatDate(expense.date, 'MMM d, yyyy')}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600" data-label="Payment">
        {expense.payment}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-red-500 whitespace-nowrap" data-label="Amount">
        {formatCurrency(expense.amount)}
      </td>
      <td className="px-4 py-3" data-label="Actions">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(expense)}
            className="text-blue-500 hover:bg-blue-50"
            title="Edit"
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(expense.id)}
            className="text-red-500 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
});

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
        icon={<FileText size={48} />}
        title="No expenses found"
        description="Try adjusting your filters or add a new expense"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            {['Title', 'Category', 'Date', 'Payment', 'Amount', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
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
  );
}
