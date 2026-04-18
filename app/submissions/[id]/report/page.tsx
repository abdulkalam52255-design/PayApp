import { AppShell } from '@/components/layout/AppShell';
import { getReportViewModel } from '@/lib/view-models/reports';
import { ReportClientContainer } from '@/components/report/ReportClientContainer';

export default async function ReportPage({ params }: { params: { id: string } }) {
  const submissionId = params.id;
  const viewModel = await getReportViewModel(submissionId);

  return (
    <AppShell>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <ReportClientContainer viewModel={viewModel} />
      </div>
    </AppShell>
  );
}
