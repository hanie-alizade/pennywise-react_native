# Pennywise — Project Context (v2, current)

**Purpose:** This is the single source of truth for the product and architecture of Pennywise. Read it before proposing architecture, changing files, or implementing features. Preserve the confirmed rules below. Anything in section 11 ("Still open") must not be silently decided: recommend a simple default, explain the trade-off, and wait for approval.

Related files:
- `openapi.yaml` — the API contract (request/response shapes, error codes).
- `BACKEND_AGENT_PLAN.md` — step-by-step backend implementation plan (backend repo only).
- Mobile repo only: `AGENTS.md`, `docs/CONVENTIONS.md`, `docs/ARCHITECTURE.md`, `docs/PLAN.md` (phases and steps), `docs/decisions/` (one decision record per finished step).

## 1. Overview

Pennywise is a personal budgeting and expense-tracking mobile app that replaces the creator's Google Sheets budget tracker with something faster and more structured.

Two goals:
1. Solve a real personal budgeting need.
2. Be a polished GitHub portfolio project (React Native, TypeScript, Node.js, REST API design, authentication, PostgreSQL).

It is a personal and portfolio project, not a commercial product. Prefer practical, understandable, low-cost solutions over enterprise complexity. Free hosting tiers are preferred, but never claim they are free forever; check current quotas and terms before relying on them.

## 2. Repositories and roles

- **Mobile repo — PUBLIC** (portfolio). React Native + Expo + TypeScript. Built by the creator together with an AI coding agent in small, reviewable steps (`docs/PLAN.md`). Every step ends with a decision record in `docs/decisions/` and a suggested commit message. The repo favors simple, explainable code over feature count.
- **Backend repo — PRIVATE.** Node.js + Express + PostgreSQL. Written mainly by an AI coding agent so the creator can focus on mobile. May become public later.
- The two repos are separate. The **API contract (`openapi.yaml`)** is the interface between them; a copy lives in the mobile repo and TypeScript types are generated from it. The mobile repo must never contain backend secrets or private backend code.

## 3. Product principles

- Useful for real monthly budgeting, not just a demo.
- Users choose how much detail to track (categories with or without subcategories).
- Never double-count a parent category and its subcategories.
- Each month is independent and stays accurate as history.
- **Expected** = the plan/budget. **Actual** = what really happened, calculated from transactions.
- Adding a purchase must be effortless: the user enters only the new amount and the app adds it to the running total. The user should never have to do mental arithmetic or retype a combined total (the pain point of the spreadsheet).
- Online-first with a central server database. No offline-first requirement in v1.
- Usable from anywhere in the world: nothing may depend on a specific country, timezone, or currency format.
- Maintainable and easy to explain in a repository README.

## 4. Technology

### Mobile
- React Native, Expo, TypeScript, Expo Router (confirm against the existing repo before adding or replacing navigation).
- Standard React Native components as the UI foundation. Do **not** add Expo UI just because a tutorial uses it.
- Server state: TanStack Query. Forms: React Hook Form + Zod. Tokens in `expo-secure-store` (not AsyncStorage). All network calls go through one API-client module.
- Prefer Expo Go; use a Development Build only when a dependency requires it.
- The creator develops on Windows with physical Android and iOS devices; **no paid Apple Developer membership, no Mac/Xcode.** Never make paid Apple tooling a prerequisite.
- Add a library only after explaining its benefit; choose the smallest coherent toolset.
- **No automated tests in the mobile repo** (creator's decision). Verification there is typecheck + lint + running on a device.

### Backend
- Node.js + Express (REST), TypeScript strict, Zod for runtime validation.
- ORM: **Drizzle** with migrations (decision made).
- Tests: Vitest + Supertest.
- No WebSockets. No process-local state may be required for correctness.

### Database and hosting
- PostgreSQL on Neon (pooled connection string at runtime; direct string for migrations). Neon free compute can scale to zero, so the first request after inactivity may be slow.
- API on Vercel Functions (serverless; subject to current Hobby-plan terms). Keep requests short; manage DB connections for serverless; never rely on in-memory state.
- The mobile app talks only to the API over HTTPS and never to the database.

Architecture: `Expo app → HTTPS REST API (Express on Vercel) → Neon PostgreSQL`.

If there is no internet, reads/writes fail. Show a clear connection/error state; never pretend a write succeeded.

## 5. Data and money rules

- **Money:** integer minor units (e.g. sen), end to end. No floating-point money. Format on the client with `Intl.NumberFormat` (decimals differ per currency).
- **Currency:** stored per workspace (default MYR). No mixing currencies in totals. A configurable-currency UI is post-MVP.
- **Dates are calendar dates, not instants.** A transaction date is `YYYY-MM-DD` in the user's local calendar, stored as a PostgreSQL `date`. The **mobile app always sends it** (defaulting to the user's local today); the **server never guesses "today"** and never needs to know the user's location. Beware `toISOString()` in JavaScript — it converts to UTC and can shift the date. Use local date getters or a date library.
- Months are `(year, month)` integers with no timezone.
- `created_at`/`updated_at` are `timestamptz` (UTC).

