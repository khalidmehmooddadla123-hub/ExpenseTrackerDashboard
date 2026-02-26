import  { type ReactNode } from 'react';
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

export function StatCard({
  label,
  value,
  subtext,
  icon,
  iconBg,
  iconColor,
  extra,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className={cn('absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center', iconBg)}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
      <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      {extra && <div className="mt-2">{extra}</div>}
    </Card>
  );
}
