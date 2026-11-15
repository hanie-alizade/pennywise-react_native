# AGENTS.md

Rules for any coding agent in this repo (Codex, Claude Code, Cursor, others). Read this first.

## Project

Pennywise mobile: React Native client (Expo, TypeScript, Expo Router) for a personal budgeting API. The API contract is `docs/openapi.yaml`. Public portfolio repo; the backend is a separate private repo.

## How work is given to you

You receive one step at a time, for example: "Implement Step 2.3." The step is defined in `docs/PLAN.md` (scope, acceptance, decisions to record). That step decides what to build. Anything not in the step is out of scope, even if a doc mentions it. If the step is ambiguous, contradicts a doc, or is impossible, say so and stop.

Docs describe the app as it is built; planned parts are marked "planned" and are updated as phases finish.

## Docs: read only what the step needs

| Doc | Read when |
| --- | --- |
| `docs/CONVENTIONS.md` | always, before writing code |
| `docs/PLAN.md` | always: the step definition, plus Done criteria |
| `docs/ARCHITECTURE.md` | folder layout, data flow, auth, query setup, contracts |
| `docs/PROJECT_CONTEXT.md` | product rules (money, dates, parent/subcategory rule, months) |
| `docs/openapi.yaml` | routes, request/response shapes, error codes |
| `docs/decisions/*.md` | earlier steps' decisions, when the step builds on them |

## Commands

