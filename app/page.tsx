import Link from 'next/link';
import { Shield, ArrowRight, CircleCheck as CheckCircle2, Upload, ScanLine, Zap, FileSearch, OctagonAlert as AlertOctagon, TrendingDown, GitMerge, FileX, HardDrive, GitPullRequest, FileText, Lock, ChevronRight } from 'lucide-react';
import { PricingCards } from '@/components/shared/PricingCards';

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900">PayApp Sentinel</span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900">
            How it works
          </a>
          <a href="#checks" className="text-sm text-slate-600 hover:text-slate-900">
            Checks
          </a>
          <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Sign in
          </Link>
          <Link
            href="/submissions/new"
            className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Upload a Package
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-slate-200 bg-white py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700">
          <Zap className="h-3 w-3" />
          AIA-style pay-app preflight — not an official AIA product
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Catch pay-app mistakes
          <br />
          <span className="text-blue-600">before they delay payment</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          PayApp Sentinel runs deterministic preflight checks on your AIA-style G702/G703 pay
          application packages — flagging math errors, retainage drift, missing waivers, and
          change-order inconsistencies before you submit.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/submissions/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload a Package
          </Link>
          <Link
            href="/submissions/sub-001/report"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <FileSearch className="h-4 w-4" />
            View Sample Report
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Checks per submission', value: '27+' },
            { label: 'Average processing time', value: '< 3 min' },
            { label: 'Evidence-linked findings', value: '100%' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const points = [
    {
      icon: FileText,
      title: 'Embedded-text PDFs & XLSX only',
      desc: 'Software-generated exports from ProCore, Sage, AIA Contract Docs, and similar systems.',
    },
    {
      icon: Lock,
      title: 'Evidence-linked findings',
      desc: 'Every issue is linked to the specific file, page, and cell that triggered it.',
    },
    {
      icon: CheckCircle2,
      title: 'Deterministic checks, not AI opinions',
      desc: 'Rules are explicit, auditable, and consistent. No probabilistic guesses.',
    },
    {
      icon: Shield,
      title: 'Not an official AIA product',
      desc: 'PayApp Sentinel is an independent QA tool and does not generate official AIA documents.',
    },
  ];
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-100">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: '01', icon: Upload, title: 'Upload Your Package', desc: 'Drag and drop your G702, G703, Change Order Log, waivers, and stored material backup. PDF and XLSX accepted.' },
    { number: '02', icon: ScanLine, title: 'Parse & Normalize', desc: 'The pipeline extracts tables, numeric fields, and document structure from embedded-text exports.' },
    { number: '03', icon: Zap, title: 'Run Deterministic Checks', desc: '27+ rule-based checks validate math, retainage, continuity, waivers, and change-order compliance.' },
    { number: '04', icon: FileSearch, title: 'Review Before Submission', desc: 'Receive a structured exception report with severity ratings, rule codes, and evidence links.' },
  ];
  return (
    <section id="how-it-works" className="border-b border-slate-200 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">How It Works</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">From upload to preflight report in minutes</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">A lightweight four-step process designed to fit into your existing pay-app workflow.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-5 hidden h-5 w-5 text-slate-300 lg:block" />
                )}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-mono text-xl font-bold text-slate-200">{step.number}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IssueCategories() {
  const categories = [
    { icon: AlertOctagon, color: 'text-red-600 bg-red-50', title: 'Math Mismatches', desc: 'G702 scheduled values vs G703 column totals, net due calculations, column F arithmetic.', severity: 'Critical', severityColor: 'text-red-600' },
    { icon: TrendingDown, color: 'text-amber-600 bg-amber-50', title: 'Retainage Drift', desc: 'Rate changes between periods, unexplained retainage reductions, cumulative balance verification.', severity: 'Critical / Warning', severityColor: 'text-amber-600' },
    { icon: GitMerge, color: 'text-amber-600 bg-amber-50', title: 'Continuity Issues', desc: 'Period-to-period total mismatches, prior application carryforward discrepancies.', severity: 'Warning', severityColor: 'text-amber-600' },
    { icon: FileX, color: 'text-amber-600 bg-amber-50', title: 'Missing Waivers', desc: 'Subcontractor conditional/unconditional waivers absent from package for billed parties.', severity: 'Warning', severityColor: 'text-amber-600' },
    { icon: HardDrive, color: 'text-blue-600 bg-blue-50', title: 'Missing Stored-Material Backup', desc: 'Column D claims without supporting vendor invoices or material receipts.', severity: 'Warning / Info', severityColor: 'text-blue-600' },
    { icon: GitPullRequest, color: 'text-blue-600 bg-blue-50', title: 'Change-Order Inconsistencies', desc: 'Billing unapproved COs, missing execution dates, COs in G703 not in change log.', severity: 'Warning / Info', severityColor: 'text-blue-600' },
  ];
  return (
    <section id="checks" className="border-b border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">What We Check</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Six issue categories, 27+ rules</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">Each rule maps to a specific document, field, or cross-document relationship. No vague AI opinions — every finding cites its source.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`inline-flex rounded-md p-2 ${cat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{cat.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{cat.desc}</p>
                <p className={`mt-3 text-xs font-medium ${cat.severityColor}`}>{cat.severity}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SupportedInputs() {
  return (
    <section className="border-b border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600">Supported</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">What works in V1</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Software-generated PDFs', note: 'AIA Contract Docs, ProCore, Sage, Viewpoint' },
                { label: 'XLSX exports', note: 'G703 schedules, change order logs, SOV exports' },
                { label: 'CSV exports', note: 'Schedule of values, change order tabulations' },
                { label: 'Multi-file packages', note: 'Upload G702, G703, CO Log, and waivers together' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Not Supported in V1</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">Known limitations</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Scanned / image-only PDFs', note: 'OCR is not available in this version' },
                { label: 'Photos of pay-app packages', note: 'Images cannot be parsed for structured data' },
                { label: 'Proprietary binary formats', note: 'Export to PDF or XLSX before uploading' },
                { label: 'Password-protected files', note: 'Remove encryption before uploading' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <FileX className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPricingSection() {
  return (
    <section id="pricing" className="border-b border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Simple, project-based pricing</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">Pay per project-month or subscribe for a flat monthly rate. No annual commitments.</p>
        </div>
        <div className="mt-12">
          <PricingCards variant="landing" />
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-slate-900 py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Stop submitting pay apps with undetected errors</h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">Upload your next pay-app package and get a preflight exception report before it reaches the owner. Most issues surface in under three minutes.</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/submissions/new" className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
            <Upload className="h-4 w-4" />
            Upload a Package — $39 to unlock
          </Link>
          <Link href="/submissions/sub-001/report" className="flex items-center gap-2 rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:text-white">
            View Sample Report
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">Preview is free. Unlock the full report when you are ready.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">PayApp Sentinel</span>
          </div>
          <p className="text-xs text-slate-500">Not affiliated with or endorsed by AIA. PayApp Sentinel is an independent QA tool.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-400">Privacy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-400">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <IssueCategories />
      <SupportedInputs />
      <LandingPricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
