'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Bell, Plus, User, Moon, Sun, Menu, Settings, CreditCard, LogOut, CircleUser as UserCircle } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { DEMO } from '@/lib/demo';

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
    >
      <Sun className="h-4 w-4 hidden dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
    </button>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
            'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
            'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
            'outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            'data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800'
          )}
          aria-label="Open user menu"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold flex-shrink-0">
            {DEMO.USER.initials}
          </div>
          <span className="hidden text-xs font-medium sm:block">{DEMO.USER.name.split(' ').map(n => n[0]).join('. ')}.</span>
          <svg className="hidden h-3.5 w-3.5 text-slate-400 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            'z-50 w-52 overflow-hidden rounded-lg border bg-white shadow-lg',
            'border-slate-200 dark:border-slate-700 dark:bg-slate-900',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2'
          )}
        >
          <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{DEMO.USER.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{DEMO.USER.email}</p>
          </div>

          <DropdownMenu.Group className="py-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-50 focus:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
              >
                <UserCircle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                Profile
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/billing"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-50 focus:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
              >
                <CreditCard className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                Billing
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-50 focus:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
              >
                <Settings className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                Settings
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800" />

          <DropdownMenu.Group className="py-1">
            <DropdownMenu.Item asChild>
              <button className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 outline-none transition-colors hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:focus:bg-red-900/20">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function Topbar({ title, onMenuClick, sidebarOpen }: TopbarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-[hsl(222,20%,10%)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/submissions/new"
          className="hidden items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:flex"
        >
          <Plus className="h-3.5 w-3.5" />
          New Submission
        </Link>

        <Link
          href="/submissions/new"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700 sm:hidden"
          aria-label="New Submission"
        >
          <Plus className="h-4 w-4" />
        </Link>

        <ThemeToggle />

        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <ProfileMenu />
      </div>
    </header>
  );
}
