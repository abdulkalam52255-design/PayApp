import { supabase } from '@/lib/supabase/server';
import { mapSubmission, type DbSubmission } from '@/lib/supabase/mappers';
import { MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import type { Submission } from '@/lib/types';

export interface SubmissionsViewModel {
  submissions: (Submission & { projectName: string })[];
  isLive: boolean;
}

export interface SubmissionViewModel {
  submission: Submission | null;
  projectName: string;
  isLive: boolean;
}

// ---------------------------------------------------------------------------
// Shared helper: fetch submissions with project name joined.
// ---------------------------------------------------------------------------
async function fetchSubmissions(filter?: { projectId?: string; id?: string }) {
  if (!supabase) return null;

  let query = supabase
    .from('submissions')
    .select(`
      id,
      project_id,
      period_label,
      status,
      issue_counts,
      created_at,
      updated_at,
      projects ( name ),
      reports ( status, unlocked_at )
    `)
    .order('created_at', { ascending: false });

  if (filter?.projectId) query = query.eq('project_id', filter.projectId);
  if (filter?.id) query = query.eq('id', filter.id);

  return query;
}

// ---------------------------------------------------------------------------
// All submissions list (across all projects).
// Excludes processing-only demo submissions.
// ---------------------------------------------------------------------------
export async function getSubmissionsViewModel(): Promise<SubmissionsViewModel> {
  if (!supabase) {
    const submissions = MOCK_SUBMISSIONS
      .filter((s) => s.id !== 'sub-processing')
      .map((sub) => ({
        ...sub,
        projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project',
      }));
    return { submissions, isLive: false };
  }

  try {
    const { data, error } = await fetchSubmissions() ?? { data: null, error: 'no client' };

    if (error || !data) {
      console.error('[submissions] Supabase error, falling back to mock:', (error as any)?.message ?? error);
      const submissions = MOCK_SUBMISSIONS
        .filter((s) => s.id !== 'sub-processing')
        .map((sub) => ({
          ...sub,
          projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project',
        }));
      return { submissions, isLive: false };
    }

    const submissions = (data as any[]).map((row) => {
      const report = Array.isArray(row.reports) ? row.reports[0] : row.reports;
      const dbRow: DbSubmission = {
        id: row.id,
        project_id: row.project_id,
        period_label: row.period_label,
        status: row.status,
        issue_counts: row.issue_counts,
        created_at: row.created_at,
        updated_at: row.updated_at,
        report_status: report?.status ?? null,
        unlocked_at: report?.unlocked_at ?? null,
        project_name: (row.projects as any)?.name ?? 'Unknown Project',
      };
      return {
        ...mapSubmission(dbRow),
        projectName: dbRow.project_name ?? 'Unknown Project',
      };
    });

    return { submissions, isLive: true };
  } catch (err) {
    console.error('[submissions] Unexpected error, falling back to mock:', err);
    const submissions = MOCK_SUBMISSIONS
      .filter((s) => s.id !== 'sub-processing')
      .map((sub) => ({
        ...sub,
        projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project',
      }));
    return { submissions, isLive: false };
  }
}

// ---------------------------------------------------------------------------
// Single submission detail (used by processing + report pages).
// Falls back to mock 'sub-processing' for the demo flow.
// ---------------------------------------------------------------------------
export async function getSubmissionViewModel(id: string): Promise<SubmissionViewModel> {
  if (!supabase) {
    const base = MOCK_SUBMISSIONS.find((s) => s.id === id)
      ?? MOCK_SUBMISSIONS.find((s) => s.id === 'sub-processing')!;
    const projectName = MOCK_PROJECTS.find((p) => p.id === base.projectId)?.name ?? 'Unknown Project';
    return { submission: base, projectName, isLive: false };
  }

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        id,
        project_id,
        period_label,
        status,
        issue_counts,
        created_at,
        updated_at,
        projects ( name ),
        reports ( status, unlocked_at ),
        uploaded_files ( id, filename, mime_type, storage_path, created_at,
          file_role_assignments ( detected_role, confirmed_role, confidence )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('[submission-detail] Supabase error, falling back to mock:', error?.message);
      const base = MOCK_SUBMISSIONS.find((s) => s.id === id)
        ?? MOCK_SUBMISSIONS.find((s) => s.id === 'sub-processing')!;
      const projectName = MOCK_PROJECTS.find((p) => p.id === base?.projectId)?.name ?? 'Unknown Project';
      return { submission: base ?? null, projectName, isLive: false };
    }

    const row = data as any;
    const report = Array.isArray(row.reports) ? row.reports[0] : row.reports;
    const dbRow: DbSubmission = {
      id: row.id,
      project_id: row.project_id,
      period_label: row.period_label,
      status: row.status,
      issue_counts: row.issue_counts,
      created_at: row.created_at,
      updated_at: row.updated_at,
      report_status: report?.status ?? null,
      unlocked_at: report?.unlocked_at ?? null,
      project_name: row.projects?.name ?? 'Unknown Project',
    };

    const submission = mapSubmission(dbRow);

    // Attach files with roles resolved
    submission.files = (row.uploaded_files ?? []).map((f: any) => {
      const roleAssignment = Array.isArray(f.file_role_assignments)
        ? f.file_role_assignments[0]
        : f.file_role_assignments;
      const ext = f.filename?.split('.').pop()?.toLowerCase();
      return {
        id: f.id,
        filename: f.filename,
        fileType: ext === 'xlsx' ? 'xlsx' : ext === 'csv' ? 'csv' : 'pdf',
        sizeBytes: 0,
        detectedRole: roleAssignment?.detected_role ?? 'unknown',
        roleConfidence: roleAssignment?.confidence ?? 0,
        correctedRole: roleAssignment?.confirmed_role ?? undefined,
      };
    });

    return {
      submission,
      projectName: dbRow.project_name ?? 'Unknown Project',
      isLive: true,
    };
  } catch (err) {
    console.error('[submission-detail] Unexpected error, falling back to mock:', err);
    const base = MOCK_SUBMISSIONS.find((s) => s.id === id) ?? null;
    const projectName = base
      ? MOCK_PROJECTS.find((p) => p.id === base.projectId)?.name ?? 'Unknown Project'
      : 'Unknown Project';
    return { submission: base, projectName, isLive: false };
  }
}

