import Link from 'next/link';
import { ArrowLeft, FileStack } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProcessingView } from '@/components/submissions/ProcessingView';
import { getSubmissionViewModel } from '@/lib/view-models/submissions';

export default async function SubmissionProcessingPage({ params }: { params: { id: string } }) {
  const submissionId = params.id;
  const { submission, projectName } = await getSubmissionViewModel(submissionId);

  // The 'sub-processing' ID is our mock simulation demo trigger. In real integration, an active boolean comes from the engine.
  const isDemo = submissionId === 'sub-processing';

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 relative">
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
                {projectName}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{submission!.billingPeriod}</p>
            </div>
            {/* The Status Badge is rendered inside ProcessingView since it's actively mutable */}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-700 pt-4 text-xs">
            <div>
              <p className="text-slate-400 dark:text-slate-500">Files</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{submission!.files.length || '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500">Submitted</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {new Date(submission!.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500">Submission ID</p>
              <p className="font-mono font-medium text-slate-700 dark:text-slate-300 truncate">{submission!.id}</p>
            </div>
          </div>
        </div>

        <ProcessingView submission={submission!} isDemo={isDemo} />
      </div>
    </AppShell>
  );
}
