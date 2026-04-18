'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Issue } from '@/lib/types';
import { SeverityBadge } from './SeverityBadge';

const CATEGORY_LABELS: Record<string, string> = {
  math_mismatch: 'Math Mismatch',
  retainage_drift: 'Retainage',
  continuity: 'Continuity',
  missing_waiver: 'Waiver',
  missing_backup: 'Backup',
  change_order: 'Change Order',
};

interface IssueCardProps {
  issue: Issue;
  onEvidenceClick?: (issue: Issue) => void;
  defaultExpanded?: boolean;
}

export function IssueCard({ issue, onEvidenceClick, defaultExpanded }: IssueCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);

  return (
    <div
      className={cn(
        'rounded-lg border bg-white dark:bg-[hsl(222,20%,11%)] transition-shadow',
        issue.severity === 'critical'
          ? 'border-red-200 dark:border-red-800/50 shadow-sm'
          : 'border-slate-200 dark:border-slate-700',
        expanded && 'shadow-md dark:shadow-slate-900/50'
      )}
    >
      <button
        className="flex w-full items-start gap-3 p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={issue.severity} size="sm" />
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              {issue.ruleCode}
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs text-slate-500 dark:text-slate-400">
              {CATEGORY_LABELS[issue.category] ?? issue.category}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{issue.title}</p>
        </div>
        {expanded ? (
          <ChevronDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
        ) : (
          <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700/60 px-4 pb-4 pt-3">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Finding
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{issue.explanation}</p>
            </div>

            <div className="rounded-md border border-blue-100 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/20 p-3">
              <div className="flex gap-2">
                <Wrench className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Suggested Fix</p>
                  <p className="mt-0.5 text-sm text-blue-800 dark:text-blue-300">{issue.suggestedFix}</p>
                </div>
              </div>
            </div>

            {issue.evidence.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Evidence ({issue.evidence.length} reference{issue.evidence.length !== 1 ? 's' : ''})
                </p>
                <div className="mt-2 space-y-1.5">
                  {issue.evidence.slice(0, 2).map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2"
                    >
                      <FileText className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                      <div className="min-w-0 text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{ev.filename}</span>
                        <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-slate-500 dark:text-slate-400">{ev.pageOrSheet}</span>
                        {ev.cellRef && (
                          <>
                            <span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>
                            <span className="font-mono text-slate-500 dark:text-slate-400">{ev.cellRef}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {onEvidenceClick && (
                  <button
                    className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                    onClick={() => onEvidenceClick(issue)}
                  >
                    View full evidence →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
