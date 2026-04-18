'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Building2, Calendar, Upload, Tag, Play } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { FileRoleCard } from '@/components/shared/FileRoleCard';
import type { DocumentRole, UploadedFile } from '@/lib/types';
import { MOCK_PROJECTS } from '@/lib/mock-data';

const STEPS = [
  { id: 1, label: 'Select Project', icon: Building2 },
  { id: 2, label: 'Billing Period', icon: Calendar },
  { id: 3, label: 'Upload Files', icon: Upload },
  { id: 4, label: 'Confirm Roles', icon: Tag },
  { id: 5, label: 'Run Preflight', icon: Play },
];

const BILLING_PERIODS = [
  'April 2025', 'March 2025', 'February 2025', 'January 2025',
  'December 2024', 'November 2024', 'October 2024',
];

function mockFileFromUpload(file: File, index: number): UploadedFile {
  const roleMap: Record<string, DocumentRole> = {
    'g702': 'g702_cover', 'g703': 'g703_schedule', 'co': 'change_order_log',
    'waiver': 'waiver_conditional', 'sov': 'schedule_of_values',
  };
  const lower = file.name.toLowerCase();
  let role: DocumentRole = 'unknown';
  let confidence = 0.6;
  for (const [key, val] of Object.entries(roleMap)) {
    if (lower.includes(key)) { role = val; confidence = 0.85 + Math.random() * 0.12; break; }
  }
  const ext = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'xlsx' | 'csv';
  return { id: `f-new-${index}`, filename: file.name, fileType: ext ?? 'pdf', sizeBytes: file.size, detectedRole: role, roleConfidence: confidence };
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex items-center">
      {STEPS.map((step, i) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${isCompleted ? 'border-blue-600 bg-blue-600' : isActive ? 'border-blue-600 bg-white dark:bg-slate-900' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'}`}>
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500'}`} />
                )}
              </div>
              <span className={`mt-1 hidden text-xs font-medium sm:block ${isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 h-0.5 w-8 sm:w-16 ${step.id < currentStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NewSubmissionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState<string>(MOCK_PROJECTS[0].id);
  const [billingPeriod, setBillingPeriod] = useState<string>('April 2025');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    const mapped = newFiles.map((f, i) => mockFileFromUpload(f, files.length + i));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const handleRoleChange = (fileId: string, role: DocumentRole) => {
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, correctedRole: role } : f));
  };

  const handleRunPreflight = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/submissions/sub-processing');
    }, 1200);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-2">
          <button onClick={() => router.back()} className="rounded-md p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">New Submission</h1>
        </div>

        <StepIndicator currentStep={step} />

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[hsl(222,20%,11%)] p-6 shadow-sm">
          {step === 1 && (
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Select Project</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose the project this submission belongs to.
              </p>
              <div className="mt-4 space-y-2">
                {MOCK_PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${selectedProject === project.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{project.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{project.owner}</p>
                      <p className="font-mono text-xs text-slate-400 dark:text-slate-500">{project.contractRef}</p>
                    </div>
                    {selectedProject === project.id && (
                      <Check className="ml-auto h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Select Billing Period</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose the pay application period for this submission.
              </p>
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Billing Period</label>
                <select
                  value={billingPeriod}
                  onChange={(e) => setBillingPeriod(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  {BILLING_PERIODS.map((period) => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Submission Summary</p>
                <div className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <p><span className="text-slate-400 dark:text-slate-500">Project:</span> {MOCK_PROJECTS.find(p => p.id === selectedProject)?.name}</p>
                  <p><span className="text-slate-400 dark:text-slate-500">Period:</span> {billingPeriod}</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Upload Files</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Upload all documents in your pay-app package. You can add multiple files at once.
              </p>
              <div className="mt-4">
                <UploadDropzone onFilesAdded={handleFilesAdded} />
              </div>
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {files.length} file{files.length !== 1 ? 's' : ''} staged
                  </p>
                  <div className="space-y-2">
                    {files.map((file) => (
                      <FileRoleCard key={file.id} file={file} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Confirm Document Roles</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review the detected document roles. Correct any misclassified files before running
                preflight.
              </p>
              {files.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30 p-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No files uploaded. Go back to add files.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {files.map((file) => (
                    <FileRoleCard key={file.id} file={file} onRoleChange={handleRoleChange} />
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Ready to Run Preflight</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review the submission details below, then start the preflight check.
              </p>
              <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Project</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{MOCK_PROJECTS.find(p => p.id === selectedProject)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Billing Period</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{billingPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Files</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{files.length} document{files.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/20 p-4">
                <p className="text-xs font-medium text-blue-800 dark:text-blue-300">What happens next</p>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                  Files will be uploaded, classified, parsed, and validated against 27+ deterministic
                  rules. Processing typically completes in 1–3 minutes. You will see live progress on
                  the next screen.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              disabled={step === 3 && files.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleRunPreflight}
              disabled={isSubmitting || files.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Starting...' : 'Run Preflight'}
              <Play className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
