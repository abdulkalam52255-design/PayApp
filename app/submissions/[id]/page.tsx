'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RefreshCw, FileStack } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessingTracker } from '@/components/shared/ProcessingTracker';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { UnsupportedWarning } from '@/components/shared/UnsupportedWarning';
import { FileRoleCard } from '@/components/shared/FileRoleCard';
import { MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import type { SubmissionStatus } from '@/lib/types';

const STATUS_PROGRESSION: SubmissionStatus[] = [
  'uploading', 'queued', 'classifying', 'parsing', 'extracting', 'validating', 'preview_ready',
];

export default function SubmissionProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const baseSubmission = MOCK_SUBMISSIONS.find((s) => s.id === submissionId) ?? MOCK_SUBMISSIONS.find(s => s.id === 'sub-processing')!;
  const project = MOCK_PROJECTS.find((p) => p.id === baseSubmission.projectId);

  const [currentStatus, setCurrentStatus] = useState<SubmissionStatus>(
    submissionId === 'sub-processing' ? 'uploading' : baseSubmission.status
  );
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (submissionId !== 'sub-processing') return;
    if (stepIndex >= STATUS_PROGRESSION.length) return;
    const timer = setTimeout(() => {
      setCurrentStatus(STATUS_PROGRESSION[stepIndex]);
      setStepIndex((i) => i + 1);
    }, 1800);
    return () => clearTimeout(timer);
  }, [stepIndex, submissionId]);

  const isFailed = currentStatus === 'failed' || currentStatus === 'unsupported';
  const isDone = currentStatus === 'report_ready' || currentStatus === 'preview_ready';

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-4">
          <Link
            href="/submissions"
            className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Submissions
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FileStack className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Submission</span>
              </div>
              <h1 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                {project?.name ?? 'Unknown Project'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{baseSubmission.billingPeriod}</p>
            </div>
            <StatusBadge status={currentStatus} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-700 pt-4 text-xs">
            <div>
              <p className="text-slate-400 dark:text-slate-500">Files</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{baseSubmission.files.length || '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500">Submitted</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {new Date(baseSubmission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500">Submission ID</p>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-300 truncate">{baseSubmission.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Processing Status</h2>
            <ProcessingTracker status={currentStatus} />
          </div>

          <div className="space-y-4">
            {baseSubmission.files.length > 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
                <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Uploaded Files</h2>
                <div className="space-y-2">
                  {baseSubmission.files.map((file) => (
                    <FileRoleCard key={file.id} file={file} />
                  ))}
                </div>
              </div>
            )}

            {isFailed && (
              <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
                <h2 className="mb-3 text-sm font-semibold text-red-700 dark:text-red-400">Processing Failed</h2>
                <UnsupportedWarning reason={baseSubmission.failureReason} />
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/submissions/new"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry with New Files
                  </Link>
                </div>
              </div>
            )}

            {isDone && (
              <div className="rounded-xl border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20 p-5">
                <h2 className="text-sm font-semibold text-green-800 dark:text-green-300">Preflight Complete</h2>
                <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                  {currentStatus === 'report_ready'
                    ? 'The full report is ready to view.'
                    : 'A preview report is available. Unlock the full report to see all findings.'}
                </p>
                <Link
                  href={`/submissions/${baseSubmission.id}/report`}
                  className="mt-3 flex items-center gap-2 rounded-lg bg-green-700 dark:bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 dark:hover:bg-green-700 w-fit"
                >
                  View Report
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
