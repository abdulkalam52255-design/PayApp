import { TriangleAlert as AlertTriangle, FileX } from 'lucide-react';

interface UnsupportedWarningProps {
  reason?: string;
}

export function UnsupportedWarning({ reason }: UnsupportedWarningProps) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <FileX className="h-6 w-6 text-red-500 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
            Unsupported File Format
          </h3>
          {reason ? (
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">{reason}</p>
          ) : (
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              This file could not be processed. PayApp Sentinel requires
              embedded-text PDFs or XLSX exports from your pay-app software.
              Scanned or image-only PDFs are not supported in V1.
            </p>
          )}
          <div className="mt-4 rounded-md border border-red-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              What is an embedded-text PDF?
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              An embedded-text PDF is generated directly by software (e.g.,
              exported from ProCore, Sage, or AIA Contract Documents) and
              contains selectable text. Scanned documents that were photographed
              or faxed are image-only and cannot be parsed without OCR, which is
              not available in this version.
            </p>
          </div>
          <div className="mt-3 flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500 dark:text-amber-400" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              To use PayApp Sentinel, export your pay-app package as a
              software-generated PDF or XLSX directly from your project
              management system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
