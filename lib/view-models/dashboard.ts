import { MOCK_PROJECTS, MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { DEMO } from '@/lib/demo';
import type { Submission, Project } from '@/lib/types';

export interface DashboardViewModel {
  stats: {
    activeProjects: number;
    submissionsThisMonth: number;
    criticalIssuesFound: number;
    reportsUnlocked: number;
  };
  recentSubmissions: (Submission & { projectName: string })[];
  projects: Project[];
  demoAlert: {
    message: string;
    submissionId: string;
  } | null;
  usage: {
    submissionsUsed: number;
    submissionsTotal: number;
    unlocksUsed: number;
    unlocksTotal: number;
  };
}

export async function getDashboardViewModel(): Promise<DashboardViewModel> {
  const alertSubmission = MOCK_SUBMISSIONS.find((s) => s.id === DEMO.ALERT.submissionId);
  
  const recentSubmissions = MOCK_SUBMISSIONS.slice(0, 4).map(sub => ({
    ...sub,
    projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project'
  }));

  return {
    stats: {
      activeProjects: MOCK_PROJECTS.length,
      submissionsThisMonth: DEMO.USER.submissionsUsed,
      criticalIssuesFound: 3,
      reportsUnlocked: DEMO.USER.unlocksUsed,
    },
    recentSubmissions,
    projects: MOCK_PROJECTS,
    demoAlert: alertSubmission ? {
      message: DEMO.ALERT.message,
      submissionId: DEMO.ALERT.submissionId,
    } : null,
    usage: {
      submissionsUsed: DEMO.USER.submissionsUsed,
      submissionsTotal: DEMO.USER.submissionsTotal,
      unlocksUsed: DEMO.USER.unlocksUsed,
      unlocksTotal: DEMO.USER.unlocksTotal,
    }
  };
}
