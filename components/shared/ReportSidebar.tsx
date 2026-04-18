'use client';

import { useState } from 'react';
import { OctagonAlert, TriangleAlert, Info, CircleCheck, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvidenceDrawer } from './EvidenceDrawer';
import type { Report, Issue } from '@/lib/types';

interface ReportSidebarProps {
  report: Report;
}

function getChecklistColor(pct: number) {
  if (pct >= 80) return { bar: 'bg-green-500', text: 'text-green-700 dark:text-green-400', label: 'Good' };
  if (pct >= 60) return { bar: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', label: 'Needs Review' };
  return { bar: 'bg-red-500', text: 'text-red-700 dark:text-red-400', label: 'Attention Required' };
}

export function ReportSidebar({ report }: ReportSidebarProps) {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);

  if (activeIssue) {
    return (
      <EvidenceDrawer
        issue={activeIssue}
        onClose={() => setActiveIssue(null)}
      />
    );
  }

  const critical = report.issues.filter((i) => i.severity === 'critical').length;
  const warning = report.issues.filter((i) => i.severity === 'warning').length;
  const info = report.issues.filter((i) => i.severity === 'info').length;
  const total = report.issues.length;

  const passPct = report.totalChecks > 0
    ? Math.round((report.passedChecks / report.totalChecks) * 100)
    : 0;
  const checkColor = getChecklistColor(passPct);

  const failedItems = report.checklistItems.filter((i) => i.status === 'fail');
  const warningItems = report.checklistItems.filter((i) => i.status === 'warning');
  const passedItems = report.checklistItems.filter((i) => i.status === 'pass');

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Findings
          </p>
        </div>

        <div className="px-4 py-3 space-y-2">
          {[
            {
              label: 'Critical',
              count: critical,
              icon: OctagonAlert,
              bgClass: 'bg-red-50 dark:bg-red-900/10',
              borderClass: 'border-red-100 dark:border-red-900/30',
              textClass: 'text-red-700 dark:text-red-400',
              iconClass: 'text-red-500 dark:text-red-400',
            },
            {
              label: 'Warning',
              count: warning,
              icon: TriangleAlert,
              bgClass: 'bg-amber-50 dark:bg-amber-900/10',
              borderClass: 'border-amber-100 dark:border-amber-900/30',
              textClass: 'text-amber-700 dark:text-amber-400',
              iconClass: 'text-amber-500 dark:text-amber-400',
            },
            {
              label: 'Info',
              count: info,
              icon: Info,
              bgClass: 'bg-blue-50 dark:bg-blue-900/10',
              borderClass: 'border-blue-100 dark:border-blue-900/30',
              textClass: 'text-blue-700 dark:text-blue-400',
              iconClass: 'text-blue-500 dark:text-blue-400',
            },
          ]
            .filter((row) => row.count > 0)
            .map(({ label, count, icon: Icon, bgClass, borderClass, textClass, iconClass }) => (
              <div
                key={label}
                className={cn('flex items-center gap-2.5 rounded-md border px-3 py-2', bgClass, borderClass)}
              >
                <Icon className={cn('h-3.5 w-3.5 flex-shrink-0', iconClass)} />
                <span className={cn('flex-1 text-xs font-medium', textClass)}>{label}</span>
                <span className={cn('font-semibold tabular-nums text-sm', textClass)}>{count}</span>
              </div>
            ))}
        </div>

        <div className="border-t border-slate-100 px-4 py-2.5 dark:border-slate-700/60">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {total} total finding{total !== 1 ? 's' : ''} across all severity levels
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
        <button
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
          onClick={() => setChecklistOpen(!checklistOpen)}
          aria-expanded={checklistOpen}
        >
          <ClipboardList className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Check Results</p>
            <p className={cn('text-xs font-semibold', checkColor.text)}>{passPct}% — {checkColor.label}</p>
          </div>
          {checklistOpen
            ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />}
        </button>

        <div className="px-4 pb-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className={cn('h-full rounded-full transition-all', checkColor.bar)}
              style={{ width: `${passPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {report.passedChecks} of {report.totalChecks} checks passed
          </p>
        </div>

        {checklistOpen && (
          <div className="border-t border-slate-100 dark:border-slate-700/60">
            {failedItems.length > 0 && (
              <ChecklistGroup label="Failed" items={failedItems} iconClass="text-red-500 dark:text-red-400" />
            )}
            {warningItems.length > 0 && (
              <ChecklistGroup label="Warning" items={warningItems} iconClass="text-amber-500 dark:text-amber-400" />
            )}
            {passedItems.length > 0 && (
              <ChecklistGroup label="Passed" items={passedItems} iconClass="text-green-500 dark:text-green-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChecklistGroupProps {
  label: string;
  items: Report['checklistItems'];
  iconClass: string;
}

function ChecklistGroup({ label, items, iconClass }: ChecklistGroupProps) {
  return (
    <div className="border-b border-slate-100 last:border-0 dark:border-slate-700/60">
      <div className="flex items-center justify-between bg-slate-50/60 px-4 py-1.5 dark:bg-slate-800/30">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{items.length}</span>
      </div>
      <div>
        {items.map((item) => {
          const isPass = item.status === 'pass';
          const isFail = item.status === 'fail';
          const Icon = isPass ? CircleCheck : isFail ? OctagonAlert : TriangleAlert;
          return (
            <div key={item.id} className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/20">
              <Icon className={cn('h-3 w-3 flex-shrink-0', iconClass)} />
              <p className="flex-1 truncate text-xs text-slate-600 dark:text-slate-300">{item.label}</p>
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{item.ruleCode}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
