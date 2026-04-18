import Link from 'next/link';
import { Building2, OctagonAlert as AlertOctagon, TriangleAlert as AlertTriangle, ArrowRight, FileStack } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-800 dark:bg-[hsl(222,20%,11%)] dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold leading-snug text-slate-900 dark:text-slate-100">{project.name}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{project.owner}</p>
            <p className="mt-0.5 font-mono text-xs text-slate-400 dark:text-slate-500">{project.contractRef}</p>
          </div>
        </div>
        {project.latestStatus && (
          <StatusBadge status={project.latestStatus} className="flex-shrink-0" />
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Contract Value</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(project.contractValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Latest Period</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {project.latestPeriod ?? '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Submissions</p>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <FileStack className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            {project.submissionCount}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {project.criticalCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
              <AlertOctagon className="h-3.5 w-3.5" />
              {project.criticalCount} critical
            </span>
          )}
          {project.warningCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {project.warningCount} warnings
            </span>
          )}
          {project.criticalCount === 0 && project.warningCount === 0 && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400">No open issues</span>
          )}
        </div>
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Open project
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
