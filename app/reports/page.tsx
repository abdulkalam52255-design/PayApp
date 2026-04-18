'use client';

import Link from 'next/link';
import { ChartBar as BarChart3, ArrowRight, CircleCheck as CheckCircle2, Lock } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { IssueSummaryCards } from '@/components/shared/IssueSummaryCards';
import { MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReportsPage() {
  const reportableSubmissions = MOCK_SUBMISSIONS.filter(
    (s) => s.status === 'report_ready' || s.status === 'preview_ready'
  );

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Reports</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Preflight exception reports across all projects
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {reportableSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30 px-6 py-16 text-center">
              <BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">No reports yet</h3>
              <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Reports are generated after a submission completes preflight processing.
              </p>
              <Link href="/submissions/new" className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Upload a Package
              </Link>
            </div>
          ) : (
            reportableSubmissions.map((sub) => {
              const project = MOCK_PROJECTS.find((p) => p.id === sub.projectId);
              return (
                <div key={sub.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={sub.status} />
                        {sub.isUnlocked ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                            <Lock className="h-3.5 w-3.5" />
                            Preview only
                          </span>
                        )}
                      </div>
                      <h2 className="mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100">{project?.name}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{sub.billingPeriod} · {project?.owner}</p>
                    </div>
                    <Link
                      href={`/submissions/${sub.id}/report`}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      {sub.isUnlocked ? 'View Full Report' : 'View Preview'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="mt-4">
                    <IssueSummaryCards
                      critical={sub.criticalCount}
                      warning={sub.warningCount}
                      info={sub.infoCount}
                      compact
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Processed {formatDate(sub.completedAt ?? sub.createdAt)}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
