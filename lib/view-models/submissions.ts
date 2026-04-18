import { MOCK_SUBMISSIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import type { Submission } from '@/lib/types';

export interface SubmissionsViewModel {
  submissions: (Submission & { projectName: string })[];
}

export async function getSubmissionsViewModel(): Promise<SubmissionsViewModel> {
  const submissions = MOCK_SUBMISSIONS.filter((s) => s.id !== 'sub-processing').map(sub => ({
    ...sub,
    projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project'
  }));
  
  return {
    submissions,
  };
}

export interface SubmissionViewModel {
  submission: Submission | null;
  projectName: string;
}

export async function getSubmissionViewModel(id: string): Promise<SubmissionViewModel> {
  const baseSubmission = MOCK_SUBMISSIONS.find((s) => s.id === id) ?? MOCK_SUBMISSIONS.find((s) => s.id === 'sub-processing')!;
  const project = MOCK_PROJECTS.find((p) => p.id === baseSubmission.projectId);

  return {
    submission: baseSubmission,
    projectName: project?.name ?? 'Unknown Project',
  };
}

export async function getProjectSubmissionsViewModel(projectId: string): Promise<SubmissionsViewModel> {
  const submissions = MOCK_SUBMISSIONS.filter((s) => s.projectId === projectId).map(sub => ({
    ...sub,
    projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project'
  }));

  return {
    submissions,
  };
}
