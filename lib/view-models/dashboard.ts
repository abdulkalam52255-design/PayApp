import { createClientServer } from '@/lib/supabase/server';
import { mapProject, mapSubmission, type DbProject, type DbSubmission } from '@/lib/supabase/mappers';
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
  isLive: boolean;
}

function getMockDashboard(): DashboardViewModel {
  const alertSubmission = MOCK_SUBMISSIONS.find((s) => s.id === DEMO.ALERT.submissionId);
  const recentSubmissions = MOCK_SUBMISSIONS.slice(0, 4).map((sub) => ({
    ...sub,
    projectName: MOCK_PROJECTS.find((p) => p.id === sub.projectId)?.name ?? 'Unknown Project',
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
    demoAlert: alertSubmission
      ? { message: DEMO.ALERT.message, submissionId: DEMO.ALERT.submissionId }
      : null,
    usage: {
      submissionsUsed: DEMO.USER.submissionsUsed,
      submissionsTotal: DEMO.USER.submissionsTotal,
      unlocksUsed: DEMO.USER.unlocksUsed,
      unlocksTotal: DEMO.USER.unlocksTotal,
    },
    isLive: false,
  };
}

function getEmptyLiveDashboard(): DashboardViewModel {
  return {
    stats: { activeProjects: 0, submissionsThisMonth: 0, criticalIssuesFound: 0, reportsUnlocked: 0 },
    recentSubmissions: [],
    projects: [],
    demoAlert: null,
    usage: { submissionsUsed: 0, submissionsTotal: 10, unlocksUsed: 0, unlocksTotal: 10 },
    isLive: true,
  };
}

// ---------------------------------------------------------------------------
// Dashboard aggregate — projects + recent submissions + usage counters.
// ---------------------------------------------------------------------------
export async function getDashboardViewModel(): Promise<DashboardViewModel> {
  const supabase = createClientServer();
  if (!supabase) return getMockDashboard();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getEmptyLiveDashboard();

  try {
    // 1. Fetch projects with submission aggregates
    const { data: projectRows, error: projectErr } = await supabase
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

    if (projectErr || !projectRows) {
      console.error('[dashboard] Project query failed, falling back to mock:', projectErr?.message);
      return getMockDashboard();
    }

    const projects: Project[] = projectRows.map((row: any) => {
      const subs: any[] = row.submissions ?? [];
      const latestSub = subs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      return mapProject({
        id: row.id,
        name: row.name,
        default_retainage_rate: row.default_retainage_rate,
        created_at: row.created_at,
        updated_at: row.updated_at,
        submission_count: subs.length,
        latest_period: latestSub?.period_label ?? null,
        latest_status: latestSub?.status ?? null,
        critical_count: subs.reduce((acc: number, s: any) => acc + (s.issue_counts?.critical ?? 0), 0),
        warning_count: subs.reduce((acc: number, s: any) => acc + (s.issue_counts?.warning ?? 0), 0),
      } as DbProject);
    });

    // 2. Fetch recent submissions across all projects
    const { data: subRows, error: subErr } = await supabase
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
      .order('created_at', { ascending: false })
      .limit(4);

    if (subErr) {
      console.error('[dashboard] Submissions query failed:', subErr.message);
    }

    const recentSubmissions: (Submission & { projectName: string })[] = (subRows ?? []).map((row: any) => {
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
      };
      return {
        ...mapSubmission(dbRow),
        projectName: (row.projects as any)?.name ?? 'Unknown Project',
      };
    });

    // 3. Derive stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const allSubs = projectRows.flatMap((r: any) => r.submissions ?? []);
    const submissionsThisMonth = allSubs.filter((s: any) => s.created_at >= monthStart).length;
    const criticalIssuesFound = allSubs.reduce((acc: number, s: any) => acc + (s.issue_counts?.critical ?? 0), 0);

    const { count: unlocksCount } = await supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'unlocked');

    // 4. Alert: most recent submission with critical issues
    const alertSub = recentSubmissions.find((s) => s.criticalCount > 0);
    const demoAlert = alertSub
      ? {
          message: `${alertSub.criticalCount} critical issue${alertSub.criticalCount > 1 ? 's' : ''} in ${alertSub.projectName} / ${alertSub.billingPeriod}. Review before submitting.`,
          submissionId: alertSub.id,
        }
      : null;

    return {
      stats: {
        activeProjects: projects.length,
        submissionsThisMonth,
        criticalIssuesFound,
        reportsUnlocked: unlocksCount ?? 0,
      },
      recentSubmissions,
      projects,
      demoAlert,
      usage: {
        submissionsUsed: submissionsThisMonth,
        submissionsTotal: 10, // plan limit — will come from users_profile/subscriptions in Phase 3
        unlocksUsed: unlocksCount ?? 0,
        unlocksTotal: 10,     // plan limit — will come from users_profile/subscriptions in Phase 3
      },
      isLive: true,
    };
  } catch (err) {
    console.error('[dashboard] Unexpected error, falling back to mock:', err);
    return getMockDashboard();
  }
}
