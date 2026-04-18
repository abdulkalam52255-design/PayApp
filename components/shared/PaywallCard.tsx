'use client';

import { useState } from 'react';
import { Lock, CircleCheck, ArrowRight, Loader, OctagonAlert, TriangleAlert, Info } from 'lucide-react';

interface PaywallCardProps {
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  onUnlock?: () => void;
}

const UNLOCK_FEATURES = [
  'All findings with rule codes and explanations',
  'Evidence links to source files and cells',
  'Suggested fix for each issue',
  'Full 27-check status breakdown',
  'Downloadable PDF report',
];

export function PaywallCard({ criticalCount, warningCount, infoCount, onUnlock }: PaywallCardProps) {
  const [loading, setLoading] = useState(false);
  const totalIssues = criticalCount + warningCount + infoCount;

  const handleUnlock = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onUnlock?.();
    }, 1500);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 dark:border-slate-700/60 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <Lock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Full Report Locked</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Preview shows 3 of {totalIssues} findings</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Detected
        </p>
        <div className="space-y-2">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2.5 rounded-md border border-red-100 bg-red-50 px-3 py-2 dark:border-red-900/40 dark:bg-red-900/10">
              <OctagonAlert className="h-3.5 w-3.5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <span className="flex-1 text-xs text-red-700 dark:text-red-400">Critical issues</span>
              <span className="font-semibold tabular-nums text-red-700 dark:text-red-400">{criticalCount}</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-2.5 rounded-md border border-amber-100 bg-amber-50 px-3 py-2 dark:border-amber-900/40 dark:bg-amber-900/10">
              <TriangleAlert className="h-3.5 w-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="flex-1 text-xs text-amber-700 dark:text-amber-400">Warnings</span>
              <span className="font-semibold tabular-nums text-amber-700 dark:text-amber-400">{warningCount}</span>
            </div>
          )}
          {infoCount > 0 && (
            <div className="flex items-center gap-2.5 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 dark:border-blue-900/40 dark:bg-blue-900/10">
              <Info className="h-3.5 w-3.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="flex-1 text-xs text-blue-700 dark:text-blue-400">Informational</span>
              <span className="font-semibold tabular-nums text-blue-700 dark:text-blue-400">{infoCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 pb-4 pt-3.5 dark:border-slate-700/60">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">One-time unlock</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">$39</p>
          </div>
          <p className="pb-1 text-xs text-slate-400 dark:text-slate-500">this project-month</p>
        </div>

        <button
          onClick={handleUnlock}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
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
          {UNLOCK_FEATURES.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <CircleCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500 dark:text-green-400" />
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700/60">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Or subscribe for{' '}
            <span className="font-semibold text-slate-600 dark:text-slate-300">$99/mo</span>
            {' '}— up to 10 unlocks/month
          </p>
        </div>
      </div>
    </div>
  );
}
