# Architecture

Status: **planned**. Sections are updated to "as built" at the end of each phase. Product rules live in `docs/PROJECT_CONTEXT.md`; API shapes in `docs/openapi.yaml`.

## Goals

- Small, readable app that is easy to explain and to maintain.
- The server is the authority (rules, totals, permissions). The app displays, collects input, and shows clear states.
- One place for each concern: HTTP, server state, forms, theme, navigation.

## Layers

```
Routes (app/**)                      thin: read params, render a screen
   |
Feature components (src/components/<feature>) and UI kit (src/components/ui)
   |
apiHooks (TanStack Query)            useMonth, useMutationCreateTransaction, ...
   |
api (fetch client + <area>Api)       request(): token, timeout, error mapping
   |
Pennywise REST API (private backend)

Shared: constants -> schemas -> types -> helpers, theme   (pure, no React)
Platform: storage/tokenStorage (SecureStore), config/env, providers/*
```

Why these layers: components never know about HTTP; `apiHooks` own caching and invalidation; `api` knows nothing about React. Each layer can be explained and changed alone.

## Route map (Expo Router, planned; adjust in Phase 2)

```
app/
  _layout.tsx                 Providers + auth gate (signed in -> (app), else (auth))
  (auth)/
    _layout.tsx               stack
    sign-in.tsx
    sign-up.tsx
  (app)/
    _layout.tsx               stack (holds tabs + modals)
    (tabs)/
      _layout.tsx             tab bar
      index.tsx               Month overview (params: year, month; default local current month)
      categories.tsx          categories and subcategories
      settings.tsx            account, sign out
    line/[id].tsx             one budget line: Expected, transactions list
    add-transaction.tsx       modal (param: lineId)
    new-month.tsx             modal (create month, optional copy)
```

URL/params are the source of truth for the selected month: `?year=2026&month=10`. Only ids and simple values are passed between screens.

## Folder layout (planned)

```
app/                         routes only
src/
  api/        client.ts, authApi.ts, categoriesApi.ts, monthsApi.ts, budgetLinesApi.ts, transactionsApi.ts, index.ts
  apiHooks/   useMe, useCategories, useMonths, useMonth, useTransactions, mutations (useMutationXxx), index.ts
  components/
    ui/       AppText, Screen, Button, IconButton, TextField, Card, Badge, ...
    icons/    Icon.tsx
    common/   StateBlock (loading/empty/error), ErrorState, EmptyState, Banner, OfflineBanner
    months/   MonthSwitcher, MonthSummary, CategoryRow, LineRow, ...
    transactions/ TransactionRow, TransactionForm
    categories/   CategoryList, CategoryForm
  config/env.ts
  constants/  index.ts, queryKeys.ts, storageKeys.ts, errorCodes.ts
  schemas/    authSchema.ts, transactionSchema.ts, categorySchema.ts, errorSchema.ts, envSchema.ts
  types/      api.generated.ts (generated), index.ts, common.ts
  helpers/    money.ts, dates.ts, errors.ts
  hooks/      useDebouncedValue.ts, useMonthParams.ts, ...
  providers/  Providers.tsx, AuthProvider.tsx
  storage/    tokenStorage.ts
  theme/      colors.ts, spacing.ts, typography.ts, index.ts
docs/         PROJECT_CONTEXT.md, openapi.yaml, CONVENTIONS.md, ARCHITECTURE.md, PLAN.md, decisions/
scripts/      check-rules.mjs
```

## API client

- `request<T>(method, path, { body, query, auth })` in `src/api/client.ts`.
- Base URL from `src/config/env.ts` (`EXPO_PUBLIC_API_URL`, Zod-parsed). On a phone, `localhost` means the phone itself: use the computer's LAN IP or a tunnel for local backends; a mock server may also be used (Phase 2).
- Timeout through `AbortController`. Non-2xx responses are parsed with `errorSchema` into `ApiError { status, code, message, details }`. Network failures become `ApiError` with code `NETWORK_ERROR` so the UI can show a no-internet state.
- `configureAuth({ getAccessToken, refresh, onSignedOut })` is called once by `AuthProvider`. This avoids a circular import between `api` and `providers`.

## Auth flow

- Access token (short-lived JWT) is kept **in memory**. Refresh token is stored with **expo-secure-store** (key in `constants/storageKeys.ts`). Never AsyncStorage for tokens.
- App start: `AuthProvider` status is `loading`. If a refresh token exists: `POST /auth/refresh` then `GET /me`. Result: `signedIn` or `signedOut`. The root layout shows a splash/loading view until it is resolved.
- On a `401` (not from `/auth/*`): the client runs **one shared refresh** (single-flight: concurrent 401s wait for the same promise), then retries the original request once. If refresh fails: clear storage, status `signedOut`.
- Sign-out: `POST /auth/logout` (best effort), clear secure store and the query cache.
- Route protection: the root layout redirects based on status (check the current Expo Router docs for the recommended mechanism, e.g. protected routes or `Redirect`).

## Server state (TanStack Query)

