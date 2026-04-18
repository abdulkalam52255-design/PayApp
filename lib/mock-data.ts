import type {
  Project,
  Submission,
  Report,
  BillingTransaction,
  Issue,
  ChecklistItem,
} from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Riverside Medical Center – Phase 2',
    owner: 'Riverside Health Systems LLC',
    contractRef: 'AIA-2024-RSH-P2',
    contractValue: 4_850_000,
    createdAt: '2024-09-01T00:00:00Z',
    latestPeriod: 'March 2025',
    latestStatus: 'report_ready',
    criticalCount: 2,
    warningCount: 5,
    submissionCount: 7,
  },
  {
    id: 'proj-002',
    name: 'Harborview Office Complex',
    owner: 'Coastal Development Partners',
    contractRef: 'AIA-2024-CDP-HOC',
    contractValue: 2_100_000,
    createdAt: '2024-11-15T00:00:00Z',
    latestPeriod: 'March 2025',
    latestStatus: 'preview_ready',
    criticalCount: 1,
    warningCount: 3,
    submissionCount: 4,
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-001',
    projectId: 'proj-001',
    billingPeriod: 'March 2025',
    status: 'report_ready',
    createdAt: '2025-03-28T09:14:00Z',
    completedAt: '2025-03-28T09:17:33Z',
    isUnlocked: true,
    criticalCount: 2,
    warningCount: 5,
    infoCount: 3,
    files: [
      {
        id: 'f-001',
        filename: 'G702_March2025_RSH_P2.pdf',
        fileType: 'pdf',
        sizeBytes: 284_512,
        detectedRole: 'g702_cover',
        roleConfidence: 0.97,
      },
      {
        id: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        fileType: 'pdf',
        sizeBytes: 512_088,
        detectedRole: 'g703_schedule',
        roleConfidence: 0.95,
      },
      {
        id: 'f-003',
        filename: 'COLog_March2025.xlsx',
        fileType: 'xlsx',
        sizeBytes: 98_304,
        detectedRole: 'change_order_log',
        roleConfidence: 0.91,
      },
      {
        id: 'f-004',
        filename: 'ConditionalWaiver_March2025.pdf',
        fileType: 'pdf',
        sizeBytes: 145_920,
        detectedRole: 'waiver_conditional',
        roleConfidence: 0.88,
      },
    ],
  },
  {
    id: 'sub-002',
    projectId: 'proj-002',
    billingPeriod: 'March 2025',
    status: 'preview_ready',
    createdAt: '2025-03-29T14:02:00Z',
    completedAt: '2025-03-29T14:05:11Z',
    isUnlocked: false,
    criticalCount: 1,
    warningCount: 3,
    infoCount: 2,
    files: [
      {
        id: 'f-010',
        filename: 'PayApp_HOC_Mar2025.pdf',
        fileType: 'pdf',
        sizeBytes: 390_144,
        detectedRole: 'g702_cover',
        roleConfidence: 0.94,
      },
      {
        id: 'f-011',
        filename: 'SOV_Export_March.xlsx',
        fileType: 'xlsx',
        sizeBytes: 210_944,
        detectedRole: 'g703_schedule',
        roleConfidence: 0.89,
      },
    ],
  },
  {
    id: 'sub-003',
    projectId: 'proj-001',
    billingPeriod: 'February 2025',
    status: 'failed',
    createdAt: '2025-02-27T10:44:00Z',
    completedAt: '2025-02-27T10:45:58Z',
    isUnlocked: false,
    criticalCount: 0,
    warningCount: 0,
    infoCount: 0,
    failureReason:
      'Uploaded PDF appears to be a scanned/image-only document. Embedded-text extraction returned zero text tokens. Please export a text-based PDF or XLSX from your pay-app software.',
    files: [
      {
        id: 'f-020',
        filename: 'Scanned_PayApp_Feb2025.pdf',
        fileType: 'pdf',
        sizeBytes: 1_843_200,
        detectedRole: 'unknown',
        roleConfidence: 0.12,
      },
    ],
  },
  {
    id: 'sub-004',
    projectId: 'proj-001',
    billingPeriod: 'January 2025',
    status: 'report_ready',
    createdAt: '2025-01-29T11:30:00Z',
    completedAt: '2025-01-29T11:34:00Z',
    isUnlocked: true,
    criticalCount: 0,
    warningCount: 2,
    infoCount: 4,
    files: [],
  },
  {
    id: 'sub-processing',
    projectId: 'proj-002',
    billingPeriod: 'April 2025',
    status: 'validating',
    createdAt: '2025-04-01T08:00:00Z',
    completedAt: null,
    isUnlocked: false,
    criticalCount: 0,
    warningCount: 0,
    infoCount: 0,
    files: [],
  },
];

