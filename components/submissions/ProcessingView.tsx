'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { ProcessingTracker } from '@/components/shared/ProcessingTracker';
import { FileRoleCard } from '@/components/shared/FileRoleCard';
import { UnsupportedWarning } from '@/components/shared/UnsupportedWarning';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Submission, SubmissionStatus } from '@/lib/types';

const STATUS_PROGRESSION: SubmissionStatus[] = [
  'uploading', 'queued', 'classifying', 'parsing', 'extracting', 'validating', 'preview_ready',
];

export function ProcessingView({ submission, isDemo }: { submission: Submission; isDemo: boolean }) {
  const [currentStatus, setCurrentStatus] = useState<SubmissionStatus>(
    isDemo ? 'uploading' : submission.status
  );
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isDemo) return;
    if (stepIndex >= STATUS_PROGRESSION.length) return;
    const timer = setTimeout(() => {
      setCurrentStatus(STATUS_PROGRESSION[stepIndex]);
      setStepIndex((i) => i + 1);
    }, 1800);
    return () => clearTimeout(timer);
  }, [stepIndex, isDemo]);

  const isFailed = currentStatus === 'failed' || currentStatus === 'unsupported';
  const isDone = currentStatus === 'report_ready' || currentStatus === 'preview_ready';

  return (
    <>
      <div className="absolute top-8 right-6">
        <StatusBadge status={currentStatus} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Processing Status</h2>
          <ProcessingTracker status={currentStatus} />
        </div>

        <div className="space-y-4">
          {submission.files.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Uploaded Files</h2>
              <div className="space-y-2">
                {submission.files.map((file) => (
                  <FileRoleCard key={file.id} file={file} />
                ))}
              </div>
            </div>
          )}

          {isFailed && (
            <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
              <h2 className="mb-3 text-sm font-semibold text-red-700 dark:text-red-400">Processing Failed</h2>
              <UnsupportedWarning reason={submission.failureReason} />
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
                href={`/submissions/${submission.id}/report`}
                className="mt-3 flex items-center gap-2 rounded-lg bg-green-700 dark:bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 dark:hover:bg-green-700 w-fit"
              >
                View Report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
