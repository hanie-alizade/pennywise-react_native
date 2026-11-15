# Conventions

Goal: code that is boring, consistent, and easy to explain. When in doubt, choose the simpler option. Rules marked **[lint]** are enforced by tools.

## 1. Naming

| Thing              | Style                                                                                    | Example                                                      |
| ------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Files              | component folder and file PascalCase; all other files camelCase                          | `Button.tsx`, `MonthSummary.tsx`, `useMonth.ts`, `money.ts`  |
| Route files        | Expo Router names under `app/` (`_layout.tsx`, `index.tsx`, `[id].tsx`, `(tabs)`)        | `app/(app)/(tabs)/index.tsx`                                 |
| Folders            | component folder PascalCase (if >1 file); other folders lowercase, one word if possible  | `components/ui`, `helpers`, `apiHooks`                       |
| Components         | PascalCase, one per file, named export                                                   | `TransactionRow`                                             |
| Hooks              | `useXxx`, file `useXxx.ts`                                                               | `useDebouncedValue`                                          |
| Query hooks        | `useXxx` (queries), `useMutationXxx` (mutations), in `src/apiHooks`                      | `useMonth`, `useMutationCreateTransaction`                   |
| Functions          | camelCase, start with a verb                                                             | `getLocalDateString`, `parseMoneyToMinor`                    |
| Variables          | camelCase nouns                                                                          | `expectedMinor`, `monthParams`                               |
| Booleans           | `is` / `has` / `can` / `should` prefix                                                   | `isLoading`, `hasSubcategories`                              |
| Types              | PascalCase, no `I` prefix, no `Type` suffix; `type` for data shapes                      | `Category`, `MonthView`                                      |
| Props types        | local to the component file, `interface <Component>Props`                                | `interface ButtonProps`                                      |
| Zod schemas        | `src/schemas`, camelCase + `Schema`; type inferred with the same base name               | `signInSchema` -> `type SignIn = z.infer<...>`               |
| Fixed values       | `src/constants`, `as const` objects; types derived                                       | `export const CATEGORY_TYPE = { INCOME: "income", EXPENSE: "expense" } as const;` |
| Money              | suffix `Minor`, integer minor units                                                      | `amountMinor`                                                |
| Dates              | calendar strings `YYYY-MM-DD` named `...Date`                                            | `transactionDate`                                            |
| API modules        | `src/api/<area>Api.ts`, functions named after the action                                 | `monthsApi.getMonth`, `transactionsApi.createTransaction`    |
| Query keys         | built only in `src/constants/queryKeys.ts`                                               | `queryKeys.months.detail(year, month)`                       |
| Error codes        | UPPER_SNAKE_CASE (from the API)                                                          | `CATEGORY_HAS_DATA`                                          |
| Event handlers     | `handleXxx` in the component, `onXxx` as props                                           | `handleSubmit`, `onPress`                                    |

Component names are plain domain nouns (`MonthSummary`, `TransactionRow`). No `App`, `My`, `Custom`, `Base` prefixes, no `Component` suffix. No abbreviations except `id`, `url`; write `quantity`, not `qty`. No names like `data`, `item`, `temp`.

## 2. Structure

```
app/                    Expo Router routes only (thin)
src/
  api/                  fetch client + per-area API modules
  apiHooks/             TanStack Query hooks
  components/{ui,icons,common,<feature>}
  config/               env.ts (Zod-parsed env)
  constants/            as-const objects, queryKeys.ts
  schemas/              Zod schemas (forms, error body, env)
  types/                shared types (api.generated.ts + aliases)
  helpers/              pure helpers (money, dates, errors)
  hooks/                client hooks (no server state)
  providers/            Providers, AuthProvider
  storage/              tokenStorage.ts (SecureStore)
  theme/                colors, spacing, typography, index
docs/
```

- Imports go only downwards: `constants -> schemas -> types -> helpers, theme -> storage, api -> apiHooks, hooks -> providers -> components -> app`.
- Import through barrels (`@/helpers`, `@/types`, `@/constants`, `@/schemas`, `@/api`, `@/apiHooks`, `@/hooks`, `@/providers`, `@/theme`). No deep imports into these folders. Use the `@/` alias (maps to `src/`), never `../../..` **[lint]**.
- Scope: used in more than one place -> shared folder; used by one component only -> next to it.
- A component gets its own folder only if it has more than one file.
- No empty files or folders. No `lib` folder.
- Size guidance (not lint errors): file up to 250 lines, component up to 150, function up to about 40, positional params up to 3.
- Pure logic (`helpers`) never imports React or React Native.
- No default exports, except Expo Router route files and config files **[lint]**.
- A route file (`app/**`) only reads params and renders a screen/feature component (aim for under 40 lines).
- No dead code, no commented-out code, no TODO without a name (`TODO(name): ...`).

## 3. Shared types, schemas and constants

