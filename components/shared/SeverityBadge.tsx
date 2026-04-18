import { cn } from '@/lib/utils';
import type { IssueSeverity } from '@/lib/types';

const SEVERITY_CONFIG: Record<
  IssueSeverity,
  { label: string; className: string; dotClass: string }
> = {
  critical: {
    label: 'Critical',
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40',
    dotClass: 'bg-red-600 dark:bg-red-400',
  },
  warning: {
    label: 'Warning',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40',
    dotClass: 'bg-amber-500 dark:bg-amber-400',
  },
  info: {
    label: 'Info',
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40',
    dotClass: 'bg-blue-500 dark:bg-blue-400',
  },
  pass: {
    label: 'Pass',
    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40',
    dotClass: 'bg-green-600 dark:bg-green-400',
  },
};

interface SeverityBadgeProps {
  severity: IssueSeverity;
  size?: 'sm' | 'md';
  className?: string;
}

export function SeverityBadge({ severity, size = 'md', className }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs',
        config.className,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}
