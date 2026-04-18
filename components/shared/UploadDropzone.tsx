'use client';

import { useState, useRef } from 'react';
import { Upload, CircleAlert as AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.xlsx', '.csv'];

export function UploadDropzone({ onFilesAdded, disabled }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAdd = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const valid: File[] = [];
    const invalid: string[] = [];
    Array.from(files).forEach((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        valid.push(file);
      } else {
        invalid.push(file.name);
      }
    });
    if (invalid.length > 0) {
      setError(`Unsupported file type(s): ${invalid.join(', ')}. Only PDF, XLSX, and CSV are accepted.`);
    }
    if (valid.length > 0) onFilesAdded(valid);
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) validateAndAdd(e.dataTransfer.files);
        }}
        className={cn(
          'relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          isDragging
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.xlsx,.csv"
          className="sr-only"
          onChange={(e) => validateAndAdd(e.target.files)}
          disabled={disabled}
        />
        <Upload className={cn('h-8 w-8', isDragging ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500')} />
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          Drag and drop files here, or{' '}
          <span className="text-blue-600 dark:text-blue-400">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          PDF, XLSX, or CSV — max 50 MB per file
        </p>
        <div className="mt-4 flex gap-2">
          {['PDF', 'XLSX', 'CSV'].map((ext) => (
            <span
              key={ext}
              className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs text-amber-800 dark:text-amber-300">
          <strong>V1 Limitation:</strong> Scanned or image-only PDFs are not supported. Upload
          software-generated (embedded-text) PDFs or XLSX exports from your project management system.
        </p>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