- `QueryClient` defaults: `staleTime` 30 s; no retry on 4xx; retry network errors a small number of times.
- Query keys only from `constants/queryKeys.ts`, e.g. `queryKeys.months.detail(year, month)`, `queryKeys.categories.list(includeArchived)`, `queryKeys.lines.transactions(lineId)`.
- Reads: `useMe`, `useCategories`, `useMonths`, `useMonth(year, month)` (404 = month does not exist yet: show "Create this month"), `useTransactions(lineId)`.
- Writes (`useMutationXxx`) call the API, then invalidate by key prefix:
  - create/edit/delete transaction -> `queryKeys.months.all` (the month view contains totals) and the line's transactions;
  - set Expected, add/remove line -> `queryKeys.months.all`;
  - create month -> `queryKeys.months.all`;
  - category changes -> `queryKeys.categories.all` (and months if `addToMonth` was used).
- No optimistic updates by default: the server computes totals, so the UI waits for the answer.
- Mobile specifics (Phase 6): `focusManager` wired to `AppState` (refetch when the app returns to foreground) and `onlineManager` wired to NetInfo (pause/resume when offline).
- Error handling: query errors render `ErrorState` with retry; mutation errors show an inline `Banner` or field errors; never show success for a failed write. No offline write queue (out of scope).

## Dates and money

- `helpers/dates.ts`: `getLocalDateString(date?)` builds `YYYY-MM-DD` from local getters; `getCurrentYearMonth()`; `isDateInMonth(dateString, year, month)`; `getMonthLabel(year, month, locale?)`. Calendar dates are never converted with `toISOString()`. Timestamps from the API (`createdAt`) are ISO UTC and only converted for display.
- `helpers/money.ts`: `parseMoneyToMinor(input, currency)` (accepts "12.5", "12,50", rejects garbage, no floats), `formatMoney(amountMinor, currency)` via `Intl.NumberFormat`. Decimals depend on currency (derive digits from `Intl`).
- The currency comes from `GET /me` (`workspace.currency`).

## Theme

`src/theme` is the single source of truth for design tokens (light mode; dark mode is post-MVP):
- **Colors (`colors.ts`):** Calm teal and mint brand palette (`primary` #075B59, `accent` #55BFAF), off-white surfaces (`background` #F7F8F7, `surface` #FFFFFF), slate support colors (`support` #64758B), and muted financial semantic colors (`income` #27866F, `expense` #C96F68, `warning` #B9853D, `info` #647D98).
- **Typography (`typography.ts`):** Modular size and line-height scale with preconfigured variants (`title`, `body`, `label`, `mono`) consumed via `AppText`.
- **Spacing & Radius (`spacing.ts`, `radius.ts`):** 4px to 48px spacing scale, minimum 44px touch target token, and rounded corner radius tokens.
- **Shadows (`shadows.ts`):** Restrained elevation/shadow objects for cards and floating elements using `colors.shadow`.
- **Core UI kit (`src/components/ui`):** `AppText` (enforces typography hierarchy and scaling), `Screen` (safe area, keyboard avoidance, optional scroll), and `Button` (accessible `Pressable` with pressed, disabled, loading states). Platform-specific values are hidden inside theme or UI kit.

## Forms

React Hook Form + `Controller` + `zodResolver`. Schemas in `src/schemas` mirror API rules. Submit calls a `useMutationXxx` hook; API `details[]` (path/message) are mapped to fields with `setError`; other errors go to a form-level `Banner`.

## Mock backend (while the real one is not ready)

A mock server generated from `docs/openapi.yaml` (Prism, dev tool) serves canned responses. Switch by changing `EXPO_PUBLIC_API_URL`. The mock is for UI work; it does not enforce business rules. Do not rely on it for auth behavior or rule errors.

## Key function contracts (paths are stable; adding exports is fine)

```
src/config/env.ts              env: { apiUrl }
src/api/client.ts              request<T>(...), configureAuth(...), class ApiError
src/helpers/money.ts           parseMoneyToMinor, formatMoney
src/helpers/dates.ts           getLocalDateString, getCurrentYearMonth, isDateInMonth, getMonthLabel
src/helpers/errors.ts          getErrorMessage(error), isNetworkError(error), getFieldErrors(error)
src/storage/tokenStorage.ts    getRefreshToken, saveRefreshToken, clearRefreshToken
src/providers/AuthProvider.tsx useAuth() -> { status, user, workspace, signIn, signUp, signOut }
src/constants/queryKeys.ts     queryKeys
```

## Why there is no `domain/` layer

Business rules (totals, parent/subcategory sums, month copy, permissions) live on the server, which is the authority. The client only displays, collects input and previews. The only client-side logic is pure formatting/parsing in `src/helpers` (money, dates, errors). If client-side rules ever appear (for example offline writes), a pure `src/domain` layer would be added then.

## Decision records

Every finished step has a record in `docs/decisions/<step>-<slug>.md` (template: `docs/decisions/TEMPLATE.md`). It lists what was built, the decisions taken with the alternatives considered, trade-offs, gotchas and known limitations. This document describes the current shape; the records explain how and why it got there.
