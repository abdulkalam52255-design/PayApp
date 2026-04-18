/**
 * Database row → domain type mappers.
 *
 * The Supabase schema uses snake_case and some different column names
 * compared to the frontend domain types in lib/types.ts. These functions
 * do the translation safely and never throw on missing fields.
 */

import type { Project, Submission, SubmissionStatus } from '@/lib/types';

// -----------------------------------------------------------------------
// Raw DB row shapes (based on infra/supabase/migrations/initial_schema.sql)
// -----------------------------------------------------------------------

export interface DbProject {
  id: string;
  name: string;
  default_retainage_rate: number | null;
  created_at: string;
  updated_at: string;
  // Joined/aggregated from submissions
  submission_count?: number;
  latest_period?: string | null;
  latest_status?: string | null;
  critical_count?: number;
  warning_count?: number;
}

export interface DbSubmission {
  id: string;
  project_id: string;
  period_label: string;
  status: string;
  issue_counts: { critical: number; warning: number; info: number } | null;
  created_at: string;
  updated_at: string;
  // Joined from reports
  report_status?: string | null;
  unlocked_at?: string | null;
  // Joined from project
  project_name?: string;
}

export interface DbFile {
  id: string;
  filename: string;
  mime_type: string;
  storage_path: string;
  created_at: string;
  // From file_role_assignments join
  detected_role?: string | null;
  confirmed_role?: string | null;
  confidence?: number | null;
}

// -----------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------

export function mapProject(row: DbProject): Project {
  return {
    id: row.id,
    name: row.name,
    owner: '',                             // not stored in projects table; populated via users_profile join if needed
    contractRef: `PRJ-${row.id.slice(0, 8).toUpperCase()}`,
    contractValue: 0,                      // not in schema; future field
    createdAt: row.created_at,
    latestPeriod: row.latest_period ?? null,
    latestStatus: (row.latest_status as SubmissionStatus) ?? null,
    criticalCount: row.critical_count ?? 0,
    warningCount: row.warning_count ?? 0,
    submissionCount: row.submission_count ?? 0,
  };
}

export function mapSubmission(row: DbSubmission): Submission {
  const counts = row.issue_counts ?? { critical: 0, warning: 0, info: 0 };
  return {
    id: row.id,
    projectId: row.project_id,
    billingPeriod: row.period_label,
    status: row.status as SubmissionStatus,
    createdAt: row.created_at,
    completedAt: row.updated_at ?? null,
    files: [],                             // loaded separately via uploaded_files when needed
    criticalCount: counts.critical,
    warningCount: counts.warning,
    infoCount: counts.info,
    isUnlocked: row.unlocked_at != null || row.report_status === 'unlocked',
    failureReason: undefined,
  };
}
