import Link from 'next/link';
import { Plus, FileText, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { getSubmissionsViewModel } from '@/lib/view-models/submissions';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function SubmissionsPage() {
  const vm = await getSubmissionsViewModel();
  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Submissions</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              All pay-app submissions across your projects
            </p>
          </div>
          <Link
            href="/submissions/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Submission</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        <div className="mt-6">
          {vm.submissions.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No submissions yet"
              description="Upload your first pay-app package to run a preflight check."
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Project</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Issues</th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Submitted</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {vm.submissions.map((sub) => {
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{sub.projectName}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{sub.projectId}</p>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-3 font-medium text-slate-900 dark:text-slate-100 text-xs">{sub.billingPeriod}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="hidden md:table-cell px-4 py-3">
                          {sub.criticalCount > 0 || sub.warningCount > 0 ? (
                            <div className="flex items-center gap-2 text-xs">
                              {sub.criticalCount > 0 && <span className="font-medium text-red-600 dark:text-red-400">{sub.criticalCount} critical</span>}
                              {sub.warningCount > 0 && <span className="font-medium text-amber-600 dark:text-amber-400">{sub.warningCount} warnings</span>}
                            </div>
                          ) : <span className="text-xs text-slate-400 dark:text-slate-500">—</span>}
                        </td>
                        <td className="hidden lg:table-cell px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{formatDate(sub.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={sub.status === 'report_ready' || sub.status === 'preview_ready' ? `/submissions/${sub.id}/report` : `/submissions/${sub.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            {sub.status === 'report_ready' ? 'Full Report' : sub.status === 'preview_ready' ? 'Preview' : 'View'}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
