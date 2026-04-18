'use client';

import { useParams } from 'next/navigation';
import { Lock, OctagonAlert, TriangleAlert, Info } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { IssueSummaryCards } from '@/components/shared/IssueSummaryCards';
import { IssueList } from '@/components/shared/IssueList';
import { ChecklistPanel } from '@/components/shared/ChecklistPanel';
import { PaywallCard } from '@/components/shared/PaywallCard';
import { ReportSidebar } from '@/components/shared/ReportSidebar';
import { ReportHeader } from '@/components/report/ReportHeader';
import { MOCK_FULL_REPORT, MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import type { Issue } from '@/lib/types';

const PREVIEW_COUNT = 3;

export default function ReportPage() {
  const params = useParams();
  const submissionId = params.id as string;

  const submission = MOCK_SUBMISSIONS.find((s) => s.id === submissionId) ?? MOCK_SUBMISSIONS[0];
  const project = MOCK_PROJECTS.find((p) => p.id === submission.projectId);

  const isUnlocked = submission.isUnlocked;
  const report = MOCK_FULL_REPORT;
  const previewIssues = report.issues.slice(0, PREVIEW_COUNT);
  const lockedCount = report.issues.length - previewIssues.length;

  const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = report.issues.filter((i) => i.severity === 'warning').length;
  const infoCount = report.issues.filter((i) => i.severity === 'info').length;

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5">
          <ReportHeader
            project={project}
            submission={submission}
            report={report}
            isUnlocked={isUnlocked}
            previewCount={PREVIEW_COUNT}
            totalCount={report.issues.length}
          />
        </div>

        <div className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
          <IssueSummaryCards
            critical={criticalCount}
            warning={warningCount}
            info={infoCount}
            passed={isUnlocked ? report.passedChecks : undefined}
          />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            {isUnlocked ? (
              <FullReportContent report={report} />
            ) : (
              <PreviewContent
                previewIssues={previewIssues}
                lockedCount={lockedCount}
              />
            )}
          </div>

          <div className="w-full flex-shrink-0 lg:sticky lg:top-4 lg:w-72 xl:w-80">
            {isUnlocked ? (
              <ReportSidebar report={report} />
            ) : (
              <PaywallCard
                criticalCount={criticalCount}
                warningCount={warningCount}
                infoCount={infoCount}
                onUnlock={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FullReportContent({ report }: { report: typeof MOCK_FULL_REPORT }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Findings</h2>
        <IssueList issues={report.issues} showFilters grouped />
      </section>

      {report.checklistItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Check Results</h2>
          <ChecklistPanel
            items={report.checklistItems}
            passedChecks={report.passedChecks}
            totalChecks={report.totalChecks}
          />
        </section>
      )}
    </div>
  );
}

interface PreviewContentProps {
  previewIssues: Issue[];
  lockedCount: number;
}

function PreviewContent({ previewIssues, lockedCount }: PreviewContentProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/10">
        <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Preview Mode</p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
            Showing {previewIssues.length} of {previewIssues.length + lockedCount} findings.
            Unlock to access all issues, evidence detail, suggested fixes, and the complete check results.
          </p>
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Preview — {previewIssues.length} of {previewIssues.length + lockedCount} findings
      </p>

      {previewIssues.map((issue) => (
        <PreviewIssueCard key={issue.id} issue={issue} />
      ))}

      {lockedCount > 0 && <LockedOverlay count={lockedCount} />}
    </div>
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

  return (
    <div className={`rounded-lg border bg-white p-4 dark:bg-[hsl(222,20%,11%)] ${borderClass}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${colorClass}`} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-mono text-xs font-semibold ${colorClass}`}>{issue.ruleCode}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
            <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {issue.category.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{issue.title}</p>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {issue.explanation}
          </p>
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
