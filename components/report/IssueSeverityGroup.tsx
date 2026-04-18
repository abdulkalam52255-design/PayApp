'use client';

import { OctagonAlert, TriangleAlert, Info } from 'lucide-react';
import { IssueCard } from '@/components/shared/IssueCard';
import type { Issue, IssueSeverity } from '@/lib/types';

const SEVERITY_META: Record<IssueSeverity, {
  label: string;
  icon: React.FC<{ className?: string }>;
  iconClass: string;
  badgeClass: string;
  borderClass: string;
}> = {
  critical: {
    label: 'Critical',
    icon: OctagonAlert,
    iconClass: 'text-red-600 dark:text-red-400',
    badgeClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40',
    borderClass: 'border-red-100 dark:border-red-900/40',
  },
  warning: {
    label: 'Warning',
    icon: TriangleAlert,
    iconClass: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40',
    borderClass: 'border-slate-100 dark:border-slate-700/60',
  },
  info: {
    label: 'Info',
    icon: Info,
    iconClass: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40',
    borderClass: 'border-slate-100 dark:border-slate-700/60',
  },
  pass: {
    label: 'Passed',
    icon: Info,
    iconClass: 'text-green-600 dark:text-green-400',
    badgeClass: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40',
    borderClass: 'border-slate-100 dark:border-slate-700/60',
  },
};

interface IssueSeverityGroupProps {
  severity: IssueSeverity;
  issues: Issue[];
  onEvidenceClick?: (issue: Issue) => void;
}

export function IssueSeverityGroup({ severity, issues, onEvidenceClick }: IssueSeverityGroupProps) {
  if (issues.length === 0) return null;

  const meta = SEVERITY_META[severity];
  const Icon = meta.icon;

  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${meta.iconClass}`} />
        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${meta.badgeClass}`}>
          {meta.label}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">{issues.length} finding{issues.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-2">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onEvidenceClick={onEvidenceClick} />
        ))}
      </div>
    </div>
  );
}
