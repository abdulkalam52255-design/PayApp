'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Shield, Calendar, Building2, CircleCheck as CheckCircle2, Lock, TriangleAlert, OctagonAlert, Info } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { IssueSummaryCards } from '@/components/shared/IssueSummaryCards';
import { IssueList } from '@/components/shared/IssueList';
import { ChecklistPanel } from '@/components/shared/ChecklistPanel';
import { PaywallCard } from '@/components/shared/PaywallCard';
import { ReportSidebar } from '@/components/shared/ReportSidebar';
import { MOCK_FULL_REPORT, MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function ReportPage() {
  const params = useParams();
  const submissionId = params.id as string;

  const submission = MOCK_SUBMISSIONS.find((s) => s.id === submissionId) ?? MOCK_SUBMISSIONS[0];
  const project = MOCK_PROJECTS.find((p) => p.id === submission.projectId);

  const isUnlocked = submission.isUnlocked;
  const report = MOCK_FULL_REPORT;
  const previewIssues = report.issues.slice(0, 3);
  const lockedCount = report.issues.length - previewIssues.length;

  const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = report.issues.filter((i) => i.severity === 'warning').length;
  const infoCount = report.issues.filter((i) => i.severity === 'info').length;

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href={`/projects/${project?.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Project
          </Link>
          {isUnlocked && (
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </button>
          )}
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  {isUnlocked ? 'Full Preflight Report' : 'Preview Report'}
                </span>
                {!isUnlocked && (
                  <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
                    <Lock className="h-3 w-3" />
                    {previewIssues.length} of {report.issues.length} issues shown
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{project?.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {submission.billingPeriod}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {project?.owner}
                </span>
                <span className="font-mono text-slate-400 dark:text-slate-500">{project?.contractRef}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500">Report generated</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{formatDate(report.generatedAt)}</p>
              {isUnlocked && (
                <div className="mt-1.5 flex items-center justify-end gap-1 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Full report
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-700/60">
            <IssueSummaryCards
              critical={criticalCount}
              warning={warningCount}
              info={infoCount}
              passed={isUnlocked ? report.passedChecks : undefined}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            {!isUnlocked && (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/10">
                <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Preview Mode</p>
                  <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-400">
                    Showing {previewIssues.length} of {report.issues.length} findings. Unlock to access all issues, evidence detail, suggested fixes, and the complete check results.
                  </p>
                </div>
              </div>
            )}

            {isUnlocked ? (
              <>
                <IssueList issues={report.issues} showFilters />
                {report.checklistItems.length > 0 && (
                  <div className="mt-8">
                    <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Check Results</h2>
                    <ChecklistPanel
                      items={report.checklistItems}
                      passedChecks={report.passedChecks}
                      totalChecks={report.totalChecks}
                    />
                  </div>
                )}
              </>
            ) : (
              <PreviewIssueList
                previewIssues={previewIssues}
                lockedCount={lockedCount}
              />
            )}
          </div>

          <div className="w-full flex-shrink-0 lg:w-72 xl:w-80">
            <div className="lg:sticky lg:top-4 space-y-4">
              {!isUnlocked ? (
                <PaywallCard
                  criticalCount={criticalCount}
                  warningCount={warningCount}
                  infoCount={infoCount}
                  onUnlock={() => {}}
                />
              ) : (
                <ReportSidebar report={report} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

interface PreviewIssueListProps {
  previewIssues: typeof MOCK_FULL_REPORT.issues;
  lockedCount: number;
}

function PreviewIssueList({ previewIssues, lockedCount }: PreviewIssueListProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Preview — {previewIssues.length} of {previewIssues.length + lockedCount} findings
      </p>

      {previewIssues.map((issue) => {
        const issCritical = issue.severity === 'critical';
        const issWarning = issue.severity === 'warning';
        const Icon = issCritical ? OctagonAlert : issWarning ? TriangleAlert : Info;
        const colorClass = issCritical
          ? 'text-red-600 dark:text-red-400'
          : issWarning
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-blue-600 dark:text-blue-400';
        const borderClass = issCritical
          ? 'border-red-200 dark:border-red-800/50'
          : 'border-slate-200 dark:border-slate-700';

        return (
          <div
            key={issue.id}
            className={`rounded-lg border bg-white p-4 dark:bg-[hsl(222,20%,11%)] ${borderClass}`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${colorClass}`} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`font-mono text-xs font-semibold ${colorClass}`}>{issue.ruleCode}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{issue.category.replace(/_/g, ' ')}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{issue.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">{issue.explanation}</p>
              </div>
            </div>
          </div>
        );
      })}

      {lockedCount > 0 && (
        <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="space-y-px pointer-events-none select-none" aria-hidden>
            {Array.from({ length: Math.min(lockedCount, 3) }).map((_, i) => (
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
                {lockedCount} more {lockedCount === 1 ? 'finding' : 'findings'} locked
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
