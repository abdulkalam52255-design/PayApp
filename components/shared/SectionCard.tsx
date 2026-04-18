import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md';
}

export function SectionCard({ children, className, padding = 'md' }: SectionCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]',
        padding === 'md' && 'p-5',
        padding === 'sm' && 'p-4',
        padding === 'none' && '',
        className
      )}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
}
