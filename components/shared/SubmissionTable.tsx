import Link from 'next/link';
import { ArrowRight, OctagonAlert as AlertOctagon, TriangleAlert as AlertTriangle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Submission } from '@/lib/types';

interface SubmissionTableProps {
  submissions: Submission[];
  projectId: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SubmissionTable({ submissions, projectId }: SubmissionTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 px-6 py-10 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">No submissions yet for this project.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Period
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Issues
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Submitted
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {submissions.map((sub) => (
            <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{sub.billingPeriod}</td>
              <td className="px-4 py-3">
                <StatusBadge status={sub.status} />
              </td>
              <td className="px-4 py-3">
                {sub.status === 'report_ready' || sub.status === 'preview_ready' ? (
                  <div className="flex items-center gap-3">
                    {sub.criticalCount > 0 && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                        <AlertOctagon className="h-3.5 w-3.5" />
                        {sub.criticalCount}
                      </span>
                    )}
                    {sub.warningCount > 0 && (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {sub.warningCount}
                      </span>
                    )}
                    {sub.criticalCount === 0 && sub.warningCount === 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Clean</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{formatDate(sub.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={
                    sub.status === 'report_ready' || sub.status === 'preview_ready'
                      ? `/submissions/${sub.id}/report`
                      : `/submissions/${sub.id}`
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {sub.status === 'report_ready'
                    ? 'View Report'
                    : sub.status === 'preview_ready'
                    ? 'View Preview'
                    : sub.status === 'failed'
                    ? 'View Error'
                    : 'View'}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
