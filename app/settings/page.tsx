import { AppShell } from '@/components/layout/AppShell';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { getSettingsViewModel } from '@/lib/view-models/settings';

export default async function SettingsPage() {
  const vm = await getSettingsViewModel();
  
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Workspace and account preferences</p>

        <SettingsForm initialData={vm} />
      </div>
    </AppShell>
  );
}
