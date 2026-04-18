'use client';

import Link from 'next/link';
import { FolderKanban, FileText, OctagonAlert as AlertOctagon, Clock as Unlock, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatsCard } from '@/components/shared/StatsCard';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { MOCK_PROJECTS, MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { DEMO } from '@/lib/demo';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardPage() {
  const recentSubmissions = MOCK_SUBMISSIONS.slice(0, 4);
  const alertSubmission = MOCK_SUBMISSIONS.find((s) => s.id === DEMO.ALERT.submissionId);
  const alertProject = alertSubmission ? MOCK_PROJECTS.find((p) => p.id === alertSubmission.projectId) : null;

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Welcome back — your workspace overview.
            </p>
          </div>
          <Link
            href="/submissions/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Submission</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatsCard label="Active Projects" value={MOCK_PROJECTS.length} icon={FolderKanban} accent="blue" />
          <StatsCard label="Submissions This Month" value={DEMO.USER.submissionsUsed} icon={FileText} accent="default" trend={{ value: '+2 vs last month', positive: true }} />
          <StatsCard label="Critical Issues Found" value={3} icon={AlertOctagon} accent="red" />
          <StatsCard label="Reports Unlocked" value={DEMO.USER.unlocksUsed} icon={Unlock} accent="green" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Active Projects</h2>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {MOCK_PROJECTS.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="No projects yet"
                description="Create your first project to start uploading pay-app packages."
                action={
                  <Link href="/projects/new" className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {MOCK_PROJECTS.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent Submissions</h2>
              <Link
                href="/submissions"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[hsl(222,20%,11%)]">
              {recentSubmissions.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No submissions yet.</div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentSubmissions.map((sub) => {
                    const project = MOCK_PROJECTS.find((p) => p.id === sub.projectId);
                    const hasReport = sub.status === 'report_ready' || sub.status === 'preview_ready';
                    return (
                      <li key={sub.id} className="px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                              {project?.name ?? 'Unknown Project'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{sub.billingPeriod}</p>
                          </div>
                          <StatusBadge status={sub.status} />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(sub.createdAt)}</p>
                          <Link
                            href={hasReport ? `/submissions/${sub.id}/report` : `/submissions/${sub.id}`}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View →
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {alertSubmission && alertProject && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                    <AlertOctagon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Attention Required</p>
                    <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-400">
                      {DEMO.ALERT.message}
                    </p>
                    <Link
                      href={`/submissions/${DEMO.ALERT.submissionId}/report`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200"
                    >
                      View Report
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[hsl(222,20%,11%)]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Monthly Usage</h3>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-3 space-y-2.5">
                {[
                  { label: 'Submissions', used: DEMO.USER.submissionsUsed, total: DEMO.USER.submissionsTotal, color: 'bg-blue-600' },
                  { label: 'Unlocks', used: DEMO.USER.unlocksUsed, total: DEMO.USER.unlocksTotal, color: 'bg-green-600' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                      <span className="font-medium tabular-nums text-slate-900 dark:text-slate-200">{item.used}/{item.total}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className={`h-full rounded-full transition-all ${item.color}`} style={{ width: `${(item.used / item.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
