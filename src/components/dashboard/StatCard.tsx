import React, { type ReactNode } from 'react';
import { cn } from '@/utils/helpers';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  extra?: ReactNode;
}

export function StatCard({ label, value, subtext, icon, iconBg, iconColor, extra }: StatCardProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-3 sm:p-4">
        {/* Row 1: label on left, icon badge on right — ALWAYS both visible */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-tight flex-1 min-w-0">
            {label}
          </p>
          {/* Icon badge: 28x28 on mobile, 32x32 on sm+ */}
          <div className={cn(
            'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0',
            iconBg
          )}>
            <span className={cn('flex items-center justify-center', iconColor)}>
              {/* Smaller icon on mobile */}
              {React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 14 })
                : icon}
            </span>
          </div>
        </div>

        {/* Row 2: the big value number */}
        <p className="text-base sm:text-xl font-bold text-slate-800 leading-tight truncate">
          {value}
        </p>

        {/* Row 3: subtext */}
        {subtext && (
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight truncate">
            {subtext}
          </p>
        )}

        {/* Optional extra content (budget progress bar) */}
        {extra && <div className="mt-2">{extra}</div>}
      </div>
    </Card>
  );
}
