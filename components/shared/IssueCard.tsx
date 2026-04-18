'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, FileSpreadsheet, Wrench, ExternalLink } from 'lucide-react';
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

  const isCritical = issue.severity === 'critical';

  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition-shadow dark:bg-[hsl(222,20%,11%)]',
        isCritical
          ? 'border-red-200 shadow-sm dark:border-red-800/50'
          : 'border-slate-200 dark:border-slate-700',
        expanded && 'shadow-md dark:shadow-slate-900/50'
      )}
    >
      <button
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <SeverityBadge severity={issue.severity} size="sm" />
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {issue.ruleCode}
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {CATEGORY_LABELS[issue.category] ?? issue.category}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
            {issue.title}
          </p>
          {!expanded && (
            <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {issue.explanation}
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
        ) : (
          <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 dark:border-slate-700/60">
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Finding
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{issue.explanation}</p>
            </div>

            <div className="rounded-md border border-blue-100 bg-blue-50 p-3 dark:border-blue-800/40 dark:bg-blue-900/20">
              <div className="flex gap-2">
                <Wrench className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Suggested Fix</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-blue-800 dark:text-blue-300">{issue.suggestedFix}</p>
                </div>
              </div>
            </div>

            {issue.evidence.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Evidence ({issue.evidence.length} reference{issue.evidence.length !== 1 ? 's' : ''})
                </p>
                <div className="space-y-2">
                  {issue.evidence.map((ev, i) => {
                    const isSpreadsheet = ev.filename.endsWith('.xlsx') || ev.filename.endsWith('.csv');
                    const FileIcon = isSpreadsheet ? FileSpreadsheet : FileText;
                    return (
                      <div
                        key={i}
                        className="rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
                      >
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                          <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">{ev.filename}</span>
                          <span className="ml-auto flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">{ev.pageOrSheet}</span>
                        </div>
                        {ev.cellRef && (
                          <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">{ev.cellRef}</p>
                        )}
                        {(ev.extractedValue || ev.expectedValue) && (
                          <div className="mt-2 space-y-0.5">
                            {ev.extractedValue && (
                              <p className="text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Found: </span>
                                <span className="font-medium text-red-600 dark:text-red-400">{ev.extractedValue}</span>
                              </p>
                            )}
                            {ev.expectedValue && (
                              <p className="text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Expected: </span>
                                <span className="font-medium text-green-700 dark:text-green-400">{ev.expectedValue}</span>
                              </p>
                            )}
                          </div>
                        )}
                        {ev.snippet && (
                          <div className="mt-2 rounded bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {ev.snippet}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {onEvidenceClick && (
                  <button
                    className="mt-3 flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    onClick={() => onEvidenceClick(issue)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View evidence
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
