'use client';

import { CreditCard, CircleCheck as CheckCircle2, ArrowRight, Download } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PricingCards } from '@/components/shared/PricingCards';
import { MOCK_BILLING_TRANSACTIONS } from '@/lib/mock-data';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BillingPage() {
  const totalSpent = MOCK_BILLING_TRANSACTIONS.filter(t => t.type === 'charge').reduce((acc, t) => acc + t.amount, 0);

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Billing</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Manage your plan and payment history</p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/20 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Current Plan</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">Pro Monthly</h2>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">$99/month · Up to 10 report unlocks</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20 px-2.5 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">Unlocks used this month</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">7 of 10</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <div className="h-full w-[70%] rounded-full bg-blue-600" />
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Resets on May 1, 2025</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Manage Plan
                </button>
                <button className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Update Payment Method
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Billing History</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(totalSpent)} total · last 90 days
                </p>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Amount</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {MOCK_BILLING_TRANSACTIONS.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{formatDate(txn.date)}</td>
                        <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">{txn.description}</td>
                        <td className="px-4 py-3 text-right text-xs font-medium tabular-nums">
                          <span className={txn.type === 'refund' ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'}>
                            {txn.type === 'refund' ? '-' : ''}{formatCurrency(txn.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pay As You Go</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Need a one-time unlock outside your plan?
              </p>
              <div className="mt-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">$39</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">per project-month unlock</p>
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                Unlock a Report
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Payment Method</h2>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex h-8 w-12 items-center justify-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  VISA
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Visa ending in 4242</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Expires 08/27</p>
                </div>
              </div>
              <button className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Update card
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Compare Plans</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Switch plans or manage your subscription at any time.</p>
          <div className="mt-4">
            <PricingCards variant="billing" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
