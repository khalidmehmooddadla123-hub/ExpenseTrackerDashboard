import React from 'react';
import { cn } from '@/utils/helpers';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

export function LoadingScreen({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500 text-sm">
      <Spinner size="lg" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3 text-slate-400">
      {icon && <div className="opacity-40 mb-2">{icon}</div>}
      <p className="text-base font-medium text-slate-600">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
