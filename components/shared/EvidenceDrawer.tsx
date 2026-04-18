'use client';

import { X, FileText, FileSpreadsheet, MapPin, ArrowRightLeft } from 'lucide-react';
import type { Issue, Evidence } from '@/lib/types';
import { SeverityBadge } from './SeverityBadge';
import { cn } from '@/lib/utils';

interface EvidenceDrawerProps {
  issue: Issue;
  onClose: () => void;
}

export function EvidenceDrawer({ issue, onClose }: EvidenceDrawerProps) {
  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="rounded-xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-[hsl(222,20%,11%)] dark:shadow-slate-900/50 lg:sticky lg:top-4">
        <div className="flex items-start justify-between border-b border-slate-100 px-4 py-3.5 dark:border-slate-700/60">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <SeverityBadge severity={issue.severity} size="sm" />
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{issue.ruleCode}</span>
            </div>
            <h3 className="mt-1.5 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
              {issue.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label="Close evidence panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Evidence References
            </p>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {issue.evidence.length}
            </span>
          </div>

          <div className="space-y-3">
            {issue.evidence.map((ev, i) => (
              <EvidenceItem key={i} evidence={ev} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceItem({ evidence: ev, index }: { evidence: Evidence; index: number }) {
  const isSpreadsheet = ev.filename.endsWith('.xlsx') || ev.filename.endsWith('.csv');
  const FileIcon = isSpreadsheet ? FileSpreadsheet : FileText;
  const hasDiscrepancy = ev.extractedValue && ev.expectedValue;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-700/60 dark:bg-slate-800/50">
        <FileIcon
          className={cn(
            'h-3.5 w-3.5 flex-shrink-0',
            isSpreadsheet ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'
          )}
        />
        <span className="min-w-0 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
          {ev.filename}
        </span>
        <span className="ml-auto flex-shrink-0 rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
          #{index + 1}
        </span>
      </div>

      <div className="space-y-2 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 flex-shrink-0 text-slate-300 dark:text-slate-600" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{ev.pageOrSheet}</span>
          {ev.cellRef && (
            <span className="ml-1 font-mono text-xs text-slate-500 dark:text-slate-400">{ev.cellRef}</span>
          )}
        </div>

        {hasDiscrepancy && (
          <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-700/40 dark:bg-slate-800/40">
            <div className="mb-2 flex items-center gap-1.5">
              <ArrowRightLeft className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Discrepancy
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-xs">
                <span className="w-16 flex-shrink-0 text-slate-400 dark:text-slate-500">Found</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{ev.extractedValue}</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="w-16 flex-shrink-0 text-slate-400 dark:text-slate-500">Expected</span>
                <span className="font-semibold text-green-700 dark:text-green-400">{ev.expectedValue}</span>
              </div>
            </div>
          </div>
        )}

        {!hasDiscrepancy && ev.extractedValue && (
          <div className="flex items-start gap-2 text-xs">
            <span className="w-16 flex-shrink-0 text-slate-400 dark:text-slate-500">Value</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{ev.extractedValue}</span>
          </div>
        )}

        {ev.snippet && (
          <div className="rounded-md bg-slate-100 px-2.5 py-2 dark:bg-slate-800">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Source text
            </p>
            <p className="font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-400">{ev.snippet}</p>
          </div>
        )}
      </div>
    </div>
  );
}
