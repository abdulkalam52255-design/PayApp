# Mock to Live Migration Strategy

This document outlines the transition roadmap for replacing the localized Next.js frontend demonstration mocks (`MOCK_*`) with the live backend components (Supabase Database, Worker APIs, Stripe, and Auth) inside PayApp Sentinel.

## 1. Mapped Mock Surfaces

The frontend currently uses static mock data instantiated via the `lib/view-models/` layer and embedded routing logic.

| Frontend Mock Object | Intended Live Backend Source | Server/Client Render Context |
| :--- | :--- | :--- |
| `MOCK_PROJECTS` | **Database**: Supabase `projects` table (filtered by owner).<br/>**Access**: `supabase.from('projects').select('*')` | Entire layout remains a purely Server-Rendered Component (RSC). |
| `MOCK_SUBMISSIONS` | **Database**: Supabase `submissions` table.<br/>**Access**: `supabase.from('submissions').select('*')` | Entire layout remains an RSC. |
| `DEMO.ALERT` | **Database**: Dynamic query identifying submissions in `failed` or `unsupported` state awaiting triage. | Handled via the Dashboard RSC view model. |
| `DEMO.USER` | **Database**: `profiles` table and `subscriptions` table (checking `unlocks_total` vs `unlocks_used`). | Handled purely inside RSC view models. |
| `MOCK_PREVIEW_REPORT` | **Database**: Supabase `reports` and `rule_results` tables.<br/>**Access**: Server-side derivation checking if the user owns the submission. If not unlocked, the derived payload explicitly truncates or masks `rule_results`. | Must load via Server Component to enforce gating, passing truncated issues to the client report UI. |
| `MOCK_FULL_REPORT` | **Database**: Supabase `reports` and `rule_results` tables.<br/>**Access**: Strict server-side authorization check asserting ownership and an unlocked state. Only delivers full payload if authorized. | Must load via Server Component to safely retrieve gated records. |
| `MOCK_BILLING_TRANSACTIONS` | **Database**: Read strictly from the app's `billing_events` ledger / view-model source first, which is kept in sync via Stripe Webhooks. | Load via RSC. The presentation remains static until user requests to update a card. |
| `STATUS_PROGRESSION` (Simulation) | **Infrastructure**: **Preferred:** Supabase Realtime channel subscription targeting `submissions.status`.<br/>**Fallback**: Standard API polling. Both listen to mutations driven by the Python Worker. | Component `<ProcessingView />` must stay Client-Side to subscribe to events. |

## 2. Migration Order & Safe Strategy

To prevent visual drift or disruption of the prototype flow, the mock layer should be extracted sequentially using the new structural wrapper patterns. 

### Phase 1: Core Navigation (Safest)
1. **Projects (`app/projects/page.tsx`)**
   - Update `lib/view-models/projects.ts` to `await supabase.from('projects').select()`.
   - Remove `MOCK_PROJECTS` binding in this facade.
2. **Dashboard (`app/dashboard/page.tsx`)**
   - Update `lib/view-models/dashboard.ts` to execute an aggregate query for Project count and latest Submissions limit.
3. **Submissions Log (`app/submissions/page.tsx`)**
   - Replace the `MOCK_SUBMISSIONS.map` within the loader to execute `supabase.from('submissions')`.

### Phase 2: Processing & Submission Handlers
4. **New Submission Wizard (`components/submissions/NewSubmissionForm.tsx`)**
   - Replace the simulated `setTimeout` route push with an orchestrated sequence:
     1. Submission record creation via Supabase RPC/API.
     2. File upload and storage to Supabase Storage buckets.
     3. Uploaded file records generated mapped to the submission.
     4. Python worker enqueue via database trigger or dedicated webhook.
     5. Next.js router redirect to the processing loop view.
   - Remains a state-heavy client component.
5. **Processing View (`components/submissions/ProcessingView.tsx`)**
   - Strip out the `STATUS_PROGRESSION` interval array.
   - **Preferred approach:** Implement Supabase Realtime bindings listening to `UPDATE` events on the generated `submission_id`.
   - **Fallback approach:** Interval API polling to the `/api/submissions/[id]/status` route.

### Phase 3: Reports & Paywall (Most Complex)
6. **Reports (`app/submissions/[id]/report/page.tsx`)**
   - Require strong server-side validation against `isUnlocked`.
   - Substitute `MOCK_PREVIEW_REPORT` and `MOCK_FULL_REPORT` with authorized API calls ensuring that `full` data payloads never touch the client if `unlocked == false`. We highly recommend refactoring this report route to a primary RSC structure before wiring the database.

### Phase 4: Preferences & Billing
7. **Billing (`app/billing/page.tsx`)**
   - Replace `MOCK_BILLING_TRANSACTIONS` inside `lib/view-models/billing.ts` with direct reads from the localized `billing_events` database ledger rather than fetching straight from Stripe API calls.
8. **Settings (`app/settings/page.tsx`)**
   - Map the `SettingsForm` inputs back to Supabase API patches to alter `profiles` records natively.

## 3. Structural Rules during Implementation
* Keep routes structured as React Server Components where currently defined. Data fetching MUST stay inside `lib/view-models/*` to keep the JSX trees visually identical to the mocks.
* If a component requires direct mutation or API integration involving user input, it MUST be wrapped in a specific client-side shell (e.g. `SettingsForm.tsx` & `ToggleSwitch.tsx`) rather than converting the entire top-level routed `layout.js` or `page.js` to the client.
