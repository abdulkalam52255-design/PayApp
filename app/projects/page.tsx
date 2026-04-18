import Link from 'next/link';
import { Plus, FolderKanban } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { getProjectsViewModel } from '@/lib/view-models/projects';

export default async function ProjectsPage() {
  const vm = await getProjectsViewModel();
  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {vm.projects.length} active project{vm.projects.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        <div className="mt-6">
          {vm.projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create a project to organize your pay-app submissions. Each project corresponds to a single construction contract."
              action={
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Create Your First Project
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {vm.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
