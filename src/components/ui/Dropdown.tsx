import  { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface DropdownOption {
  value: string;
  label: string;
  dot?: string;
  icon?: ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  icon?: ReactNode;
}

export function Dropdown({
  options, value, onChange, placeholder = 'Select…', triggerClassName, icon,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-[#6B6659]/20 text-slate-700 hover:bg-slate-50 transition-colors select-none justify-between',
          triggerClassName
        )}
      >
        <span className="flex items-center gap-2 truncate min-w-0">
          {icon && <span className="shrink-0">{icon}</span>}
          {selected ? (
            <>
              {selected.dot && (
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: selected.dot }} />
              )}
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={14} className="shrink-0 text-slate-400 ml-1" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-40 min-w-45 w-max bg-white border border-slate-200 rounded-xl shadow-lg py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
                opt.value === value
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              {opt.dot && (
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.dot }} />
              )}
              {opt.icon}
              <span className="flex-1 truncate">{opt.label}</span>
              {opt.value === value && <Check size={13} className="text-primary-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
