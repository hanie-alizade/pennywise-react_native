# Plan

Six phases, eighteen steps. Phases are built in order, one step at a time. One branch per phase (`phase-N-short-name`), one commit per step. Every step ends with `npm run check` passing and a decision record in `docs/decisions/` (see `docs/CONVENTIONS.md` section 10). No automated tests in this repo.

Status: **Phase 2 complete** (update at the end of each phase).

| Phase | Steps | Branch | Status |
| --- | --- | --- | --- |
| 1 Foundation and UI kit | 1.1 Scaffold, 1.2 Theme and core UI, 1.3 Inputs and lists | `phase-1-foundation-ui` | done |
| 2 Routing and API layer | 2.1 Routing, 2.2 Contract and config, 2.3 HTTP client | `phase-2-routing-api` | done |
| 3 Server state and auth | 3.1 Query setup, 3.2 Auth core, 3.3 Auth screens and gate | `phase-3-server-state-auth` | planned |
| 4 Month overview | 4.1 Helpers, 4.2 Month data and navigation, 4.3 Overview UI | `phase-4-month-view` | planned |
| 5 Writes | 5.1 Transactions: read and create, 5.2 Edit, delete, Expected, 5.3 Categories and new month | `phase-5-writes` | planned |
| 6 Robustness and polish | 6.1 Mobile lifecycle, 6.2 States audit, 6.3 Accessibility, README, docs | `phase-6-robustness-polish` | planned |

Each step lists: **Scope**, **Acceptance**, and **Decisions to record** (the minimum the decision record must cover).

---

## Phase 1 — Foundation and UI kit

### Step 1.1 — Scaffold and tooling
**Scope**
- Inspect the repo and `git status`. If an Expo project already exists, audit it against this list and fill only the gaps.
- Expo + TypeScript strict, Expo Router, `@/` alias to `src` (tsconfig and Metro), folder skeleton from `docs/ARCHITECTURE.md` (barrel `index.ts` only where it will be used).
- ESLint (`eslint-config-expo`) + Prettier. Scripts: `typecheck`, `lint`, `check:rules` (`scripts/check-rules.mjs`: hex colors outside `src/theme`, `@ts-ignore`, `parseFloat` near money, `console.log`), `check`.
- `.gitignore`, `.env.example` (placeholder `EXPO_PUBLIC_API_URL`), short README placeholder.

**Acceptance:** `npm run check` passes; the default screen runs in Expo Go.
**Out of scope:** theme, UI components, navigation structure.
**Decisions to record:** Expo SDK/template chosen and why; alias setup; which lint rules are custom; what `check:rules` covers and its limits; package manager.

### Step 1.2 — Theme and core UI
**Scope**
- `src/theme`: colors, spacing scale, radius, typography variants, barrel.
- `src/components/ui`: `AppText` (variants `title`, `body`, `label`, `mono`), `Screen` (safe area, optional scroll, `KeyboardAvoidingView` with correct `Platform` behavior), `Button` (`Pressable`; pressed, disabled and loading states; accessibility role and label).
- Replace the default home screen with a temporary demo of every `AppText` variant and `Button` state.

**Acceptance:** demo renders on a phone; no hex colors or magic numbers outside `src/theme`; check passes.
**Decisions to record:** token structure; why `Pressable`; how `Screen` handles safe area and keyboard on each platform; variant API of `AppText` and `Button`.

### Step 1.3 — Inputs and lists
**Scope**
- `TextField` (controlled; label, error text, helper; `keyboardType`, `secureTextEntry`, `autoCapitalize` props; accessibility label/hint), `Card`, `Badge`.
- Temporary demo screen: a form with `TextField` (valid and error state) and a `FlatList` of about 200 fake rows with `keyExtractor`, `ItemSeparatorComponent` and `ListEmptyComponent`. Mark it temporary; it is removed in Step 2.1.

**Acceptance:** the keyboard does not cover inputs; the list scrolls smoothly; check passes.
**Decisions to record:** `TextField` controlled-API shape; where error styling lives; `FlatList` configuration choices.

---

## Phase 2 — Routing and API layer

### Step 2.1 — Routing skeleton
**Scope**
- Implement the route map from `docs/ARCHITECTURE.md`: `app/_layout.tsx`, `(auth)/sign-in|sign-up`, `(app)/(tabs)/index|categories|settings`, `line/[id]`, `add-transaction` (modal), `new-month` (modal). Placeholders only (`Screen` + `AppText`).
- Typed routes enabled. The overview reads `year`/`month` params and displays them. No auth gate yet: root redirects to `(app)`.
- Remove the temporary demos from Steps 1.2 and 1.3.

**Acceptance:** switch tabs; open both modals; `/line/123` shows the id; `/?year=2026&month=10` shows the params.
**Decisions to record:** group and layout structure; modal presentation; param handling and typing; how typed routes are enabled; deviations from the planned route map.

