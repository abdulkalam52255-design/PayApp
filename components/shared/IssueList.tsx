'use client';

import { useState } from 'react';
import type { Issue, IssueSeverity, IssueCategory } from '@/lib/types';
import { IssueCard } from './IssueCard';
import { FiltersBar } from './FiltersBar';
import { EmptyState } from './EmptyState';
import { IssueSeverityGroup } from '@/components/report/IssueSeverityGroup';
import { CircleCheck as CheckCircle2 } from 'lucide-react';

interface IssueListProps {
  issues: Issue[];
  showFilters?: boolean;
  grouped?: boolean;
  onEvidenceClick?: (issue: Issue) => void;
}

const SEVERITY_ORDER: IssueSeverity[] = ['critical', 'warning', 'info'];

export function IssueList({ issues, showFilters = true, grouped = false, onEvidenceClick }: IssueListProps) {
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');

  const filtered = issues.filter((issue) => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    return true;
  });

  const isFiltered = severityFilter !== 'all' || categoryFilter !== 'all';
  const showGrouped = grouped && !isFiltered;

  return (
    <>
      <div className="min-w-0 space-y-3">
        {showFilters && (
          <FiltersBar
            severityFilter={severityFilter}
            categoryFilter={categoryFilter}
            onSeverityChange={setSeverityFilter}
            onCategoryChange={setCategoryFilter}
            totalCount={issues.length}
            filteredCount={filtered.length}
          />
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No issues match your filters"
            description="Try adjusting the severity or category filters to see more results."
          />
        ) : showGrouped ? (
          <div className="space-y-6">
            {SEVERITY_ORDER.map((sev) => {
              const group = filtered.filter((i) => i.severity === sev);
              return (
                <IssueSeverityGroup
                  key={sev}
                  severity={sev}
                  issues={group}
                  onEvidenceClick={onEvidenceClick}
                />
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onEvidenceClick={onEvidenceClick}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
