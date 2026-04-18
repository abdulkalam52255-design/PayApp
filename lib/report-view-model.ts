import type { Report, Submission, Project, Issue } from './types';

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
}

const PREVIEW_COUNT = 3;

export function createReportViewModel(
  submission: Submission,
  project: Project | undefined,
  report: Report,
): ReportViewModel {
  const isUnlocked = submission.isUnlocked;
  const previewIssues = report.issues.slice(0, PREVIEW_COUNT);
  const lockedCount = report.issues.length - previewIssues.length;

  const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = report.issues.filter((i) => i.severity === 'warning').length;
  const infoCount = report.issues.filter((i) => i.severity === 'info').length;

  const failed = report.checklistItems.filter((i) => i.status === 'fail');
  const warnings = report.checklistItems.filter((i) => i.status === 'warning');
  const passed = report.checklistItems.filter((i) => i.status === 'pass');
  const skipped = report.checklistItems.filter((i) => i.status === 'skipped');

  return {
    isUnlocked,
    project,
    submission,
    report,
    previewIssues,
    lockedCount,
    stats: {
      critical: criticalCount,
      warning: warningCount,
      info: infoCount,
      total: report.issues.length,
      passedChecks: report.passedChecks,
      totalChecks: report.totalChecks,
    },
    checklist: {
      hasItems: report.checklistItems.length > 0,
      failed,
      warnings,
      passed,
      skipped,
    },
  };
}
