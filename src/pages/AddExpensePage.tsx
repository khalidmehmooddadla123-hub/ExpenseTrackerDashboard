import { Card } from '@/components/ui/Card';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';

export default function AddExpensePage() {
  return (
    <div className="w-full min-w-0">
      <div className="mb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-800">Add New Expense</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Track your spending by adding a new expense</p>
      </div>
      {/* max-w on sm+, full width on mobile */}
      <div className="w-full sm:max-w-140">
        <Card>
          <ExpenseForm />
        </Card>
      </div>
    </div>
  );
}