const FULL_ISSUES: Issue[] = [
  {
    id: 'iss-001',
    ruleCode: 'MATH-001',
    title: 'G702 Scheduled Value Does Not Match G703 Column A Total',
    severity: 'critical',
    category: 'math_mismatch',
    explanation:
      'The Scheduled Value on the G702 cover sheet ($4,850,000.00) does not match the sum of Column A values on the G703 Schedule of Values ($4,827,500.00). This $22,500.00 discrepancy will cause the application to fail the owner\'s review.',
    suggestedFix:
      'Reconcile the G703 Column A totals against the G702 cover. Verify that all line items are present in the schedule and that no items were accidentally deleted or duplicated in the XLSX export.',
    evidence: [
      {
        fileId: 'f-001',
        filename: 'G702_March2025_RSH_P2.pdf',
        pageOrSheet: 'Page 1',
        cellRef: 'Line 3 – Scheduled Value',
        extractedValue: '$4,850,000.00',
        expectedValue: '$4,827,500.00',
        snippet: 'Contract Sum to Date: $4,850,000.00',
      },
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 1',
        cellRef: 'Column A – Total Row',
        extractedValue: '$4,827,500.00',
        snippet: 'TOTAL SCHEDULED VALUE: $4,827,500.00',
      },
    ],
  },
  {
    id: 'iss-002',
    ruleCode: 'RET-002',
    title: 'Retainage Rate Drift from Prior Period',
    severity: 'critical',
    category: 'retainage_drift',
    explanation:
      'The current period retainage rate (8.0%) differs from the rate applied in the prior period (10.0%). No change order or contract amendment was detected authorizing this reduction. Unexplained retainage rate changes frequently trigger owner disputes.',
    suggestedFix:
      'Confirm whether a contract amendment reduced retainage to 8%. If so, upload the amendment as supporting backup. If the rate change was unintentional, correct Column I values in the G703 to apply 10% consistently.',
    evidence: [
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 2',
        cellRef: 'Column I – Line 14',
        extractedValue: '8.0%',
        expectedValue: '10.0% (prior period)',
        snippet: 'Retainage this period: 8.00% — $12,480.00',
      },
    ],
  },
  {
    id: 'iss-003',
    ruleCode: 'CO-003',
    title: 'Approved Change Order CO-007 Included in Billed Amount Without Execution Date',
    severity: 'warning',
    category: 'change_order',
    explanation:
      'Change Order CO-007 ($34,200.00) appears in Column B (Work This Period) but the Change Order Log does not include an execution date for this item. Billing unapproved change orders is a common cause of payment disputes.',
    suggestedFix:
      'Verify that CO-007 has been fully executed by both parties. Update the Change Order Log with the execution date, or remove CO-007 from the current billing period until execution is confirmed.',
    evidence: [
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 3',
        cellRef: 'Row 22 – Column B',
        extractedValue: '$34,200.00 (CO-007)',
        snippet: 'Change Order 007 – MEP Coordination: $34,200.00',
      },
      {
        fileId: 'f-003',
        filename: 'COLog_March2025.xlsx',
        pageOrSheet: 'Sheet1',
        cellRef: 'Row 8 – Col F (Executed Date)',
        extractedValue: '(blank)',
        expectedValue: 'Execution date required',
      },
    ],
  },
  {
    id: 'iss-004',
    ruleCode: 'BACK-004',
    title: 'Stored Materials Line Item Lacks Required Backup Documentation',
    severity: 'warning',
    category: 'missing_backup',
    explanation:
      'Line item 18 (Structural Steel – Stored Materials, $87,500.00) claims stored material value but no stored material backup document was detected in the uploaded package. Most owners require vendor invoices or material receipts to support stored material claims.',
    suggestedFix:
      'Upload the vendor invoice, bill of lading, or material receipt for the structural steel stored on-site. Attach it to the pay-app package before submission.',
    evidence: [
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 2',
        cellRef: 'Row 18 – Column D (Materials Stored)',
        extractedValue: '$87,500.00',
        snippet: 'Structural Steel – Materials Presently Stored: $87,500.00',
      },
    ],
  },
  {
    id: 'iss-005',
    ruleCode: 'WAV-005',
    title: 'Conditional Waiver Coverage Gap: Subcontractor Skyline MEP Not Listed',
    severity: 'warning',
    category: 'missing_waiver',
    explanation:
      'The G703 references Skyline MEP as a major subcontractor with $156,000.00 billed this period, but the conditional lien waiver package does not include a waiver from Skyline MEP. This omission may result in rejection by the owner\'s title company.',
    suggestedFix:
      'Obtain and include a conditional lien waiver from Skyline MEP covering the current billing period before submitting the pay-app package.',
    evidence: [
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 4',
        cellRef: 'Rows 31–35',
        extractedValue: 'Skyline MEP: $156,000.00 this period',
      },
      {
        fileId: 'f-004',
        filename: 'ConditionalWaiver_March2025.pdf',
        pageOrSheet: 'Page 1',
        extractedValue: 'Waivers present for: General Contractor, ABC Concrete, Superior Framing',
        snippet: 'Skyline MEP: NOT FOUND in waiver package',
      },
    ],
  },
  {
    id: 'iss-006',
    ruleCode: 'CONT-006',
    title: 'Continuity Check: Period-to-Date Total Inconsistent with Prior Submission',
    severity: 'warning',
    category: 'continuity',
    explanation:
      'The "Work Completed from Previous Applications" value in the current submission ($1,204,000.00) does not match the "Total Completed to Date" from the February 2025 submission ($1,198,500.00). A $5,500.00 continuity gap was detected.',
    suggestedFix:
      'Review the February 2025 G703 Column F (Total Completed and Stored to Date) and carry forward the correct prior-period total. Do not adjust prior periods after submission.',
    evidence: [
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 1',
        cellRef: 'Column C – Total Row',
        extractedValue: '$1,204,000.00',
        expectedValue: '$1,198,500.00 (from Feb 2025 submission)',
        snippet: 'Work Completed from Previous Applications: $1,204,000.00',
      },
    ],
  },
  {
    id: 'iss-007',
    ruleCode: 'INFO-007',
    title: 'Change Order Log Contains Pending Items Not Yet in Schedule of Values',
    severity: 'info',
    category: 'change_order',
    explanation:
      'CO-008 ($18,750.00, status: Pending Owner Approval) and CO-009 ($6,200.00, status: In Review) appear in the Change Order Log but have not been added to the G703 Schedule of Values. These items are not billed this period, which is correct, but should be tracked.',
    suggestedFix:
      'No immediate action required. Ensure CO-008 and CO-009 are added to the Schedule of Values once fully executed.',
    evidence: [
      {
        fileId: 'f-003',
        filename: 'COLog_March2025.xlsx',
        pageOrSheet: 'Sheet1',
        cellRef: 'Rows 9–10',
        extractedValue: 'CO-008: Pending ($18,750), CO-009: In Review ($6,200)',
      },
    ],
  },
  {
    id: 'iss-008',
    ruleCode: 'INFO-008',
    title: 'Retainage Balance Exceeds 10% Threshold on Three Line Items',
    severity: 'info',
    category: 'retainage_drift',
    explanation:
      'Three line items (Rough Framing, Mechanical Rough-In, Electrical Rough-In) have accumulated retainage balances representing more than 10% of their individual scheduled values. Review whether these items qualify for retainage reduction under the contract terms.',
    suggestedFix:
      'Review contract Section 9.8 for retainage reduction provisions. If eligible, submit a retainage reduction request with the next pay application.',
    evidence: [
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 2',
        cellRef: 'Column I – Rows 8, 12, 15',
        extractedValue: 'Combined excess retainage: $24,300.00',
      },
    ],
  },
  {
    id: 'iss-009',
    ruleCode: 'INFO-009',
    title: 'Percentage Complete on Line 24 Exceeds 100%',
    severity: 'info',
    category: 'math_mismatch',
    explanation:
      'Line 24 (Temporary Protection and Safety) shows 104.2% completion based on the Column F value relative to the scheduled value. While over-billing on temporary items can be contractually acceptable, this should be reviewed to confirm it is intentional.',
    suggestedFix:
      'Verify that the over-billing on Line 24 is authorized under the contract. If unintentional, adjust Column B or Column C accordingly.',
    evidence: [
      {
        fileId: 'f-002',
        filename: 'G703_Schedule_March2025.pdf',
        pageOrSheet: 'Page 3',
        cellRef: 'Row 24 – Column F vs Column A',
        extractedValue: '104.2%',
        expectedValue: '≤100%',
      },
    ],
  },
];