// ---------------------------------------------------------------------------
// Project-scoped submission list (used by project detail page).
// ---------------------------------------------------------------------------
export async function getProjectSubmissionsViewModel(projectId: string): Promise<SubmissionsViewModel> {
  if (!supabase) {
    const submissions = MOCK_SUBMISSIONS
      .filter((s) => s.projectId === projectId)
      .map((sub) => ({
        ...sub,
        projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project',
      }));
    return { submissions, isLive: false };
  }

  try {
    const { data, error } = await fetchSubmissions({ projectId }) ?? { data: null, error: 'no client' };

    if (error || !data) {
      console.error('[project-submissions] Supabase error, falling back to mock:', (error as any)?.message ?? error);
      const submissions = MOCK_SUBMISSIONS
        .filter((s) => s.projectId === projectId)
        .map((sub) => ({
          ...sub,
          projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project',
        }));
      return { submissions, isLive: false };
    }

    const submissions = (data as any[]).map((row) => {
      const report = Array.isArray(row.reports) ? row.reports[0] : row.reports;
      const dbRow: DbSubmission = {
        id: row.id,
        project_id: row.project_id,
        period_label: row.period_label,
        status: row.status,
        issue_counts: row.issue_counts,
        created_at: row.created_at,
        updated_at: row.updated_at,
        report_status: report?.status ?? null,
        unlocked_at: report?.unlocked_at ?? null,
        project_name: (row.projects as any)?.name ?? 'Unknown Project',
      };
      return {
        ...mapSubmission(dbRow),
        projectName: dbRow.project_name ?? 'Unknown Project',
      };
    });

    return { submissions, isLive: true };
  } catch (err) {
    console.error('[project-submissions] Unexpected error, falling back to mock:', err);
    const submissions = MOCK_SUBMISSIONS
      .filter((s) => s.projectId === projectId)
      .map((sub) => ({
        ...sub,
        projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project',
      }));
    return { submissions, isLive: false };
  }
}
