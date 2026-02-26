import  {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Expense, ExpenseAction, Toast } from '@/types';
import { storageService } from '@/services/storageService';
import { generateId } from '@/utils/helpers';

// ─── Reducer ─────────────────────────────────────────────────────────────────
function expenseReducer(state: Expense[], action: ExpenseAction): Expense[] {
  switch (action.type) {
    case 'LOAD_EXPENSES':
      return action.payload;
    case 'ADD_EXPENSE':
      return [action.payload, ...state];
    case 'UPDATE_EXPENSE':
      return state.map((e) => (e.id === action.payload.id ? action.payload : e));
    case 'DELETE_EXPENSE':
      return state.filter((e) => e.id !== action.payload);
    default:
      return state;
  }
}

// ─── Context types ────────────────────────────────────────────────────────────
interface ExpenseContextValue {
  expenses: Expense[];
  addExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, dispatch] = useReducer(expenseReducer, [], () =>
    storageService.getExpenses()
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist on every change
  useEffect(() => {
    storageService.saveExpenses(expenses);
  }, [expenses]);

  const addToast = useCallback(
    (message: string, type: Toast['type'] = 'success', undoFn?: () => void) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, undoFn }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addExpense = useCallback(
    (data: Omit<Expense, 'id' | 'createdAt'>) => {
      const expense: Expense = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
      addToast('Expense added successfully');
    },
    [addToast]
  );

  const updateExpense = useCallback(
    (expense: Expense) => {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
      addToast('Expense updated successfully');
    },
    [addToast]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      const deleted = expenses.find((e) => e.id === id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      addToast('Expense deleted', 'success', () => {
        if (deleted) dispatch({ type: 'ADD_EXPENSE', payload: deleted });
      });
    },
    [expenses, addToast]
  );

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, updateExpense, deleteExpense, toasts, dismissToast }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExpenseContext(): ExpenseContextValue {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenseContext must be used inside ExpenseProvider');
  return ctx;
}
