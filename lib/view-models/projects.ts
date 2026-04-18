import { MOCK_PROJECTS } from '@/lib/mock-data';
import type { Project } from '@/lib/types';

export interface ProjectsViewModel {
  projects: Project[];
}

export async function getProjectsViewModel(): Promise<ProjectsViewModel> {
  return {
    projects: MOCK_PROJECTS,
  };
}

export interface ProjectViewModel {
  project: Project | null;
}

export async function getProjectViewModel(id: string): Promise<ProjectViewModel> {
  return {
    project: MOCK_PROJECTS.find((p) => p.id === id) || null,
  };
}
