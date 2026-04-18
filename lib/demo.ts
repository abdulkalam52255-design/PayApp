export const DEMO = {
  SUBMISSION_UNLOCKED: 'sub-001',
  SUBMISSION_PREVIEW: 'sub-002',
  SUBMISSION_FAILED: 'sub-003',
  SUBMISSION_PROCESSING: 'sub-processing',
  PROJECT_PRIMARY: 'proj-001',
  PROJECT_SECONDARY: 'proj-002',

  USER: {
    name: 'James Anderson',
    email: 'j.anderson@acg-construction.com',
    initials: 'JA',
    plan: 'Pro',
    unlocksUsed: 7,
    unlocksTotal: 10,
    submissionsUsed: 4,
    submissionsTotal: 10,
  },

  ALERT: {
    submissionId: 'sub-001',
    message: '2 critical issues in Riverside Medical / March 2025. Review before submitting.',
  },
} as const;
