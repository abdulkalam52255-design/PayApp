import { AppShell } from '@/components/layout/AppShell';
import { NewSubmissionForm } from '@/components/submissions/NewSubmissionForm';

export default function NewSubmissionPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <NewSubmissionForm />
      </div>
    </AppShell>
  );
}
