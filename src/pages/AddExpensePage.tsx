import { Card } from '@/components/ui/Card';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';

export default function AddExpensePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-slate-800">Add New Expense</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track your spending by adding a new expense</p>
      </div>
      <div className="max-w-140 mx-auto">
        <Card>
          <ExpenseForm />
        </Card>
      </div>
    </div>
  );
}
