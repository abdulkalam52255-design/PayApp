'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Shield, Calendar, Building2, CircleCheck as CheckCircle2, Lock } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { IssueSummaryCards } from '@/components/shared/IssueSummaryCards';
import { IssueCard } from '@/components/shared/IssueCard';
import { IssueList } from '@/components/shared/IssueList';
import { EvidenceDrawer } from '@/components/shared/EvidenceDrawer';
import { PaywallCard } from '@/components/shared/PaywallCard';
import { ChecklistPanel } from '@/components/shared/ChecklistPanel';
import { MOCK_FULL_REPORT, MOCK_PREVIEW_REPORT, MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import type { Issue } from '@/lib/types';

export default function ReportPage() {
  const params = useParams();
  const submissionId = params.id as string;

  const submission = MOCK_SUBMISSIONS.find((s) => s.id === submissionId) ?? MOCK_SUBMISSIONS[0];
  const project = MOCK_PROJECTS.find((p) => p.id === submission.projectId);
  const isUnlocked = submission.isUnlocked;

  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [evidenceIssue, setEvidenceIssue] = useState<Issue | null>(null);
  const displayReport = unlocked ? MOCK_FULL_REPORT : MOCK_PREVIEW_REPORT;
  const displayIssues = unlocked ? displayReport.issues : displayReport.issues.slice(0, 3);

  const generatedDate = new Date(displayReport.generatedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={`/projects/${project?.id}`}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Project
          </Link>
          {unlocked && (
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
          )}
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {unlocked ? 'Full Preflight Report' : 'Preflight Preview'}
                </span>
                {!unlocked && (
                  <span className="flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <Lock className="h-3 w-3" />
                    Preview — 3 of {MOCK_FULL_REPORT.issues.length} issues shown
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{project?.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {submission.billingPeriod}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {project?.owner}
                </span>
                <span className="font-mono">{project?.contractRef}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500">Generated</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{generatedDate}</p>
              {unlocked && (
                <div className="mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Full report unlocked
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 dark:border-slate-700 pt-5">
            <IssueSummaryCards
              critical={MOCK_FULL_REPORT.issues.filter((i) => i.severity === 'critical').length}
              warning={MOCK_FULL_REPORT.issues.filter((i) => i.severity === 'warning').length}
              info={MOCK_FULL_REPORT.issues.filter((i) => i.severity === 'info').length}
              passed={unlocked ? displayReport.passedChecks : undefined}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 min-w-0">
            {!unlocked && (
              <div className="mb-4 rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/20 p-4">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Preview Mode</p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  You are viewing 3 of {MOCK_FULL_REPORT.issues.length} findings. Unlock the full
                  report to see all issues, evidence links, suggested fixes, and the complete
                  checklist.
                </p>
              </div>
            )}

            {unlocked ? (
              <IssueList issues={displayReport.issues} showFilters />
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Surfaced Issues (preview — 3 of {MOCK_FULL_REPORT.issues.length})
                </p>
                {displayIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    defaultExpanded={issue.severity === 'critical'}
                    onEvidenceClick={setEvidenceIssue}
                  />
                ))}
                <div className="relative">
                  <div className="space-y-2 blur-sm pointer-events-none">
                    {MOCK_FULL_REPORT.issues.slice(3, 5).map((issue) => (
                      <div key={issue.id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-4">
                        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="mt-2 h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/60 dark:bg-[hsl(222,20%,11%)]/70">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,13%)] px-4 py-3 shadow text-center">
                      <Lock className="mx-auto h-5 w-5 text-slate-400 dark:text-slate-500" />
                      <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {MOCK_FULL_REPORT.issues.length - 3} more findings locked
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {unlocked && displayReport.checklistItems.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Check Results</h2>
                <ChecklistPanel
                  items={displayReport.checklistItems}
                  passedChecks={displayReport.passedChecks}
                  totalChecks={displayReport.totalChecks}
                />
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            {!unlocked ? (
              <PaywallCard
                criticalCount={MOCK_FULL_REPORT.issues.filter((i) => i.severity === 'critical').length}
                warningCount={MOCK_FULL_REPORT.issues.filter((i) => i.severity === 'warning').length}
                infoCount={MOCK_FULL_REPORT.issues.filter((i) => i.severity === 'info').length}
                onUnlock={() => setUnlocked(true)}
              />
            ) : (
              <div className="sticky top-4 space-y-4">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-4">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Report Summary</p>
                  <div className="mt-3 space-y-2">
                    {[
                      { label: 'Total Issues', value: MOCK_FULL_REPORT.issues.length, color: 'text-slate-900 dark:text-slate-100' },
                      { label: 'Critical', value: MOCK_FULL_REPORT.issues.filter(i => i.severity === 'critical').length, color: 'text-red-700 dark:text-red-400' },
                      { label: 'Warnings', value: MOCK_FULL_REPORT.issues.filter(i => i.severity === 'warning').length, color: 'text-amber-700 dark:text-amber-400' },
                      { label: 'Info', value: MOCK_FULL_REPORT.issues.filter(i => i.severity === 'info').length, color: 'text-blue-700 dark:text-blue-400' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                        <span className={`font-semibold tabular-nums ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Checks Passed</span>
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          {MOCK_FULL_REPORT.passedChecks}/{MOCK_FULL_REPORT.totalChecks}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {evidenceIssue && (
                  <EvidenceDrawer issue={evidenceIssue} onClose={() => setEvidenceIssue(null)} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
