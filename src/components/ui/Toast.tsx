import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { Toast as ToastType } from '@/types';

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: number) => void;
}

const icons = {
  success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
  error:   <XCircle size={16} className="text-red-500 shrink-0" />,
  info:    <Info size={16} className="text-blue-500 shrink-0" />,
};

const borders = {
  success: 'border-l-emerald-500',
  error:   'border-l-red-500',
  info:    'border-l-blue-500',
};

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 min-w-65 max-w-sm bg-[#1e293b] text-white rounded-xl px-4 py-3 border-l-4 shadow-lg',
        'animate-in slide-in-from-right-5 duration-300',
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      {toast.undoFn && (
        <button
          onClick={() => { toast.undoFn?.(); onDismiss(toast.id); }}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors ml-1"
        >
          Undo
        </button>
      )}
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white transition-colors ml-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
