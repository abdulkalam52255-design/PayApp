'use client';

import { useState } from 'react';
import { Lock, CircleCheck as CheckCircle2, ArrowRight, Loader as Loader2 } from 'lucide-react';

interface PaywallCardProps {
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  onUnlock?: () => void;
}

export function PaywallCard({ criticalCount, warningCount, infoCount, onUnlock }: PaywallCardProps) {
  const [loading, setLoading] = useState(false);

  const handleUnlock = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onUnlock?.();
    }, 1500);
  };

  const totalIssues = criticalCount + warningCount + infoCount;

  return (
    <div className="sticky top-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] shadow-sm">
      <div className="rounded-t-xl border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Full Report Locked</p>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {totalIssues} findings detected. Preview shows 3 of {totalIssues}.
        </p>
      </div>

      <div className="p-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Critical</span>
            <span className="font-semibold text-red-700 dark:text-red-400">{criticalCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Warnings</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">{warningCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Info</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">{infoCount}</span>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700 pt-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Total findings</span>
              <span className="text-slate-900 dark:text-slate-100">{totalIssues}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-blue-600 px-4 py-3">
          <p className="text-lg font-bold text-white">$39</p>
          <p className="text-xs text-blue-200">one-time unlock · this project-month</p>
        </div>

        <button
          onClick={handleUnlock}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Unlock Full Report
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="mt-4 space-y-2">
          {[
            'All findings with rule codes',
            'Evidence links to source files',
            'Suggested fixes for each issue',
            'Full checklist status (27 checks)',
            'Downloadable PDF report',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500 dark:text-green-400" />
              <p className="text-xs text-slate-600 dark:text-slate-400">{item}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Or subscribe for $99/mo — up to 10 unlocks/month
        </p>
      </div>
    </div>
  );
}
