'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Shield, Calendar, Building2, Hash, CircleCheck, Lock } from 'lucide-react';
import type { Report, Submission, Project } from '@/lib/types';

interface ReportHeaderProps {
  project: Project | undefined;
  submission: Submission;
  report: Report;
  isUnlocked: boolean;
  previewCount: number;
  totalCount: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ReportHeader({ project, submission, report, isUnlocked, previewCount, totalCount }: ReportHeaderProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-700/60">
        <Link
          href={`/projects/${project?.id}`}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {project?.name ?? 'Project'}
        </Link>

        <div className="flex items-center gap-2">
          {isUnlocked && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
              <CircleCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Full report</span>
            </span>
          )}
          {isUnlocked && (
            <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Preflight Report
                </span>
              </div>
              <ReportAccessBadge isUnlocked={isUnlocked} previewCount={previewCount} totalCount={totalCount} />
            </div>
            <h1 className="mt-2 text-lg font-bold leading-tight text-slate-900 sm:text-xl dark:text-slate-100">
              {project?.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <MetaItem icon={Calendar} label={submission.billingPeriod} />
              <MetaItem icon={Building2} label={project?.owner ?? ''} />
              <MetaItem icon={Hash} label={project?.contractRef ?? ''} mono />
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400 dark:text-slate-500">Generated</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(report.generatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportAccessBadge({ isUnlocked, previewCount, totalCount }: { isUnlocked: boolean; previewCount: number; totalCount: number }) {
  if (isUnlocked) return null;
  return (
    <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
      <Lock className="h-3 w-3" />
      Preview — {previewCount} of {totalCount}
    </span>
  );
}

function MetaItem({ icon: Icon, label, mono }: { icon: React.FC<{ className?: string }>; label: string; mono?: boolean }) {
  if (!label) return null;
  return (
    <span className={`flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ${mono ? 'font-mono' : ''}`}>
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {label}
    </span>
  );
}