const PREVIEW_ISSUES = FULL_ISSUES.slice(0, 3);

export const MOCK_FULL_REPORT: Report = {
  id: 'rep-001',
  submissionId: 'sub-001',
  generatedAt: '2025-03-28T09:17:33Z',
  issues: FULL_ISSUES,
  passedChecks: 18,
  totalChecks: 27,
  checklistItems: [
    { id: 'chk-01', ruleCode: 'MATH-001', label: 'G702/G703 Scheduled Value Match', status: 'fail' },
    { id: 'chk-02', ruleCode: 'MATH-002', label: 'Column F Arithmetic Verification', status: 'pass' },
    { id: 'chk-03', ruleCode: 'MATH-003', label: 'Net Due Calculation Check', status: 'pass' },
    { id: 'chk-04', ruleCode: 'RET-001', label: 'Retainage Rate Consistency', status: 'fail' },
    { id: 'chk-05', ruleCode: 'RET-002', label: 'Retainage Balance Accumulation', status: 'warning' },
    { id: 'chk-06', ruleCode: 'CONT-001', label: 'Period-to-Period Continuity', status: 'fail' },
    { id: 'chk-07', ruleCode: 'CONT-002', label: 'Change Order Continuity', status: 'pass' },
    { id: 'chk-08', ruleCode: 'CO-001', label: 'Change Order Log Completeness', status: 'warning' },
    { id: 'chk-09', ruleCode: 'CO-002', label: 'CO Execution Date Verification', status: 'fail' },
    { id: 'chk-10', ruleCode: 'WAV-001', label: 'GC Conditional Waiver Present', status: 'pass' },
    { id: 'chk-11', ruleCode: 'WAV-002', label: 'Sub Conditional Waivers Complete', status: 'fail' },
    { id: 'chk-12', ruleCode: 'BACK-001', label: 'Stored Material Backup Present', status: 'fail' },
    { id: 'chk-13', ruleCode: 'BACK-002', label: 'Stored Material Invoices Match Claim', status: 'skipped' },
    { id: 'chk-14', ruleCode: 'DOC-001', label: 'G702 Cover Sheet Present', status: 'pass' },
    { id: 'chk-15', ruleCode: 'DOC-002', label: 'G703 Schedule Present', status: 'pass' },
  ],
};

