export type SubmissionStatus =
  | 'draft'
  | 'uploading'
  | 'queued'
  | 'classifying'
  | 'parsing'
  | 'extracting'
  | 'validating'
  | 'preview_ready'
  | 'report_ready'
  | 'failed'
  | 'unsupported';

export type IssueSeverity = 'critical' | 'warning' | 'info' | 'pass';

export type IssueCategory =
  | 'math_mismatch'
  | 'retainage_drift'
  | 'continuity'
  | 'missing_waiver'
  | 'missing_backup'
  | 'change_order';

export type DocumentRole =
  | 'g702_cover'
  | 'g703_schedule'
  | 'change_order_log'
  | 'waiver_conditional'
  | 'waiver_unconditional'
  | 'stored_material_backup'
  | 'schedule_of_values'
  | 'unknown';

export interface Project {
  id: string;
  name: string;
  owner: string;
  contractRef: string;
  contractValue: number;
  createdAt: string;
  latestPeriod: string | null;
  latestStatus: SubmissionStatus | null;
  criticalCount: number;
  warningCount: number;
  submissionCount: number;
}

export interface UploadedFile {
  id: string;
  filename: string;
  fileType: 'pdf' | 'xlsx' | 'csv';
  sizeBytes: number;
  detectedRole: DocumentRole;
  roleConfidence: number;
  correctedRole?: DocumentRole;
}

export interface Submission {
  id: string;
  projectId: string;
  billingPeriod: string;
  status: SubmissionStatus;
  createdAt: string;
  completedAt: string | null;
  files: UploadedFile[];
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  isUnlocked: boolean;
  failureReason?: string;
}

export interface Evidence {
  fileId: string;
  filename: string;
  pageOrSheet: string;
  cellRef?: string;
  extractedValue?: string;
  expectedValue?: string;
  snippet?: string;
}

export interface Issue {
  id: string;
  ruleCode: string;
  title: string;
  severity: IssueSeverity;
  category: IssueCategory;
  explanation: string;
  suggestedFix: string;
  evidence: Evidence[];
}

export interface Report {
  id: string;
  submissionId: string;
  generatedAt: string;
  issues: Issue[];
  checklistItems: ChecklistItem[];
  passedChecks: number;
  totalChecks: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'skipped';
  ruleCode: string;
}

export interface BillingTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'charge' | 'refund';
  invoiceUrl?: string;
}
