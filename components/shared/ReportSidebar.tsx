'use client';

import { useState } from 'react';
import { OctagonAlert, TriangleAlert, Info, CircleCheck } from 'lucide-react';
import { EvidenceDrawer } from './EvidenceDrawer';
import type { Report, Issue } from '@/lib/types';

interface ReportSidebarProps {
  report: Report;
}

export function ReportSidebar({ report }: ReportSidebarProps) {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const critical = report.issues.filter((i) => i.severity === 'critical').length;
  const warning = report.issues.filter((i) => i.severity === 'warning').length;
  const info = report.issues.filter((i) => i.severity === 'info').length;

  const summaryRows = [
    { label: 'Critical', value: critical, icon: OctagonAlert, color: 'text-red-600 dark:text-red-400' },
    { label: 'Warnings', value: warning, icon: TriangleAlert, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Info', value: info, icon: Info, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Checks Passed', value: `${report.passedChecks}/${report.totalChecks}`, icon: CircleCheck, color: 'text-green-600 dark:text-green-400' },
  ];

  if (activeIssue) {
    return (
      <EvidenceDrawer
        issue={activeIssue}
        onClose={() => setActiveIssue(null)}
      />
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[hsl(222,20%,11%)]">
      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700/60">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Report Summary
        </p>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
        {summaryRows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-center gap-3 px-4 py-2.5">
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${row.color}`} />
              <span className="flex-1 text-xs text-slate-500 dark:text-slate-400">{row.label}</span>
              <span className={`text-xs font-semibold tabular-nums ${row.color}`}>{row.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
