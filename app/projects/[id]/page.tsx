import Link from 'next/link';
import { Building2, Plus, OctagonAlert as AlertOctagon, TriangleAlert as AlertTriangle, GitMerge, TrendingDown, ArrowLeft } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SubmissionTable } from '@/components/shared/SubmissionTable';
import { StatsCard } from '@/components/shared/StatsCard';
import { getProjectViewModel } from '@/lib/view-models/projects';
import { getProjectSubmissionsViewModel } from '@/lib/view-models/submissions';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projectId = params.id;
  const projectVm = await getProjectViewModel(projectId);
  const submissionsVm = await getProjectSubmissionsViewModel(projectId);
  
  const project = projectVm.project!;
  const submissions = submissionsVm.submissions;

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Projects
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 flex-shrink-0">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h1>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{project.owner}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{project.contractRef}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Contract: {formatCurrency(project.contractValue)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {project.latestStatus && <StatusBadge status={project.latestStatus} />}
              <Link
                href="/submissions/new"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Submission</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Total Submissions"
            value={project.submissionCount}
            icon={GitMerge}
            accent="blue"
          />
          <StatsCard
            label="Critical Issues"
            value={project.criticalCount}
            icon={AlertOctagon}
            accent={project.criticalCount > 0 ? 'red' : 'default'}
          />
          <StatsCard
            label="Warnings"
            value={project.warningCount}
            icon={AlertTriangle}
            accent={project.warningCount > 0 ? 'amber' : 'default'}
          />
          <StatsCard
            label="Retainage Flags"
            value={1}
            icon={TrendingDown}
            accent="amber"
          />
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Submission History</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <SubmissionTable submissions={submissions} projectId={project.id} />
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Project Details</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Contract Reference', value: project.contractRef },
              { label: 'Contract Value', value: formatCurrency(project.contractValue) },
              { label: 'Owner / GC', value: project.owner },
              { label: 'Latest Period', value: project.latestPeriod ?? 'None' },
              { label: 'Total Submissions', value: String(project.submissionCount) },
              { label: 'Project Created', value: new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
