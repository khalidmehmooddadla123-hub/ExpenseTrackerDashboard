import  { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { useExpenseContext } from '@/context/ExpenseContext';
import { useDateFilter } from '@/hooks/useDateFilter';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { LoadingScreen } from '@/components/ui/Spinner';
import { CATEGORIES } from '@/utils/constants';
import { formatCurrency } from '@/utils/helpers';
import type { Expense } from '@/types';

const CAT_OPTIONS: DropdownOption[] = [
  { value: '', label: 'All Categories' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: c.label, dot: c.color })),
];

const TIME_OPTIONS: DropdownOption[] = [
  { value: 'all', label: 'All Time' },
  { value: 'current', label: 'This Month' },
  { value: 'previous', label: 'Last Month' },
];

export default function ExpensesPage() {
  const { expenses, deleteExpense } = useExpenseContext();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 250);

  const { timeFilter, setTimeFilter, filteredByTime } = useDateFilter(expenses);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let result = filteredByTime;
    if (catFilter) result = result.filter((e) => e.category === catFilter);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredByTime, catFilter, debouncedSearch]);

  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);

  const handleDelete = useCallback((id: string) => deleteExpense(id), [deleteExpense]);
  const handleEdit = useCallback((e: Expense) => setEditingExpense(e), []);

  if (loading) return <LoadingScreen label="Loading expenses…" />;

  return (
    <div className="w-full min-w-0">

      {/* ── Page header ── */}
      <div className="mb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-800">All Expenses</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage and track all your expenses</p>
      </div>

      <Card padding="none">
        {/* ── Filter section ── */}
        <div className="p-3 sm:p-4 border-b border-slate-100 space-y-2">

          {/* Search — always full width */}
          <Input
            placeholder="Search expenses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={14} />}
            className='bg-[#6B6659]/20'
          />

          {/* Two dropdowns:
              On mobile (<sm): each takes full width, stacked vertically
              On sm+: side by side in a row                              */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:w-auto">
              <Dropdown
                options={CAT_OPTIONS}
                value={catFilter}
                onChange={setCatFilter}
                icon={<Filter size={13} />}
                triggerClassName="w-full sm:min-w-[160px]"
              />
            </div>
            <div className="w-full sm:w-auto">
              <Dropdown
                options={TIME_OPTIONS}
                value={timeFilter}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => setTimeFilter(v as any)}
                icon={<Calendar size={13} />}
                triggerClassName="w-full sm:min-w-[150px]"
              />
            </div>
          </div>

          {/* Summary row: count + total */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span><strong className="text-slate-700">{filtered.length}</strong> expenses</span>
            <span>Total: <strong className="text-slate-700">{formatCurrency(total)}</strong></span>
          </div>
        </div>

        {/* ── Expense list (cards on mobile, table on desktop) ── */}
        <ExpenseTable
          expenses={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* ── Edit modal ── */}
      <Modal
        open={editingExpense !== null}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            existing={editingExpense}
            onSuccess={() => setEditingExpense(null)}
          />
        )}
      </Modal>
    </div>
  );
}