- **Types:** `src/types/api.generated.ts` is generated by `npm run api:types` and never edited by hand. `src/types/*.ts` re-export friendly aliases (`Category`, `MonthView`, ...) from it. Only type declarations; no runtime code; no enums.
- **Schemas:** Zod schemas for form input, the API error body, and env. A form schema must match the API rules (e.g. date `YYYY-MM-DD`, amount > 0).
- **Constants:** fixed values as `as const` objects; no repeated string literals; query keys only in `queryKeys.ts`; secure-store keys in `storageKeys.ts`.

## 4. TypeScript

- `strict: true`, avoid `any`, no `@ts-ignore`.
- `import type` for type-only imports **[lint]**.
- Parse every boundary with Zod: env, error bodies, values read from storage.
- Explicit return types on exported functions.
- Money and quantities are `number` integers; check with `Number.isInteger` in helpers.
- Prefer discriminated unions for variants.

## 5. React Native rules

- **Text:** every string is inside `AppText`. Never put a string directly in a `View`.
- **Touch:** `Pressable` through `Button` / `IconButton`. Minimum touch target 44x44 (use `hitSlop` for small icons). Always set `accessibilityRole`; set `accessibilityLabel` when there is no visible text.
- **Styling:** `StyleSheet.create` at the bottom of the file; values from `src/theme`. No hex colors, no magic numbers (spacing, radius, font size). Inline style only for values that depend on props/state. `Platform.select` only inside `theme` or `components/ui`, never in feature components.
- **Lists:** `FlatList` / `SectionList` with `keyExtractor` for dynamic data; `ScrollView` only for short static content. Do not nest a vertical list inside a vertical `ScrollView`.
- **Screens:** wrap in the `Screen` component (safe area, optional scroll, keyboard handling). Forms use `keyboardShouldPersistTaps="handled"`.
- **Effects:** no data fetching in `useEffect`. Derive values during render. Clean up subscriptions.
- **Memoization:** `useMemo` / `useCallback` / `React.memo` only after a real reason (measured re-renders or a stable-reference need). Say the reason in a one-line comment.
- **Forms:** React Hook Form + `Controller` for every `TextInput`, Zod resolver from `src/schemas`. Show server `fieldErrors` under fields with `setError`. Disable the submit button while submitting.
- **Server state:** TanStack Query only. Keys from `queryKeys`. Mutations invalidate by key prefix in `onSuccess`. No optimistic updates unless a step asks for them.
- **Errors and states:** every screen that loads data handles loading, error (with retry), empty, and no-internet. Never show a success state for a write that failed.
- **Accessibility:** status = text or icon plus color, never color alone. Do not disable font scaling.
- **Navigation:** use typed routes; navigate with `router.push` / `router.replace` / `<Link>`; pass only ids and simple params, not objects.
- **Env:** read only through `src/config/env.ts`. Only `EXPO_PUBLIC_*` variables; nothing secret.
- **Icons:** only through `src/components/icons/Icon.tsx` (thin wrapper over `@expo/vector-icons`).
- **No `console.log`** **[repo rules script]**.

## 6. API client

- One `request()` function in `src/api/client.ts`: builds the URL from `env`, adds the bearer token, sets a timeout with `AbortController`, parses JSON, maps the standard error body `{ error: { code, message, details? } }` to an `ApiError`.
- API modules call `request()` and return typed data. They contain no React.
- Never put the token in the URL or logs.

## 7. Comments

- Explain why, not what. Needed when a rule is not obvious (e.g. why `toISOString()` is avoided for calendar dates).
- Exported helpers get a one-line JSDoc stating the rule.

## 8. Commits and branches

- Format: `<type>(<scope>): <short description>`, imperative, under 72 characters. Types: `feat`, `fix`, `refactor`, `style`, `perf`, `docs`, `chore`.
- Scopes: `repo`, `theme`, `ui`, `routing`, `api`, `auth`, `months`, `transactions`, `categories`, `forms`, `state`, `docs`.
- Examples: `chore(repo): scaffold expo project with typescript`, `feat(auth): add sign-in form with zod validation`.
- One logical change per commit; one commit per step. Branches: one per phase, `phase-N-short-name`. The coding agent commits each finished step (never `main`, never pushes); the developer pushes and merges phase branches.
- Line endings LF.

## 9. What is enforced where

| Check                                                              | Where                          |
| ------------------------------------------------------------------ | ------------------------------ |
| Types, strict                                                      | `tsc`                          |
| Default exports (outside `app/`), `../..` imports, hooks rules, `import type`, no-console, eqeqeq | ESLint (`eslint-config-expo` + project rules) |
| Formatting                                                         | Prettier                       |
| Hex colors, `@ts-ignore`, `console.log`, float money               | `scripts/check-rules.mjs`      |
| Behavior                                                           | manual check on a real device  |

A reviewer (human or AI) should spend time on what tools cannot check: concept correctness, naming quality, simplicity, accessibility.

## 10. Decision records

- Every step ends with `docs/decisions/<step>-<slug>.md` (for example `2.3-api-client.md`), created from `docs/decisions/TEMPLATE.md`, in English.
- Record only decisions that were actually made, with the real alternatives considered. Do not invent alternatives or rationale. Mark uncertainty explicitly.
- Records are history: to change an earlier decision, add a dated `Revision` section to that record; never delete or rewrite it silently.
