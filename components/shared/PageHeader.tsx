import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
