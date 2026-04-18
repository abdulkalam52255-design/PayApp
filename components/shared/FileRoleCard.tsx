'use client';

import { FileText, FileSpreadsheet, ChevronDown, CircleCheck as CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentRole, UploadedFile } from '@/lib/types';

const ROLE_LABELS: Record<DocumentRole, string> = {
  g702_cover: 'G702 Cover Sheet',
  g703_schedule: 'G703 Schedule of Values',
  change_order_log: 'Change Order Log',
  waiver_conditional: 'Conditional Lien Waiver',
  waiver_unconditional: 'Unconditional Lien Waiver',
  stored_material_backup: 'Stored Material Backup',
  schedule_of_values: 'Schedule of Values',
  unknown: 'Unknown – Review Required',
};

interface FileRoleCardProps {
  file: UploadedFile;
  onRoleChange?: (fileId: string, role: DocumentRole) => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ConfidencePill({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 90
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : pct >= 70
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', color)}>
      {pct}% confidence
    </span>
  );
}

export function FileRoleCard({ file, onRoleChange }: FileRoleCardProps) {
  const Icon = file.fileType === 'xlsx' || file.fileType === 'csv' ? FileSpreadsheet : FileText;
  const effectiveRole = file.correctedRole ?? file.detectedRole;
  const isUnknown = effectiveRole === 'unknown';

  return (
    <div
      className={cn(
        'rounded-lg border bg-white dark:bg-[hsl(222,20%,11%)] p-4',
        isUnknown ? 'border-amber-300 dark:border-amber-700/50' : 'border-slate-200 dark:border-slate-700'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md',
            file.fileType === 'pdf'
              ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{file.filename}</p>
            <span className="rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-xs uppercase text-slate-500 dark:text-slate-400">
              {file.fileType}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{formatBytes(file.sizeBytes)}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {onRoleChange ? (
              <div className="relative">
                <select
                  value={effectiveRole}
                  onChange={(e) => onRoleChange(file.id, e.target.value as DocumentRole)}
                  className="appearance-none rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1 pl-2.5 pr-7 text-xs font-medium text-slate-700 dark:text-slate-300 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              </div>
            ) : (
              <span className="rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                {ROLE_LABELS[effectiveRole]}
              </span>
            )}
            <ConfidencePill confidence={file.roleConfidence} />
            {file.correctedRole && (
              <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="h-3 w-3" />
                Corrected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
