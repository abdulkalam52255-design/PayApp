'use client';

import { useState } from 'react';
import { Save, TriangleAlert as AlertTriangle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('Anderson Construction Group');
  const [defaultRetainage, setDefaultRetainage] = useState('10');
  const [notificationEmail, setNotificationEmail] = useState('j.anderson@acg-construction.com');
  const [timezone, setTimezone] = useState('America/New_York');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = "mt-1.5 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400";
  const labelClass = "block text-xs font-medium text-slate-700 dark:text-slate-300";
  const cardClass = "rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-5";

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Workspace and account preferences</p>

        <div className="mt-6 space-y-6">
          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Company</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                  placeholder="Your company name"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Appears in report headers and exported documents.
                </p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Preflight Defaults</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              These values are used as reference points when running checks. They can be overridden
              per submission.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>
                  Default Retainage Rate (%)
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={defaultRetainage}
                    onChange={(e) => setDefaultRetainage(e.target.value)}
                    className="w-28 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">%</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Used for retainage drift detection. Common rates: 5%, 10%.
                </p>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>
                  Notification Email
                </label>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Receives email when processing completes or a report is ready.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5">
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Report ready notifications</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Email when a preflight report is available</p>
                </div>
                <button className="relative h-5 w-9 rounded-full bg-blue-600 transition-colors focus:outline-none">
                  <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5">
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Critical issue alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Immediate email for critical findings</p>
                </div>
                <button className="relative h-5 w-9 rounded-full bg-blue-600 transition-colors focus:outline-none">
                  <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Local Preferences</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

          <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" />
              <div>
                <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">Danger Zone</h2>
                <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                  Deleting your workspace permanently removes all projects, submissions, and reports.
                  This cannot be undone.
                </p>
                <button className="mt-3 rounded-lg border border-red-300 dark:border-red-700/50 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Delete Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
