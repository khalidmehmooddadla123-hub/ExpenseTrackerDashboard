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
  { value: '', label: 'All Categories', className:'bg-[#6B6659]/20'  },
  ...CATEGORIES.map((c) => ({ value: c.id, label: c.label, dot: c.color })),
];

const TIME_OPTIONS: DropdownOption[] = [
  
  { value: 'all', label: 'All Time' , className:'bg-[#6B6659]/20' },
  { value: 'current', label: 'Current Month' },
  { value: 'previous', label: 'Previous Month' },
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
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-800">All Expenses</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage and track all your expenses</p>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-45">
              <Input
                placeholder="Search expenses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={15} />}
                className='bg-[#6B6659]/20'
              />
            </div>
            <Dropdown
            
              options={CAT_OPTIONS}
              value={catFilter}
              onChange={setCatFilter}
              icon={<Filter size={13} />}
              
            />
            <Dropdown
              options={TIME_OPTIONS}
              value={timeFilter}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(v) => setTimeFilter(v as any)}
              icon={<Calendar size={13} />}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-slate-500">
            <span>Showing <strong className="text-slate-700">{filtered.length}</strong> expenses</span>
            <span>Total: <strong className="text-slate-700">{formatCurrency(total)}</strong></span>
          </div>
        </div>

        <ExpenseTable
          expenses={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Edit Modal */}
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
