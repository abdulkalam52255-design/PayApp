import { CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, CircleMinus as MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChecklistItem } from '@/lib/types';

interface ChecklistPanelProps {
  items: ChecklistItem[];
  passedChecks: number;
  totalChecks: number;
}

const STATUS_CONFIG = {
  pass: {
    icon: CheckCircle2,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    label: 'Passed',
  },
  fail: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    label: 'Failed',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    label: 'Warning',
  },
  skipped: {
    icon: MinusCircle,
    color: 'text-slate-400 dark:text-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-800/30',
    label: 'Skipped',
  },
};

export function ChecklistPanel({ items, passedChecks, totalChecks }: ChecklistPanelProps) {
  const passPct = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)]">
      <div className="border-b border-slate-100 dark:border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Check Results</h3>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{passedChecks} of {totalChecks} checks passed</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{passPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                passPct >= 80 ? 'bg-green-500' : passPct >= 60 ? 'bg-amber-500' : 'bg-red-500'
              )}
              style={{ width: `${passPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
        {items.map((item) => {
          const config = STATUS_CONFIG[item.status];
          const Icon = config.icon;
          return (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
              <Icon className={cn('h-4 w-4 flex-shrink-0', config.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{item.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{item.ruleCode}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
