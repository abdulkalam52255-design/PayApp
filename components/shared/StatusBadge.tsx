import { cn } from '@/lib/utils';
import type { SubmissionStatus } from '@/lib/types';

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
  uploading: { label: 'Uploading', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40' },
  queued: { label: 'Queued', className: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
  classifying: { label: 'Classifying', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40' },
  parsing: { label: 'Parsing', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40' },
  extracting: { label: 'Extracting', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40' },
  validating: { label: 'Validating', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40' },
  preview_ready: {
    label: 'Preview Ready',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40',
  },
  report_ready: {
    label: 'Report Ready',
    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40',
  },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40' },
  unsupported: {
    label: 'Unsupported',
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40',
  },
};

interface StatusBadgeProps {
  status: SubmissionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'report_ready' && 'bg-green-600 dark:bg-green-400',
          status === 'preview_ready' && 'bg-amber-500 dark:bg-amber-400',
          status === 'failed' || status === 'unsupported' ? 'bg-red-500 dark:bg-red-400' : '',
          (status === 'uploading' ||
            status === 'classifying' ||
            status === 'parsing' ||
            status === 'extracting') &&
            'animate-pulse bg-blue-600 dark:bg-blue-400',
          status === 'validating' && 'animate-pulse bg-amber-500 dark:bg-amber-400',
          (status === 'draft' || status === 'queued') && 'bg-slate-400 dark:bg-slate-500'
        )}
      />
      {config.label}
    </span>
  );
}
