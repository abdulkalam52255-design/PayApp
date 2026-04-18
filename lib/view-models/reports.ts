import { createClientServer } from '@/lib/supabase/server';
import { MOCK_FULL_REPORT, MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import type { Report, Submission, Project, Issue } from '@/lib/types';
import { mapSubmission } from '@/lib/supabase/mappers';

export interface ReportViewModel {
  isUnlocked: boolean;
  project: Project | undefined;
  submission: Submission;
  report: Report;
  previewIssues: Issue[];
  lockedCount: number;
  stats: {
    critical: number;
    warning: number;
    info: number;
    total: number;
    passedChecks: number;
    totalChecks: number;
  };
  checklist: {
    hasItems: boolean;
    failed: Report['checklistItems'];
    warnings: Report['checklistItems'];
    passed: Report['checklistItems'];
    skipped: Report['checklistItems'];
  };
  isLive: boolean;
}

const PREVIEW_COUNT = 3;

function getMockReport(submissionId: string): ReportViewModel {
  const submission = MOCK_SUBMISSIONS.find((s) => s.id === submissionId) ?? MOCK_SUBMISSIONS[0];
  const project = MOCK_PROJECTS.find((p) => p.id === submission.projectId);
  const report = MOCK_FULL_REPORT;

  const isUnlocked = submission.isUnlocked;
  const previewIssues = report.issues.slice(0, PREVIEW_COUNT);
  const lockedCount = Math.max(0, report.issues.length - previewIssues.length);

  return {
    isUnlocked,
    project,
    submission,
    report,
    previewIssues,
    lockedCount,
    stats: {
      critical: report.issues.filter((i) => i.severity === 'critical').length,
      warning: report.issues.filter((i) => i.severity === 'warning').length,
      info: report.issues.filter((i) => i.severity === 'info').length,
      total: report.issues.length,
      passedChecks: report.passedChecks,
      totalChecks: report.totalChecks,
    },
    checklist: {
      hasItems: report.checklistItems.length > 0,
      failed: report.checklistItems.filter((i) => i.status === 'fail'),
      warnings: report.checklistItems.filter((i) => i.status === 'warning'),
      passed: report.checklistItems.filter((i) => i.status === 'pass'),
      skipped: report.checklistItems.filter((i) => i.status === 'skipped'),
    },
    isLive: false,
  };
}

export async function getReportViewModel(submissionId: string): Promise<ReportViewModel> {
  const supabase = createClientServer();
  if (!supabase) return getMockReport(submissionId);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getMockReport(submissionId); // In a strict app, this should throw/redirect

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
        projects ( name, id, default_retainage_rate, created_at, updated_at ),
        reports ( preview_json, full_report_json, status, unlocked_at )
      `)
      .eq('id', submissionId)
      .single();

    if (error || !data) {
      console.error('[report-view-model] Failed to load report:', error?.message);
      return getMockReport(submissionId);
    }

    const row = data as any;
    const reportData = Array.isArray(row.reports) ? row.reports[0] : row.reports;
    
    // GATING: Enforce unlocked_at check
    const isUnlocked = reportData?.status === 'unlocked' || reportData?.unlocked_at != null;

    // Load payload strictly based on access level
    let parsedReport: Report;
    if (isUnlocked && reportData?.full_report_json) {
      parsedReport = typeof reportData.full_report_json === 'string' 
        ? JSON.parse(reportData.full_report_json) 
        : reportData.full_report_json;
    } else if (reportData?.preview_json) {
      parsedReport = typeof reportData.preview_json === 'string' 
        ? JSON.parse(reportData.preview_json) 
        : reportData.preview_json;
    } else {
      // Fallback empty schema if neither exists yet
      parsedReport = {
        id: 'rep-fallback',
        submissionId,
        generatedAt: new Date().toISOString(),
        issues: [],
        checklistItems: [],
        passedChecks: 0,
        totalChecks: 0,
      };
    }

    const submission = mapSubmission({
      id: row.id,
      project_id: row.project_id,
      period_label: row.period_label,
      status: row.status,
      issue_counts: row.issue_counts,
      created_at: row.created_at,
      updated_at: row.updated_at,
      report_status: reportData?.status,
      unlocked_at: reportData?.unlocked_at,
    });

    const project: Project = {
      id: row.projects?.id ?? row.project_id,
      name: row.projects?.name ?? 'Unknown',
      owner: '',
      contractRef: `PRJ-${(row.projects?.id ?? row.project_id).slice(0, 8).toUpperCase()}`,
      contractValue: 0,
      createdAt: row.projects?.created_at ?? row.created_at,
      latestPeriod: row.period_label,
      latestStatus: row.status,
      criticalCount: 0,
      warningCount: 0,
      submissionCount: 0,
    };

    const previewIssues = parsedReport.issues.slice(0, PREVIEW_COUNT);
    // If locked, we don't know the exact lockedCount from the preview array alone, we derive it from issue_counts
    // Or if preview payload includes total counts, we can use that.
    const totalIssuesDerived = (row.issue_counts?.critical ?? 0) + (row.issue_counts?.warning ?? 0) + (row.issue_counts?.info ?? 0);
    const lockedCount = Math.max(0, totalIssuesDerived - previewIssues.length);

    return {
      isUnlocked,
      project,
      submission,
      report: parsedReport,
      previewIssues,
      lockedCount,
      stats: {
        critical: row.issue_counts?.critical ?? 0,
        warning: row.issue_counts?.warning ?? 0,
        info: row.issue_counts?.info ?? 0,
        total: totalIssuesDerived,
        passedChecks: parsedReport.passedChecks ?? 0,
        totalChecks: parsedReport.totalChecks ?? 0,
      },
      checklist: {
        hasItems: parsedReport.checklistItems?.length > 0,
        failed: parsedReport.checklistItems?.filter((i: any) => i.status === 'fail') ?? [],
        warnings: parsedReport.checklistItems?.filter((i: any) => i.status === 'warning') ?? [],
        passed: parsedReport.checklistItems?.filter((i: any) => i.status === 'pass') ?? [],
        skipped: parsedReport.checklistItems?.filter((i: any) => i.status === 'skipped') ?? [],
      },
      isLive: true,
    };
  } catch (err) {
    console.error('[report-view-model] Unexpected error:', err);
    return getMockReport(submissionId);
  }
}
