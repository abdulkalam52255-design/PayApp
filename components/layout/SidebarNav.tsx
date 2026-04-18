'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, FileText, ChartBar as BarChart3, CreditCard, Settings, Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO } from '@/lib/demo';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/submissions', label: 'Submissions', icon: FileText },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarNavProps {
  onClose?: () => void;
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const pathname = usePathname();

  const unlockPct = Math.round((DEMO.USER.unlocksUsed / DEMO.USER.unlocksTotal) * 100);
  const isNearLimit = unlockPct >= 80;

  return (
    <aside className="flex h-full w-56 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[hsl(222,20%,10%)]">
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-blue-600">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Sentinel</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">PayApp QA</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 flex-shrink-0',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{DEMO.USER.plan} Plan</p>
            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
              Active
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {DEMO.USER.unlocksUsed} of {DEMO.USER.unlocksTotal} unlocks used
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isNearLimit ? 'bg-amber-500' : 'bg-blue-600'
              )}
              style={{ width: `${unlockPct}%` }}
            />
          </div>
          {isNearLimit && (
            <Link
              href="/billing"
              onClick={onClose}
              className="mt-2 block text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              Upgrade plan →
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