| Command | Use |
| --- | --- |
| `npm start` | Expo dev server. **The developer runs it**, not you (long-running, needs a QR scan) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:rules` | repo rules script (hex colors, `@ts-ignore`, float money, `console.log`) |
| `npm run check` | typecheck + lint + repo rules |
| `npm run api:types` | regenerate `src/types/api.generated.ts` from `docs/openapi.yaml` |
| `npm run mock` | mock API from `docs/openapi.yaml` (only when the backend is not ready) |

All scripts except `start` and `mock` exit by themselves.

## Hard rules

1. TypeScript strict. Avoid `any`. `@ts-ignore` is not allowed. `@ts-expect-error` and `eslint-disable` need a short reason in the same comment. Parse unknown data (API error bodies, secure-store values, env) with Zod.
2. Money is integer minor units (e.g. sen). Never floats, never `parseFloat` for money. Use `parseMoneyToMinor` and `formatMoney` from `src/helpers/money.ts`.
3. Dates the user picks are **calendar dates** `YYYY-MM-DD` in the local calendar. Never use `toISOString()` for them. Use `src/helpers/dates.ts`.
4. Totals, Actual and differences come from the API. The client never re-sums or recomputes them.
5. The server is the authority for permissions and rules. The UI only previews and locks.
6. Route files in `app/` stay thin: they compose a screen or feature component. Data fetching lives in `src/apiHooks`, HTTP in `src/api`, never inside presentational components.
7. Theme tokens only (`src/theme`). No hex colors, no magic numbers for spacing, radius or font size in components. All text goes through `AppText`. Styles use `StyleSheet.create`. No inline style objects except values that depend on props or state.
8. Touchables: use `Pressable` (through `Button`, `IconButton`, etc.). Every pressable has an accessibility role, and a label when it has no visible text.
9. Dynamic lists use `FlatList` / `SectionList` with a `keyExtractor`. `ScrollView` only for short, static content.
10. Server state is TanStack Query only. No fetching in `useEffect`. Derive values during render.
11. Only approved dependencies: expo (+ expo-router, expo-status-bar, expo-constants, expo-secure-store, expo-linking, react-native-safe-area-context, react-native-screens, @expo/vector-icons), react, react-native, typescript, @tanstack/react-query, react-hook-form, @hookform/resolvers, zod, openapi-typescript (dev), eslint (+ eslint-config-expo), prettier, Prism (dev, mock server). `@react-native-community/netinfo` is approved from Phase 6. **Ask before anything else.**
12. Shared types in `src/types`, Zod schemas in `src/schemas`, fixed values in `src/constants` as `as const` objects. Import through barrels (`@/types`, `@/schemas`, `@/constants`, `@/helpers`, `@/api`, `@/apiHooks`, `@/hooks`, `@/providers`, `@/theme`); no deep imports into these folders.
13. File names, naming and structure follow `docs/CONVENTIONS.md`. Component folder and file are PascalCase; other files camelCase. Route files under `app/` follow Expo Router naming and use default exports (the only exception).
14. Public repo: no secrets, tokens, or private backend details. Only `EXPO_PUBLIC_*` env vars, and only non-secret ones.
15. Do not add test tooling or test files. Verification is `npm run check` plus the developer running the app on a device.

## UI rule

Plain React Native components and the project's own small UI kit in `src/components/ui`. No UI library, no Expo UI. No animation libraries unless a step says so. Follow the layout described in the step, not pixel-perfect polish.

## Working rules

- Do exactly the step. Do not start other work. Do not refactor or reformat files you did not need to change.
- Do not open files to "understand the project" beyond the docs the step needs. Reading the files you are about to change is fine.
- Code style: small files, one responsibility, descriptive names, no clever abstractions. Comments explain why, never what.
- Run `npm run check` once at the end of a step. If it fails, fix and run again; after the third failure of the same check, stop and report the error and your best guess. Never weaken lint or TypeScript config, never suppress errors, never change versions.
- Do not claim something works on a device unless the developer confirmed it. Tell the developer exactly what to run and what should appear.
- If an API or library detail may have changed, check current official docs before using it, and record which doc you used.
- If a doc and the code disagree, say so in the final message. Do not silently change either.
- Do not create extra documents except the step's decision record. At the end of a phase, update `docs/PLAN.md` status and the "as built" parts of `docs/ARCHITECTURE.md`.

## Decision record (required at the end of every step)

Create `docs/decisions/<step>-<slug>.md` from `docs/decisions/TEMPLATE.md` (for example `2.3-api-client.md`). It must cover what was built, each real decision with the alternatives you actually considered, why the chosen option won, trade-offs accepted, gotchas, known limitations, and what you verified. Be honest: do not invent alternatives or justifications, and mark uncertainty. The "Decisions to record" list in the step in `docs/PLAN.md` is the minimum; add others you made.

To change an earlier decision, add a dated `Revision` section to that step's record. Never delete or silently rewrite history.

## Git (one commit per step)

Each finished step is committed by you, on the phase branch. Pushing stays with the developer.

**Allowed:** `git status --short`, `git diff`, `git log --oneline`, `git branch --show-current`, `git switch -c <phase-branch>` (only for the first step of a phase), `git add <explicit paths>`, `git commit -m "<message>"`.

**Never:** `git push`, `git commit --amend`, `git add .` / `git add -A`, `git stash`, `git reset`, `git restore`, `git checkout`, `git merge`, `git rebase`, `git cherry-pick`, force options, deleting branches, editing remotes or git config, or committing on `main`.

Procedure:
1. **Before starting:** run `git status --short` and `git branch --show-current`. If the working tree has uncommitted changes you did not make, do not touch or commit them; if they overlap with the step's files, stop and ask.
2. **Branch:** the first step of a phase creates the branch named in `docs/PLAN.md` (for example `phase-1-foundation-ui`) from the current `main`. Later steps of the same phase stay on it. If you are on a different branch than the plan expects, stop and ask.
3. **After the step:** commit only if `npm run check` passed. Stage the step's files by explicit path, including the decision record, so the step is one commit. If `npm run check` still fails after the retry limit, do not commit; report the failure.
4. **Message:** `<type>(<scope>): <description>` as defined in `docs/CONVENTIONS.md` section 8.
5. Report the commit hash and message in the final message.

## Final message of a step (English, max ~20 lines)

1. Summary (2-3 lines).
2. Files created or changed, and the path of the decision record.
3. How to verify: exact commands and what should appear on the device.
4. Doc/code mismatches or assumptions, if any.
5. Branch, commit hash and commit message (or why nothing was committed).
