import { CircleCheck, Circle, TriangleAlert, CircleMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChecklistItem } from '@/lib/types';

interface ChecklistPanelProps {
  items: ChecklistItem[];
  passedChecks: number;
  totalChecks: number;
}

const STATUS_CONFIG = {
  pass: {
    icon: CircleCheck,
    iconClass: 'text-green-600 dark:text-green-400',
    label: 'Passed',
  },
  fail: {
    icon: Circle,
    iconClass: 'text-red-500 dark:text-red-400',
    label: 'Failed',
  },
  warning: {
    icon: TriangleAlert,
    iconClass: 'text-amber-500 dark:text-amber-400',
    label: 'Warning',
  },
  skipped: {
    icon: CircleMinus,
    iconClass: 'text-slate-300 dark:text-slate-600',
    label: 'Skipped',
  },
} as const;

function getProgressColor(pct: number) {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getScoreLabel(pct: number) {
  if (pct >= 80) return { label: 'Good', className: 'text-green-700 dark:text-green-400' };
  if (pct >= 60) return { label: 'Needs Review', className: 'text-amber-700 dark:text-amber-400' };
  return { label: 'Attention Required', className: 'text-red-700 dark:text-red-400' };
}

export function ChecklistPanel({ items, passedChecks, totalChecks }: ChecklistPanelProps) {
  const passPct = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  const score = getScoreLabel(passPct);

  const failedItems = items.filter((i) => i.status === 'fail');
  const warningItems = items.filter((i) => i.status === 'warning');
  const passedItems = items.filter((i) => i.status === 'pass');
  const skippedItems = items.filter((i) => i.status === 'skipped');

  const hasActionable = failedItems.length > 0 || warningItems.length > 0;

  const grouped = [
    { status: 'fail' as const, items: failedItems },
    { status: 'warning' as const, items: warningItems },
    { status: 'pass' as const, items: passedItems },
    { status: 'skipped' as const, items: skippedItems },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Check Results</h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {passedChecks} of {totalChecks} checks passed
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{passPct}%</p>
            <p className={cn('text-xs font-semibold', score.className)}>{score.label}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className={cn('h-full rounded-full transition-all', getProgressColor(passPct))}
            style={{ width: `${passPct}%` }}
          />
        </div>
      </div>

      <div>
        {grouped.map(({ status, items: groupItems }, index) => {
          const config = STATUS_CONFIG[status];
          const GroupIcon = config.icon;
          const isActionable = status === 'fail' || status === 'warning';
          const deemphasized = !isActionable && hasActionable;

          return (
            <div
              key={status}
              className={cn(
                'border-b border-slate-100 last:border-0 dark:border-slate-700/60',
                deemphasized && 'opacity-60'
              )}
            >
              <div className={cn('flex items-center gap-2 px-5 py-2', isActionable ? 'bg-slate-50/80 dark:bg-slate-800/50' : 'bg-slate-50/40 dark:bg-slate-800/20')}>
                <GroupIcon className={cn('h-3.5 w-3.5 flex-shrink-0', config.iconClass)} />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{config.label}</span>
                <span className="ml-auto font-mono text-xs text-slate-400 dark:text-slate-500">{groupItems.length}</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                {groupItems.map((item) => {
                  const ItemIcon = STATUS_CONFIG[item.status].icon;
                  const itemConfig = STATUS_CONFIG[item.status];
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center gap-3 px-5 py-2.5 transition-colors',
                        isActionable ? 'hover:bg-slate-100/60 dark:hover:bg-slate-700/40' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/20'
                      )}
                    >
                      <ItemIcon className={cn('h-3.5 w-3.5 flex-shrink-0', itemConfig.iconClass)} />
                      <p className={cn('flex-1 truncate text-xs', isActionable ? 'font-semibold text-slate-800 dark:text-slate-200' : 'font-medium text-slate-600 dark:text-slate-400')}>{item.label}</p>
                      <span className="ml-auto flex-shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500">{item.ruleCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