### Step 2.2 — Contract and config
**Scope**
- Stop and report if `docs/openapi.yaml` is missing.
- `src/config/env.ts` (Zod-parsed `EXPO_PUBLIC_API_URL`).
- `api:types` script (openapi-typescript) producing `src/types/api.generated.ts`; `src/types/index.ts` with readable aliases.
- `mock` script (Prism, dev dependency) serving `docs/openapi.yaml`.
- `src/constants`: `errorCodes`, `storageKeys`, category type and other fixed values as `as const` objects. `src/schemas/errorSchema.ts`. Barrels.

**Acceptance:** `npm run api:types` and `npm run mock` work; check passes.
**Decisions to record:** codegen vs hand-written types; mock server limits; env validation behavior on failure; `as const` objects vs enums.

### Step 2.3 — HTTP client
**Scope**
- `src/api/client.ts`: `request<T>(method, path, { body, query, auth })`, `ApiError { status, code, message, details }`, timeout via `AbortController`, non-2xx parsed with `errorSchema`, network failure mapped to `ApiError` with code `NETWORK_ERROR`, and `configureAuth({ getAccessToken, refresh, onSignedOut })` with hook points only (refresh logic arrives in Step 3.2).
- `src/helpers/errors.ts`: `getErrorMessage`, `isNetworkError`, `getFieldErrors`.
- `src/api`: `authApi`, `categoriesApi`, `monthsApi`, `budgetLinesApi`, `transactionsApi` (typed from generated types), barrel.
- `src/constants/queryKeys.ts` per `docs/ARCHITECTURE.md`.
- No UI changes.

**Acceptance:** check passes; every API function has a precise return type.
**Decisions to record:** `fetch` vs Axios/Ky; timeout value and mechanism; error normalization shape; how `configureAuth` avoids a circular import; whether responses are validated at runtime or trusted from generated types.

---

## Phase 3 — Server state and auth

### Step 3.1 — Query setup
**Scope**
- `src/providers/Providers.tsx` with `QueryClient` defaults from `docs/ARCHITECTURE.md` (`staleTime` 30 s, no retry on 4xx, limited retry on network errors).
- `src/apiHooks/useCategories`; `StateBlock` (loading, error with retry, empty).
- Categories tab: read-only `FlatList` with pull-to-refresh using `useCategories`. Point `EXPO_PUBLIC_API_URL` at the mock server for this step.

**Acceptance:** list, loading, error (stop the mock), empty and pull-to-refresh all visible.
**Decisions to record:** `QueryClient` defaults and their reasons; retry policy; `StateBlock` API; where pull-to-refresh state comes from.

### Step 3.2 — Auth core (no screens)
**Scope**
- `src/storage/tokenStorage.ts` (`expo-secure-store`; values parsed defensively).
- `src/providers/AuthProvider.tsx`: status machine `loading | signedIn | signedOut`, `signIn`, `signUp`, `signOut`, user/workspace via `useMe`, `configureAuth` wiring.
- Client: access token in memory; on 401 (not from `/auth/*`) one shared refresh (single-flight), retry the original request once; on failure clear storage and go `signedOut`.
- No UI changes besides wiring the provider.

**Acceptance:** check passes; the decision record explains how concurrent 401s are handled.
**Decisions to record:** SecureStore vs AsyncStorage; token placement (memory vs storage); single-flight design; behavior when refresh fails or the network is down at startup; context shape.

### Step 3.3 — Auth screens and gate
**Scope**
- `signInSchema`, `signUpSchema` (mirror API rules). Sign-in and sign-up screens: React Hook Form + `Controller` + `zodResolver`; API `details[]` mapped with `setError`; other errors in a form-level `Banner`; loading state on submit.
- Root layout: splash while status is `loading`; redirect by status using the mechanism recommended in the current Expo Router docs (record which).
- Settings tab: Sign out (`POST /auth/logout` best effort, clear SecureStore and the query cache).

**Acceptance:** sign up, close the app, reopen and still be signed in; sign out returns to sign-in; wrong password shows an inline error.
**Decisions to record:** route-guard mechanism; form library choice; how server errors map to fields; what is cleared on sign-out.

---

## Phase 4 — Month overview

### Step 4.1 — Money and dates helpers (pure, no React)
**Scope**
- `src/helpers/money.ts`: `parseMoneyToMinor(input, currency)` (accepts "12.5" and "12,50", rejects garbage, no floats, currency-aware decimals via `Intl`), `formatMoney(amountMinor, currency)`.
- `src/helpers/dates.ts`: `getLocalDateString`, `getCurrentYearMonth`, `isDateInMonth`, `getMonthLabel`. Never `toISOString()` for calendar dates.
- Barrel export. No tests (project rule): list manual example inputs and outputs in the decision record.

**Acceptance:** check passes; edge cases handled (empty string, "1,234.50", too many decimals, negative, zero).
**Decisions to record:** parsing rules and ambiguity of `,` vs `.`; how currency digits are derived; why calendar dates are strings; locale handling.

