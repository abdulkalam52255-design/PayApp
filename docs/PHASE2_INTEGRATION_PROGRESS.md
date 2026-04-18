# Phase 2 Integration Progress

**Date**: 2026-04-18
**Goal**: Safely replace mock-backed frontend loaders with live Supabase database reads while preserving the React Server Component layout structure and UI logic.

---

## 1. Projects View Model (`lib/view-models/projects.ts`)

* **Previous Mock Source**: `MOCK_PROJECTS` array.
* **New Live Data Source**: Direct DB query aggregating submission data.
* **Tables/Queries Used**: 
  * `projects` table (Select *), 
  * Sub-select joined with `submissions` table to derive the most recent `period_label`, latest `status`, and aggregate sum of `critical_count` and `warning_count`.
* **Client/Server Boundary**: Remains a **Server Component** loader (no client fetching needed).
* **Remaining Blockers**: Project row updates (mutations) not yet wired since we focused only on read replacements. `owner` lookup is currently a stub until Supabase Auth sessions are enforced in Phase 3.

---

## 2. Dashboard View Model (`lib/view-models/dashboard.ts`)

* **Previous Mock Source**: Assortment of `MOCK_PROJECTS`, `MOCK_SUBMISSIONS`, and `DEMO` configurations.
* **New Live Data Source**: Server-side aggregation fetching multiple tables to build an all-in-one usage payload.
* **Tables/Queries Used**: 
  * Projects + Submissions aggregation query (identical structure to Projects View Model).
  * `submissions` (top 4 recent by `created_at`).
  * `reports` (where `status = 'unlocked'` for usage stats).
* **Client/Server Boundary**: Remains a **Server Component** loader.
* **Remaining Blockers**: Real subscription caps (total allowed submissions/unlocks) are hardcoded to 10 until the billing/`users_profile` integration is prioritized.

---

## 3. Submissions View Model (`lib/view-models/submissions.ts`)

* **Previous Mock Source**: `MOCK_SUBMISSIONS` merged with `MOCK_PROJECTS`.
* **New Live Data Source**: Query utilizing foreign key relations.
* **Tables/Queries Used**: 
  * `submissions` table.
  * Inner join on `projects` to fetch `projects(name)`.
  * Inner join on `reports` to fetch report unlock status (`reports(status, unlocked_at)`).
  * Inner join on `uploaded_files` and `file_role_assignments` (to assemble the files payload specifically for the detail view router).
* **Client/Server Boundary**: Remains a **Server Component** loader. The unified `SubmissionsViewModel` supplies list views, detail views, and project-scoped views transparently.
* **Remaining Blockers**: None. Properly maps native Postgres DB structures onto existing UI types.

---

## 4. Processing Status Loading (`ProcessingView.tsx`)

* **Previous Mock Source**: A `setTimeout` interval advancing through a hardcoded `STATUS_PROGRESSION` array if `isDemo` is active.
* **New Live Data Source**: Active interval polling directly to our own Next.js API.
* **Tables/Queries Used**: 
  * Route: `GET /api/submissions/[id]/status`
  * Query: Selects `status`, `issue_counts`, and `reports(status, unlocked_at)` to determine if processing is finalized (or failed) and securely returns live boundaries.
* **Client/Server Boundary**: API runs on the **Server**, while `<ProcessingView />` uses a standard localized `fetch()` map driven by an effect interval inside the **Client** component.
* **Remaining Blockers**: Upgrading to Supabase Realtime is currently blocked because the API keys in our local `web` layer are hidden server-side (`SUPABASE_URL` / `SUPABASE_ANON_KEY`) for extreme security. Client-side Realtime channels require `NEXT_PUBLIC_` prefixes, which were intentionally left out. We defaulted safely to simple interval API polling loops.
