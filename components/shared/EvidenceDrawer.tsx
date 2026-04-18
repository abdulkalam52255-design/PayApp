'use client';

import { X, FileText, FileSpreadsheet, Hash, AlignLeft } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { SeverityBadge } from './SeverityBadge';

interface EvidenceDrawerProps {
  issue: Issue;
  onClose: () => void;
}

export function EvidenceDrawer({ issue, onClose }: EvidenceDrawerProps) {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="sticky top-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] shadow-lg dark:shadow-slate-900/50">
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 p-4">
          <div>
            <div className="flex items-center gap-2">
              <SeverityBadge severity={issue.severity} size="sm" />
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{issue.ruleCode}</span>
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
              {issue.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-2 flex-shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Evidence References
          </p>

          <div className="mt-3 space-y-4">
            {issue.evidence.map((ev, i) => {
              const isSpreadsheet = ev.filename.endsWith('.xlsx') || ev.filename.endsWith('.csv');
              const Icon = isSpreadsheet ? FileSpreadsheet : FileText;
              return (
                <div key={i} className="rounded-md border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {ev.filename}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-start gap-2">
                      <Hash className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-300 dark:text-slate-600" />
                      <div className="text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Location: </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{ev.pageOrSheet}</span>
                        {ev.cellRef && (
                          <span className="font-mono text-slate-500 dark:text-slate-400"> · {ev.cellRef}</span>
                        )}
                      </div>
                    </div>

                    {ev.extractedValue && (
                      <div className="rounded bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5">
                        <p className="text-xs text-red-600 dark:text-red-400">
                          <span className="font-medium">Found:</span> {ev.extractedValue}
                        </p>
                        {ev.expectedValue && (
                          <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                            <span className="font-medium">Expected:</span> {ev.expectedValue}
                          </p>
                        )}
                      </div>
                    )}

                    {ev.snippet && (
                      <div className="flex items-start gap-2">
                        <AlignLeft className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-300 dark:text-slate-600" />
                        <div className="rounded bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                          {ev.snippet}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
