import { supabase } from '@/lib/supabase/server';
import { mapProject, type DbProject } from '@/lib/supabase/mappers';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import type { Project } from '@/lib/types';

export interface ProjectsViewModel {
  projects: Project[];
  isLive: boolean;
}

export interface ProjectViewModel {
  project: Project | null;
  isLive: boolean;
}

// ---------------------------------------------------------------------------
// List all projects for the authenticated user.
// Falls back to mock data when supabase client is unavailable (LOCAL_DEV_MODE).
// ---------------------------------------------------------------------------
export async function getProjectsViewModel(): Promise<ProjectsViewModel> {
  if (!supabase) {
    return { projects: MOCK_PROJECTS, isLive: false };
  }

  try {
    // Aggregate submission stats per project in a single query using a subselect.
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        default_retainage_rate,
        created_at,
        updated_at,
        submissions (
          id,
          period_label,
          status,
          issue_counts,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('[projects] Supabase error, falling back to mock:', error?.message);
      return { projects: MOCK_PROJECTS, isLive: false };
    }

    const projects: Project[] = data.map((row: any) => {
      const subs: any[] = row.submissions ?? [];
      const latestSub = subs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      const totalCritical = subs.reduce((acc: number, s: any) => acc + (s.issue_counts?.critical ?? 0), 0);
      const totalWarning = subs.reduce((acc: number, s: any) => acc + (s.issue_counts?.warning ?? 0), 0);

      const dbRow: DbProject = {
        id: row.id,
        name: row.name,
        default_retainage_rate: row.default_retainage_rate,
        created_at: row.created_at,
        updated_at: row.updated_at,
        submission_count: subs.length,
        latest_period: latestSub?.period_label ?? null,
        latest_status: latestSub?.status ?? null,
        critical_count: totalCritical,
        warning_count: totalWarning,
      };

      return mapProject(dbRow);
    });

    return { projects, isLive: true };
  } catch (err) {
    console.error('[projects] Unexpected error, falling back to mock:', err);
    return { projects: MOCK_PROJECTS, isLive: false };
  }
}

// ---------------------------------------------------------------------------
// Single project detail loader.
// ---------------------------------------------------------------------------
export async function getProjectViewModel(id: string): Promise<ProjectViewModel> {
  if (!supabase) {
    return {
      project: MOCK_PROJECTS.find((p) => p.id === id) ?? MOCK_PROJECTS[0],
      isLive: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        default_retainage_rate,
        created_at,
        updated_at,
        submissions (
          id,
          period_label,
          status,
          issue_counts,
          created_at
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('[project-detail] Supabase error, falling back to mock:', error?.message);
      return {
        project: MOCK_PROJECTS.find((p) => p.id === id) ?? null,
        isLive: false,
      };
    }

    const subs: any[] = (data as any).submissions ?? [];
    const latestSub = subs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    const totalCritical = subs.reduce((acc: number, s: any) => acc + (s.issue_counts?.critical ?? 0), 0);
    const totalWarning = subs.reduce((acc: number, s: any) => acc + (s.issue_counts?.warning ?? 0), 0);

    const dbRow: DbProject = {
      id: data.id,
      name: data.name,
      default_retainage_rate: data.default_retainage_rate,
      created_at: data.created_at,
      updated_at: data.updated_at,
      submission_count: subs.length,
      latest_period: latestSub?.period_label ?? null,
      latest_status: latestSub?.status ?? null,
      critical_count: totalCritical,
      warning_count: totalWarning,
    };

    return { project: mapProject(dbRow), isLive: true };
  } catch (err) {
    console.error('[project-detail] Unexpected error, falling back to mock:', err);
    return { project: MOCK_PROJECTS.find((p) => p.id === id) ?? null, isLive: false };
  }
}