export const MOCK_PREVIEW_REPORT: Report = {
  id: 'rep-002',
  submissionId: 'sub-002',
  generatedAt: '2025-03-29T14:05:11Z',
  issues: PREVIEW_ISSUES,
  passedChecks: 14,
  totalChecks: 22,
  checklistItems: [],
};

export const MOCK_BILLING_TRANSACTIONS: BillingTransaction[] = [
  {
    id: 'txn-001',
    date: '2025-03-28',
    description: 'Report Unlock – Riverside Medical Center Phase 2 / March 2025',
    amount: 39.0,
    type: 'charge',
  },
  {
    id: 'txn-002',
    date: '2025-03-01',
    description: 'Monthly Subscription – Pro Plan (March 2025)',
    amount: 99.0,
    type: 'charge',
  },
  {
    id: 'txn-003',
    date: '2025-02-28',
    description: 'Report Unlock – Riverside Medical Center Phase 2 / January 2025',
    amount: 39.0,
    type: 'charge',
  },
  {
    id: 'txn-004',
    date: '2025-02-01',
    description: 'Monthly Subscription – Pro Plan (February 2025)',
    amount: 99.0,
    type: 'charge',
  },
  {
    id: 'txn-005',
    date: '2025-01-28',
    description: 'Report Unlock – Riverside Medical Center Phase 2 / December 2024',
    amount: 39.0,
    type: 'charge',
  },
];

export const PROCESSING_STEPS = [
  { key: 'uploading', label: 'Uploading files', description: 'Transferring documents to secure storage' },
  { key: 'queued', label: 'Queued for processing', description: 'Waiting for pipeline capacity' },
  { key: 'classifying', label: 'Classifying documents', description: 'Detecting document roles and formats' },
  { key: 'parsing', label: 'Parsing structure', description: 'Extracting document structure and tables' },
  { key: 'extracting', label: 'Extracting values', description: 'Pulling numeric fields and references' },
  { key: 'validating', label: 'Running checks', description: 'Applying deterministic validation rules' },
];
