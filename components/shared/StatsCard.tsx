import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: 'default' | 'red' | 'amber' | 'green' | 'blue';
  className?: string;
}

const ACCENT_CLASSES = {
  default: {
    icon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    value: 'text-slate-900 dark:text-slate-100',
  },
  red: {
    icon: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    value: 'text-red-700 dark:text-red-400',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    value: 'text-amber-700 dark:text-amber-400',
  },
  green: {
    icon: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    value: 'text-green-700 dark:text-green-400',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    value: 'text-blue-700 dark:text-blue-400',
  },
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'default',
  className,
}: StatsCardProps) {
  const colors = ACCENT_CLASSES[accent];
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-slate-800 dark:bg-[hsl(222,20%,11%)] sm:p-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">{label}</p>
          <p className={cn('mt-1.5 text-2xl font-bold tabular-nums', colors.value)}>
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                'mt-1 text-xs',
                trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn('rounded-md p-2 flex-shrink-0', colors.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
