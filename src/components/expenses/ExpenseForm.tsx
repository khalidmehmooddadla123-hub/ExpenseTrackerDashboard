import  { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenseContext } from '@/context/ExpenseContext';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, PAYMENT_METHODS } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import type { Expense, ExpenseFormData, ExpenseFormErrors, CategoryId, PaymentMethod } from '@/types';

interface ExpenseFormProps {
  existing?: Expense;
  onSuccess?: () => void;
}

const EMPTY_FORM: ExpenseFormData = {
  title: '', amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  payment: 'Credit Card',
  notes: '',
};

export function ExpenseForm({ existing, onSuccess }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenseContext();
  const navigate = useNavigate();

  const [form, setForm] = useState<ExpenseFormData>(
    existing
      ? { title: existing.title, amount: String(existing.amount), category: existing.category,
          date: existing.date, payment: existing.payment, notes: existing.notes }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => (
    form.title.trim().length > 0 &&
    form.amount !== '' && !isNaN(Number(form.amount)) && Number(form.amount) > 0 &&
    form.category !== '' && form.date !== ''
  ), [form]);

  const setField = <K extends keyof ExpenseFormData>(key: K, value: ExpenseFormData[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: ExpenseFormErrors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Amount must be greater than 0';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const data = {
      title: form.title.trim(), amount: Number(form.amount),
      category: form.category as CategoryId, date: form.date,
      payment: form.payment as PaymentMethod, notes: form.notes,
    };
    if (existing) updateExpense({ ...existing, ...data });
    else addExpense(data);
    setLoading(false);
    if (onSuccess) onSuccess();
    else navigate('/expenses');
  };

  return (
    <div>
      <div className="space-y-4">
        <Input label="Expense Title" required placeholder="e.g. Grocery Shopping"
          value={form.title} onChange={(e) => setField('title', e.target.value)} error={errors.title} className='bg-[#6B6659]/20'/>

        <Input label="Amount" required type="number" placeholder="0.00" min="0" step="0.01"
          value={form.amount} onChange={(e) => setField('amount', e.target.value)}
          error={errors.amount} leftIcon={<span className="text-sm">$</span>} className='bg-[#6B6659]/20' />

        <Select label="Category" required placeholder="Select a category"
          value={form.category}
          onChange={(e) => setField('category', e.target.value as CategoryId)}
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.label }))}
          error={errors.category} className='bg-[#6B6659]/20'/>

        <Input label="Date" type="date" value={form.date}
          onChange={(e) => setField('date', e.target.value)} error={errors.date} className='bg-[#6B6659]/20'/>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Payment Method
          </label>
          {/* 2 columns on all sizes — works well on both mobile and desktop */}
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((pm) => (
              <button key={pm} type="button" onClick={() => setField('payment', pm)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all  ',
                  form.payment === pm
                    ? 'border-primary-500 bg-primary-50 text-primary-700 bg-[#6B6659]/20'
                    : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-primary-50/50 '
                )}
              >
                <span className={cn(
                  'w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors',
                  form.payment === pm ? 'border-primary-500 bg-primary-500' : 'border-slate-300 bg-white'
                )} />
                <span className="truncate">{pm}</span>
              </button>
            ))}
          </div>
        </div>

        <Textarea label="Notes (Optional)" placeholder="Add any additional details…"
          value={form.notes} onChange={(e) => setField('notes', e.target.value)} className='bg-[#6B6659]/20'/>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
        {onSuccess && (
          <Button variant="secondary" onClick={onSuccess} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={!isValid} loading={loading} className="w-full sm:w-auto bg-[#009966] text-white hover:bg-[#007750]">
          {existing ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </div>
  );
}
