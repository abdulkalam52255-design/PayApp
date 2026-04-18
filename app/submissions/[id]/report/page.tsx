'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Lock, OctagonAlert, TriangleAlert, Info } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { IssueSummaryCards } from '@/components/shared/IssueSummaryCards';
import { IssueList } from '@/components/shared/IssueList';
import { ChecklistPanel } from '@/components/shared/ChecklistPanel';
import { PaywallCard } from '@/components/shared/PaywallCard';
import { ReportSidebar } from '@/components/shared/ReportSidebar';
import { ReportHeader } from '@/components/report/ReportHeader';
import { EvidenceModal } from '@/components/shared/EvidenceModal';
import { createReportViewModel } from '@/lib/report-view-model';
import { MOCK_FULL_REPORT, MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import type { Issue } from '@/lib/types';

export default function ReportPage() {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const params = useParams();
  const submissionId = params.id as string;

  const submission = MOCK_SUBMISSIONS.find((s) => s.id === submissionId) ?? MOCK_SUBMISSIONS[0];
  const project = MOCK_PROJECTS.find((p) => p.id === submission.projectId);
  const report = MOCK_FULL_REPORT;

  const viewModel = createReportViewModel(submission, project, report);

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5">
          <ReportHeader
            project={viewModel.project}
            submission={viewModel.submission}
            report={viewModel.report}
            isUnlocked={viewModel.isUnlocked}
            previewCount={viewModel.previewIssues.length}
            totalCount={viewModel.stats.total}
          />
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
          <IssueSummaryCards
            critical={viewModel.stats.critical}
            warning={viewModel.stats.warning}
            info={viewModel.stats.info}
            passed={viewModel.isUnlocked ? viewModel.stats.passedChecks : undefined}
          />
        </div>

        {viewModel.isUnlocked ? (
          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Findings</h2>
              <IssueList
                issues={viewModel.report.issues}
                showFilters
                grouped
                onEvidenceClick={setActiveIssue}
              />
            </section>

            {viewModel.checklist.hasItems && (
              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Check Results</h2>
                <ChecklistPanel
                  items={viewModel.report.checklistItems}
                  passedChecks={viewModel.stats.passedChecks}
                  totalChecks={viewModel.stats.totalChecks}
                />
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/10">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Preview Mode</p>
                <p className="mt-0.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                  Showing {viewModel.previewIssues.length} of {viewModel.stats.total} findings.
                  Unlock to access all issues, evidence detail, suggested fixes, and the complete check results.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Preview — {viewModel.previewIssues.length} of {viewModel.stats.total} findings
              </p>
              <div className="space-y-3">
                {viewModel.previewIssues.map((issue) => (
                  <PreviewIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </div>

            {viewModel.lockedCount > 0 && <LockedOverlay count={viewModel.lockedCount} />}

            <div className="lg:max-w-md">
              <PaywallCard
                criticalCount={viewModel.stats.critical}
                warningCount={viewModel.stats.warning}
                infoCount={viewModel.stats.info}
                onUnlock={() => {}}
              />
            </div>
          </div>
        )}
      </div>

      <EvidenceModal issue={activeIssue} onClose={() => setActiveIssue(null)} />
    </AppShell>
  );
}

function PreviewIssueCard({ issue }: { issue: Issue }) {
  const isCritical = issue.severity === 'critical';
  const isWarning = issue.severity === 'warning';
  const Icon = isCritical ? OctagonAlert : isWarning ? TriangleAlert : Info;
  const colorClass = isCritical
    ? 'text-red-600 dark:text-red-400'
    : isWarning
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-blue-600 dark:text-blue-400';
  const borderClass = isCritical
    ? 'border-red-200 dark:border-red-800/50'
    : 'border-slate-200 dark:border-slate-700';

  const hasEvidence = issue.evidence.length > 0;
  const firstEvidence = issue.evidence[0];
  const locationHint = hasEvidence
    ? `${firstEvidence.pageOrSheet}${firstEvidence.cellRef ? ` · ${firstEvidence.cellRef}` : ''}`
    : null;

  return (
    <div className={`rounded-lg border bg-white p-4 dark:bg-[hsl(222,20%,11%)] ${borderClass}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${colorClass}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-mono text-xs font-semibold ${colorClass}`}>{issue.ruleCode}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
            <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {issue.category.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">{issue.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {issue.explanation}
          </p>
          {locationHint && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Found in {locationHint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LockedOverlay({ count }: { count: number }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="pointer-events-none select-none space-y-px" aria-hidden>
        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 bg-white p-4 dark:bg-[hsl(222,20%,11%)]">
            <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" style={{ opacity: 1 - i * 0.2 }} />
              <div className="h-3 w-48 rounded bg-slate-100 dark:bg-slate-800" style={{ opacity: 1 - i * 0.2 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] dark:bg-[hsl(222,22%,8%)]/70">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-[hsl(222,20%,13%)]">
          <Lock className="mx-auto h-4 w-4 text-slate-400 dark:text-slate-500" />
          <p className="mt-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {count} more {count === 1 ? 'finding' : 'findings'} locked
          </p>
        </div>
      </div>
    </div>
  );
}