## 6. Functional rules (confirmed)

### 6.1 Accounts, workspaces, isolation
- Registration, sign-in, sign-out; the same account works on multiple devices.
- **Workspace model from day one.** Budget data belongs to a **workspace**, not directly to a user. Users belong to workspaces through **memberships** (`owner` | `member`). On registration the server creates a personal workspace and makes the user its owner. In the MVP the user never sees or manages workspaces; each user has exactly one.
- Post-MVP, an owner can invite a partner to the same workspace (each person signs in with their own account and token). The data model already supports this; the invite UI and endpoints are not in the MVP.
- Identity comes only from the verified access token. The workspace is derived from the user's membership. **Never trust a client-supplied user or workspace id.**
- A user can never read or modify another workspace's data by changing an ID. Records in another workspace return **404** (not 403).
- Auth: custom email + password; short-lived JWT access token and rotating opaque refresh token stored hashed (one per device). Password hashing with argon2id or bcrypt. Rate-limit auth endpoints. Never log passwords, tokens, or financial data.

### 6.2 Categories
- Income and expense categories; fully customizable (no rigid default tree; a starter set may be offered later).
- Optional subcategories; users may add an "Other …" subcategory.
- Category type, ordering, and archive state are modeled explicitly. **Categories are archived, never hard-deleted**, so history stays intact.
- New categories/subcategories appear in a month only when added to it explicitly (or via the optional "add to this month" option at creation). Archived items still show in old months that contain them and are not auto-added to new months.

### 6.3 Expected, Actual, and transactions
- Each month has **budget lines**. A line holds an **Expected** amount (nullable, set by the user).
- **Actual is not stored.** It is the sum of the line's **transactions**. A line with no transactions has Actual **unset (null)**, which is different from 0.
- A transaction: positive integer amount + calendar date (+ who created it). Income categories use transactions too (e.g. salary). The category type determines the meaning.
- A transaction's date must fall in the **same year and month** as its budget line's month (otherwise the API returns an error). So a purchase from 28 September entered on 1 October goes into the September month with the correct date.
- MVP transaction features: add, list, edit, delete. No attachments, no notes.

### 6.4 Parent/subcategory rule (anti double-counting)
- A category with **no** subcategories carries Expected and transactions directly.
- A category with **any** subcategory carries them only on its subcategories; its own Expected/Actual are **computed, read-only** sums. Overall totals use leaf lines only.
- A category that has ever had a subcategory stays a parent in the MVP.
- Adding the first subcategory to a category that already holds an Expected amount or transactions is **blocked** with a clear error ("move or delete those first"). A guided conversion flow is post-MVP.
- Computed parent values must look visibly different from editable values in the UI.

### 6.5 Months and history
- Budgeting is organized by month; every month stays available as history; the user can move between months.
- Creating a month is an **explicit action**, optionally "copy from another month". It runs atomically.
- Copy rule: copy **Expected** only (for active categories/subcategories); **never copy transactions**, so Actual starts unset. The source month is never changed and copies share no mutable records.
- Creating a month without copying creates empty lines for all active categories/subcategories.