### Step 4.2 — Month data and navigation
**Scope**
- `useMonths`, `useMonth(year, month)` (404 means the month does not exist yet and is a normal state), `hooks/useMonthParams` (params are the source of truth; default is the local current month).
- `components/months/MonthSwitcher` (previous/next, label via `getMonthLabel`).
- Overview tab: loading and error states; "Create this month" call to action opening the new-month modal when the month does not exist. The month body is a temporary summary line.

**Acceptance:** switching months updates the params and refetches; a missing month shows the call to action.
**Decisions to record:** how 404 is modeled in the hook; param parsing and invalid-param handling; query key shape; previous-data behavior while switching.

### Step 4.3 — Overview UI
**Scope**
- `SectionList` (income and expense sections). `CategoryRow` (computed parent row: read-only and visually different), `LineRow` (Actual unset shows an em dash, not 0).
- `MonthSummary` card: totals and difference with the sign convention from `docs/PROJECT_CONTEXT.md` 6.6, and a "no data yet" state when the API reports no Actual. The client never recomputes totals. Currency from `useMe`.

**Acceptance:** parents never double-count; amounts formatted with `Intl`.
**Decisions to record:** `SectionList` data shaping; how read-only vs editable is signalled (not by color alone); where formatting happens; memoization (only if measured).

---

## Phase 5 — Writes

### Step 5.1 — Transactions: read and create
**Scope**
- `line/[id]` screen: Expected, transactions list (`useTransactions`, `FlatList`, all states).
- `add-transaction` modal: React Hook Form + `Controller` + Zod; amount via `parseMoneyToMinor`; date defaults to local today; validate same year/month as the line before submit; `useMutationCreateTransaction`; invalidate `queryKeys.months.all` and the line's transactions; close on success; inline errors; no optimistic update.

**Acceptance:** adding a transaction changes Actual and totals on the overview without a manual refresh.
**Decisions to record:** invalidation scope; same-month validation on client vs server; date default; why no optimistic update; keyboard and modal behavior.

### Step 5.2 — Edit, delete, Expected
**Scope**
- Edit transaction (reuse the form), delete with a confirmation `Alert`, mutations with correct invalidation.
- Set Expected on an editable line (same mutation pattern). Show API rule errors in a `Banner`.

**Acceptance:** edit and delete update totals; parent lines stay read-only.
**Decisions to record:** form reuse strategy; confirmation UX; how mutation state is surfaced; error display rules.

### Step 5.3 — Categories and new month
**Scope**
- Categories tab: create category, create subcategory, archive. Map `CATEGORY_HAS_DATA` to a clear message ("move or delete those first"). Do not expose `addToMonth` in the UI (open item 5 in `docs/PROJECT_CONTEXT.md`, default: not exposed).
- `new-month` modal: optional "copy Expected from <month>"; invalidate months and categories keys as needed. Split components sensibly (container vs form).

**Acceptance:** creating a month with copy shows Expected values and unset Actual; the source month is unchanged.
**Decisions to record:** component split and state ownership in the modal; how conflict errors reach the UI; invalidation per mutation.

---

## Phase 6 — Robustness and polish

### Step 6.1 — Mobile lifecycle
**Scope**
- Install `@react-native-community/netinfo` (approved). Wire `onlineManager` to NetInfo and `focusManager` to `AppState`. `OfflineBanner`. `ErrorBoundary` at the root with a friendly fallback.

**Acceptance:** airplane mode shows the banner and pauses refetching; returning from background refetches stale queries.
**Decisions to record:** how online/focus are wired; what the error boundary does and does not catch; banner placement.

### Step 6.2 — States audit
**Scope**
- Failed submit keeps the typed input, shows the error and allows retry (all forms).
- Audit every screen for loading, error, empty and offline states; add retry and pull-to-refresh where missing. List what changed.

**Acceptance:** submitting with the server down preserves the input.
**Decisions to record:** the state matrix per screen; retry behavior; any screen intentionally left without a state and why.

### Step 6.3 — Accessibility, README, docs
**Scope**
- Accessibility pass: labels, roles, touch targets, font scaling does not break layout. App icon and splash via app config (placeholders if no assets).
- Public README: setup, env vars, running with Expo Go, architecture overview and layering rationale (including why there is no `domain/` layer and no tests), honest feature list (no fabricated metrics), and an empty "Challenges and lessons" section for the author.
- Update `docs/ARCHITECTURE.md` to "as built" and the statuses in this file.

**Acceptance:** `npm run check` passes; README steps work from a clean clone.
**Decisions to record:** accessibility fixes made; known gaps; README claims and how each was verified.

---

## Cut order (if time is short)
1. Rename and archive screens for categories (keep create). 2. Icon and splash polish in 6.3. 3. Pull-to-refresh on secondary screens. Never cut: auth, month overview, add transaction, error/empty/offline states.

## Done criteria for the MVP app
Sign up/in/out works on a real device; the month overview shows correct totals from the API; adding, editing and deleting a transaction updates the overview; creating a month with copy works; every screen has loading, error, empty and offline states; `npm run check` passes.
