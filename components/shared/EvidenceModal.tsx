'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, FileSpreadsheet, MapPin, ArrowRightLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import type { Issue } from '@/lib/types';

interface EvidenceModalProps {
  issue: Issue | null;
  onClose: () => void;
}

export function EvidenceModal({ issue, onClose }: EvidenceModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!issue || issue.evidence.length === 0) return null;

  const evidence = issue.evidence[currentIndex];
  const hasMultiple = issue.evidence.length > 1;
  const isSpreadsheet = evidence.filename.endsWith('.xlsx') || evidence.filename.endsWith('.csv');
  const FileIcon = isSpreadsheet ? FileSpreadsheet : FileText;
  const hasDiscrepancy = evidence.extractedValue && evidence.expectedValue;

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < issue.evidence.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const content = (
    <div className="space-y-4 py-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center gap-2.5 mb-2">
          <FileIcon className={cn('h-4 w-4', isSpreadsheet ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')} />
          <span className="flex-1 truncate font-medium text-sm">{evidence.filename}</span>
          {hasMultiple && (
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {currentIndex + 1} / {issue.evidence.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>{evidence.pageOrSheet}</span>
          {evidence.cellRef && <span className="ml-1 font-mono text-slate-500 dark:text-slate-400">{evidence.cellRef}</span>}
        </div>
      </div>

      {hasDiscrepancy && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/40 dark:bg-amber-900/10">
          <div className="flex items-center gap-1.5 mb-2.5">
            <ArrowRightLeft className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Discrepancy Found</span>
          </div>
          <div className="space-y-2">
            <div className="text-xs">
              <p className="text-slate-500 dark:text-slate-400 mb-1">Found</p>
              <p className="font-semibold text-red-600 dark:text-red-400 break-words">{evidence.extractedValue}</p>
            </div>
            <div className="text-xs">
              <p className="text-slate-500 dark:text-slate-400 mb-1">Expected</p>
              <p className="font-semibold text-green-600 dark:text-green-400 break-words">{evidence.expectedValue}</p>
            </div>
          </div>
        </div>
      )}

      {!hasDiscrepancy && evidence.extractedValue && (
        <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Extracted Value</p>
          <p className="font-mono text-sm break-words text-slate-700 dark:text-slate-200">{evidence.extractedValue}</p>
        </div>
      )}

      {evidence.snippet && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Source Text</p>
          <p className="font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-300 break-words whitespace-pre-wrap">{evidence.snippet}</p>
        </div>
      )}

      {hasMultiple && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            aria-label="Previous evidence"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {currentIndex + 1} of {issue.evidence.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === issue.evidence.length - 1}
            className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            aria-label="Next evidence"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DialogWrapper issue={issue} onClose={onClose}>
        {content}
      </DialogWrapper>
      <DrawerWrapper issue={issue} onClose={onClose}>
        {content}
      </DrawerWrapper>
    </>
  );
}

function DialogWrapper({
  issue,
  onClose,
  children,
}: {
  issue: Issue;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={!!issue} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="hidden md:flex md:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle>{issue.title}</DialogTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{issue.ruleCode}</p>
            </div>
            <DialogClose asChild>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function DrawerWrapper({
  issue,
  onClose,
  children,
}: {
  issue: Issue;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Drawer open={!!issue} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="md:hidden">
        <DrawerHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle>{issue.title}</DrawerTitle>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{issue.ruleCode}</p>
            </div>
            <DrawerClose asChild>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="overflow-y-auto max-h-[60vh] px-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
