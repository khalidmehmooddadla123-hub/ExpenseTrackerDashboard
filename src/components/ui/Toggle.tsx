import { cn } from '@/utils/helpers';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-slate-700">{label}</p>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex w-10 h-5.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          checked ? 'bg-[#C9C5BC]' : 'bg-[#2C2920]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-200',
            checked ? 'translate-x-4.5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
