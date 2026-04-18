import { CircleCheck as CheckCircle2, Circle, Loader as Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubmissionStatus } from '@/lib/types';
import { PROCESSING_STEPS } from '@/lib/mock-data';

const STEP_ORDER: SubmissionStatus[] = [
  'uploading',
  'queued',
  'classifying',
  'parsing',
  'extracting',
  'validating',
];

function getStepState(
  stepKey: string,
  currentStatus: SubmissionStatus
): 'done' | 'active' | 'pending' | 'failed' {
  if (currentStatus === 'failed' || currentStatus === 'unsupported') {
    const currentIdx = STEP_ORDER.indexOf(currentStatus as SubmissionStatus);
    const stepIdx = STEP_ORDER.findIndex((s) => s === stepKey);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'failed';
    return 'pending';
  }
  if (currentStatus === 'report_ready' || currentStatus === 'preview_ready') return 'done';
  const currentIdx = STEP_ORDER.indexOf(currentStatus);
  const stepIdx = STEP_ORDER.findIndex((s) => s === stepKey);
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'pending';
}

interface ProcessingTrackerProps {
  status: SubmissionStatus;
}

export function ProcessingTracker({ status }: ProcessingTrackerProps) {
  const isDone = status === 'report_ready' || status === 'preview_ready';
  const isFailed = status === 'failed' || status === 'unsupported';

  return (
    <div className="space-y-1">
      {PROCESSING_STEPS.map((step, i) => {
        const state = getStepState(step.key, status);
        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2',
                  state === 'done' && 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20',
                  state === 'active' && 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20',
                  state === 'pending' && 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40',
                  state === 'failed' && 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                )}
              >
                {state === 'done' && <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {state === 'active' && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                )}
                {state === 'pending' && <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600" />}
                {state === 'failed' && <Circle className="h-4 w-4 text-red-500 dark:text-red-400" />}
              </div>
              {i < PROCESSING_STEPS.length - 1 && (
                <div
                  className={cn(
                    'mt-0.5 h-6 w-0.5',
                    state === 'done' ? 'bg-green-200 dark:bg-green-800/40' : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              )}
            </div>
            <div className="pb-4">
              <p
                className={cn(
                  'text-sm font-medium',
                  state === 'done' && 'text-green-700 dark:text-green-400',
                  state === 'active' && 'text-blue-700 dark:text-blue-400',
                  state === 'pending' && 'text-slate-400 dark:text-slate-500',
                  state === 'failed' && 'text-red-600 dark:text-red-400'
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
            </div>
          </div>
        );
      })}

      {(isDone || isFailed) && (
        <div
          className={cn(
            'mt-2 rounded-lg border px-4 py-3',
            isDone
              ? 'border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20'
              : 'border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20'
          )}
        >
          <p
            className={cn(
              'text-sm font-medium',
              isDone ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
            )}
          >
            {isDone ? 'Processing complete' : 'Processing failed'}
          </p>
          <p className={cn('text-xs', isDone ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400')}>
            {isDone
              ? status === 'report_ready'
                ? 'Full report is ready to view.'
                : 'Preview report is available. Unlock to see all findings.'
              : 'See the error details below.'}
          </p>
        </div>
      )}
    </div>
  );
}
