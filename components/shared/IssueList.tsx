'use client';

import { useState } from 'react';
import type { Issue, IssueSeverity, IssueCategory } from '@/lib/types';
import { IssueCard } from './IssueCard';
import { EvidenceDrawer } from './EvidenceDrawer';
import { FiltersBar } from './FiltersBar';
import { EmptyState } from './EmptyState';
import { CircleCheck as CheckCircle2 } from 'lucide-react';

interface IssueListProps {
  issues: Issue[];
  showFilters?: boolean;
}

export function IssueList({ issues, showFilters = true }: IssueListProps) {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');

  const filtered = issues.filter((issue) => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-3">
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
        ) : (
          filtered.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onEvidenceClick={setActiveIssue}
            />
          ))
        )}
      </div>

      {activeIssue && (
        <EvidenceDrawer
          issue={activeIssue}
          onClose={() => setActiveIssue(null)}
        />
      )}
    </div>
  );
}