### 6.6 Summary
- Per month: totals of Expected and Actual for income and for expenses; differences; net.
- Sign convention: **expense** difference = expected − actual (positive = remaining, negative = overspent). **Income** difference = actual − expected.
- Unset Actual is treated as 0 in totals but the API also reports whether any Actual exists, so the UI can show "no data yet" instead of a misleading "0 spent".
- Start with accurate calculations and a clear monthly overview before adding charts.

## 7. Scope

### MVP (in scope)
- Expo + React Native + TypeScript app; Express + PostgreSQL API with migrations.
- Register/sign-in/sign-out, multi-device, workspace-scoped isolation (single personal workspace per user).
- Customizable income/expense categories with optional subcategories; archive.
- Monthly Expected values; transaction-based Actual (add, list, edit, delete) with automatic totals.
- Parent totals computed from subcategories.
- Month navigation/history; create month with optional copy of Expected.
- Monthly summary.
- Basic automated tests, documented setup, deployment.

### Post-MVP (design must not block these)
- Partner/household invites and member management; roles and permissions.
- Notes on budget lines or transactions.
- Charts and richer analytics; "who spent what" using `created_by`.
- Export/backup, account deletion.
- Dark mode and theming polish.
- Configurable currency.
- Moving transactions between lines; guided category-to-parent conversion.
- Attachments/uploads (ask first whether they belong to a line or a transaction).

### Explicitly out of scope for now
- Offline-first writes and sync queues; WebSockets/realtime; file uploads; background jobs; microservices; mandatory Expo UI; paid Apple tooling; rigid category tree.

## 8. UX direction
- Mobile-first, simple, polished. The main loop — pick a month, see Expected vs Actual, add a transaction in a couple of taps — must be fast.
- Clear hierarchy: categories, subcategories, totals, editable vs read-only values.
- Clear empty, loading, error, and no-internet states. Understandable validation errors.
- Don't lose a user's input on a failed request.
- Propose the main screen and monthly workflow before building the full UI.

## 9. Security and privacy
- Authorize every endpoint; validate and normalize all input on the server; use parameterized queries via the ORM; HTTPS in deployment.
- Keep secrets server-side and out of Git; provide `.env.example` with placeholders only.
- No analytics or third-party data sharing; never send financial data to external AI/analytics services.
- Don't leak whether a record exists in another workspace.

## 10. Quality and workflow rules
- Meaningful TypeScript types, plus runtime validation (Zod).
- Use database constraints for invariants where possible.
- Backend tests for: money math, parent/subcategory totals, month copy, transaction/month rule, workspace isolation, key routes. (The mobile repo has no automated tests.)
- README documents setup, env vars, migrations, test/lint/typecheck commands, deployment, and a concise architecture section.
- Never claim tests passed unless they were run and passed. Never fabricate metrics or features.
- **Never commit, push, or deploy automatically.** Suggest commit messages instead.
- Inspect the repo and `git status` first; preserve existing work; small reviewable steps; state which files change and why; don't introduce libraries or replace the stack without explaining why.

## 11. Still open (decide deliberately, don't assume)
1. Default/starter categories offered to new users (if any).
2. Main-screen design and visual style (propose before building).
3. Collaboration details for the post-MVP partner feature (permissions, leaving a workspace, one user in several workspaces).
4. Export/backup and account-deletion UX.
5. Whether to expose the optional "add to this month" flag in the first UI or just add lines manually.

## 12. Quick reference
- **Project:** Pennywise — personal Google Sheets replacement + portfolio.
- **Repos:** public mobile (Expo/RN/TS), private backend (Node/Express/Drizzle/Postgres).
- **Hosting:** Vercel Functions + Neon (check current terms).
- **Tenancy:** workspace + memberships; one personal workspace per user in MVP.
- **Money:** integer minor units; currency per workspace (MYR default).
- **Actual:** sum of transactions; unset ≠ 0.
- **Dates:** calendar `date`; client sends local date; server never guesses.
- **Critical rule:** parents are computed from subcategories; never double-count.
- **Month copy:** copy Expected only; transactions never copied; source untouched.
- **Out of MVP:** notes, partner UI, uploads, offline, realtime, charts.
