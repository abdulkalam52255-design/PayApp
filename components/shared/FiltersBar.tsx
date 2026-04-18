'use client';

import type { IssueSeverity, IssueCategory } from '@/lib/types';

interface FiltersBarProps {
  severityFilter: IssueSeverity | 'all';
  categoryFilter: IssueCategory | 'all';
  onSeverityChange: (v: IssueSeverity | 'all') => void;
  onCategoryChange: (v: IssueCategory | 'all') => void;
  totalCount: number;
  filteredCount: number;
}

const SEVERITY_OPTIONS: { value: IssueSeverity | 'all'; label: string }[] = [
  { value: 'all', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

const CATEGORY_OPTIONS: { value: IssueCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'math_mismatch', label: 'Math Mismatch' },
  { value: 'retainage_drift', label: 'Retainage' },
  { value: 'continuity', label: 'Continuity' },
  { value: 'missing_waiver', label: 'Waivers' },
  { value: 'missing_backup', label: 'Backup Docs' },
  { value: 'change_order', label: 'Change Orders' },
];

export function FiltersBar({
  severityFilter,
  categoryFilter,
  onSeverityChange,
  onCategoryChange,
  totalCount,
  filteredCount,
}: FiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={severityFilter}
        onChange={(e) => onSeverityChange(e.target.value as IssueSeverity | 'all')}
        className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 pl-3 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {SEVERITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value as IssueCategory | 'all')}
        className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 pl-3 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="text-xs text-slate-500 dark:text-slate-400">
        Showing {filteredCount} of {totalCount} issue{totalCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
