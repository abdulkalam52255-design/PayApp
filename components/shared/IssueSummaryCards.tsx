import { OctagonAlert as AlertOctagon, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssueSummaryCardsProps {
  critical: number;
  warning: number;
  info: number;
  passed?: number;
  compact?: boolean;
}

export function IssueSummaryCards({
  critical,
  warning,
  info,
  passed,
  compact,
}: IssueSummaryCardsProps) {
  const cards = [
    {
      label: 'Critical',
      count: critical,
      icon: AlertOctagon,
      className: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/40',
      textClass: 'text-red-700 dark:text-red-400',
      iconClass: 'text-red-500 dark:text-red-400',
      countClass: 'text-red-700 dark:text-red-400',
    },
    {
      label: 'Warning',
      count: warning,
      icon: AlertTriangle,
      className: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40',
      textClass: 'text-amber-700 dark:text-amber-400',
      iconClass: 'text-amber-500 dark:text-amber-400',
      countClass: 'text-amber-700 dark:text-amber-400',
    },
    {
      label: 'Info',
      count: info,
      icon: Info,
      className: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/40',
      textClass: 'text-blue-700 dark:text-blue-400',
      iconClass: 'text-blue-500 dark:text-blue-400',
      countClass: 'text-blue-700 dark:text-blue-400',
    },
    ...(passed !== undefined
      ? [
          {
            label: 'Passed',
            count: passed,
            icon: CheckCircle2,
            className: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/40',
            textClass: 'text-green-700 dark:text-green-400',
            iconClass: 'text-green-500 dark:text-green-400',
            countClass: 'text-green-700 dark:text-green-400',
          },
        ]
      : []),
  ];

  return (
    <div className={cn('grid gap-3', compact ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4')}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              'rounded-lg border',
              compact ? 'p-3' : 'p-4',
              card.className
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className={cn('h-4 w-4', card.iconClass)} />
              <span className={cn('text-xs font-medium', card.textClass)}>{card.label}</span>
            </div>
            <p className={cn('font-semibold tabular-nums', compact ? 'mt-1 text-xl' : 'mt-2 text-3xl', card.countClass)}>
              {card.count}
            </p>
          </div>
        );
      })}
    </div>
  );
}
