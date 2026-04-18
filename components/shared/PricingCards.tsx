import { CircleCheck as CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PricingCardsProps {
  variant?: 'landing' | 'billing';
}

export function PricingCards({ variant = 'landing' }: PricingCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Pay As You Go
        </p>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">$39</span>
          <span className="mb-1 text-sm text-slate-500 dark:text-slate-400">/project-month</span>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          One-time unlock for a single project's billing period. Pay only when you need a report.
        </p>

        <div className="mt-5 space-y-2.5">
          {[
            'Full exception report for one submission',
            'All rule findings with evidence links',
            'Suggested fixes for each issue',
            'Downloadable PDF report',
            'Valid for 90 days',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
            </div>
          ))}
        </div>

        <Link
          href="/submissions/new"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          Upload a Package
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative rounded-xl border-2 border-blue-600 bg-white dark:bg-[hsl(222,20%,11%)] p-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            Best Value
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Monthly Subscription
        </p>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">$99</span>
          <span className="mb-1 text-sm text-slate-500 dark:text-slate-400">/month</span>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Up to 10 report unlocks per month across any projects in your workspace.
        </p>

        <div className="mt-5 space-y-2.5">
          {[
            '10 report unlocks per month',
            'All Pay-As-You-Go features',
            'Submission history & audit trail',
            'Priority processing queue',
            'Email notification on completion',
            'Cancel anytime',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
            </div>
          ))}
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Start Subscription
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
