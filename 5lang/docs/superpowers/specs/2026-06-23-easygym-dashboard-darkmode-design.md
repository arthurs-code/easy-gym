# Easy Gym — Home Dashboard, Dark Mode & HIG Polish

**Date:** 2026-06-23
**Status:** Approved (design shape) — pending spec review
**Repo:** `PWA_v54/PWA_v54` (the deployable PWA; git initialized here)

## 1. Context

Easy Gym is a zero-build Progressive Web App: a single `index.html` (~500 lines)
containing one IIFE, with `manifest.json` and a cache-first `service-worker.js`.
State persists in `localStorage` under versioned `easyGym.*.v1` keys with
legacy-key migration. It runs today on Windows in a browser; a future SwiftUI
native port is **deferred** until a Mac/Xcode toolchain is available and is
explicitly out of scope for this work.

### Current features (5 tabs, `data-tab`)
- **Plan** — pick a weekday (Mon–Sun); build that day's exercise list. Each
  exercise = `{id, name, sets, kg, reps}`, added from an editable **exercise
  library** (default Olympic lifts) or a custom entry; save plan.
- **Train** — pick a day; run the workout with a live timer; check off sets;
  remove-last; save the session.
- **Progress** — journal of completed sessions in a table; export to Word/PDF.
- **Explanations** — help text + Backup / Restore / Reset (JSON import/export).
- **Donate** — QR image + Swiss-QR download.

### Storage keys
`easyGym.weekPlans.v1`, `easyGym.trainSessions.v1`, `easyGym.savedPlans.v1`,
`easyGym.journal.v1`, `easyGym.exerciseLibrary.v1`, `easyGym.trainStartTimes.v1`,
`easyGym.backupReady.v1` (+ legacy `fitnessEasy.*.v4` migration).

## 2. Goals

1. **Dark mode** with HIG-grade contrast (WCAG AA on dark surfaces), defaulting
   to system preference with a persisted manual override.
2. **Home dashboard** — a new landing tab summarizing today's plan, last
   session, a start/resume action, and weekly activity — derived entirely from
   existing data.
3. **Spacing/typography polish** across all tabs toward an HIG-style 4/8pt
   spacing scale, a clear type ramp, and ≥44px touch targets — no feature
   changes.
4. **Workspace setup** ("set up what's possible"): git repo, `CLAUDE.md`
   documenting build/run + `code-review`/`security-review` usage, and vetted
   opt-in install steps for `claude-mem` and `gstack`.

## Non-goals
- No SwiftUI/native code this session (deferred, unbuildable on Windows).
- No framework rewrite; no file split (`styles.css`/`app.js`) — stays single-file.
- No new persisted data beyond the theme preference.
- No third-party tool installs (`claude-mem`, `gstack`) without explicit go-ahead.

## 3. Approach

**Chosen: Approach A — stay single-file, add a design-token layer.** Introduce
CSS custom properties for spacing, type, and *semantic* colors in `:root`;
remap the existing raw tokens (`--blue`, `--text`, `--muted`, `--line`, `--bg`,
`--card`, `--danger`) onto semantic ones so all current markup keeps working
untouched. Dark mode, the dashboard, and the polish all ride on this one layer.

Rejected: **B** (split files) — changes the service-worker cache list and
no-build ethos for no benefit to these goals; **C** (framework rewrite) —
discards a working app for no gain.

## 4. Design

### 4.1 Design-token layer
Add to `:root`:
- **Spacing:** `--space-1:4px … --space-6:32px` (4/8pt grid). Replace ad-hoc
  margins/paddings on the 5 tabs with these where it improves rhythm.
- **Type ramp:** semantic sizes (`--fs-title`, `--fs-heading`, `--fs-body`,
  `--fs-label`, `--fs-metric`) keeping the existing responsive `clamp()` feel.
- **Semantic color tokens:** `--bg`, `--surface`, `--surface-2`, `--text`,
  `--text-muted`, `--border`, `--accent`, `--accent-contrast`, `--danger`,
  `--shadow`. Legacy vars become aliases (e.g. `--card: var(--surface)`).

### 4.2 Dark mode
- Default to system via `@media (prefers-color-scheme: dark)` overriding the
  semantic tokens on `:root`.
- Manual override via `<html data-theme="light|dark">`; absence = follow system.
- Persist choice in **new key `easyGym.theme.v1`** (`'system'|'light'|'dark'`),
  applied before first paint to avoid flash (inline boot script in `<head>`).
- **Toggle** in the header (cycles system → light → dark), with an accessible
  label; reflects current effective theme.
- Update `<meta name="theme-color">` dynamically to match the active surface so
  the iOS/Android status bar matches.
- Dark palette: near-black layered surfaces (`#000`/`#1c1c1e`/`#2c2c2e`-style),
  elevated cards lighter than background, accent blue brightened for contrast
  (target ≥4.5:1 body text, ≥3:1 large text/UI).

### 4.3 Home dashboard (new first tab "Today")
New `data-tab="home"`, set as the default active tab. Cards, all derived from
existing state (read-only — no schema change):
- **Today's plan** — exercises for the current weekday from `weekPlans`; empty
  state links to the Plan tab.
- **Last session** — most recent `journal`/`trainSessions` entry: date,
  duration, exercise count; tap → Progress.
- **Start / resume training** — primary action → Train tab on today; shows
  live elapsed time if `trainStartTimes` has an open session for today.
- **This week** — 7-dot strip (Mon–Sun) marking days with a saved session,
  giving a lightweight streak view.

Navigation: the existing tab system gains "Today" as the first `nav-link`;
header logo/title may also route home.

### 4.4 Spacing/typography polish
Apply the token scale to the 5 existing tabs; verify every interactive element
(nav links, set buttons, checkboxes, modal close, action rows) meets the 44px
minimum hit target; tighten heading→body hierarchy. Behavior unchanged.

### 4.5 Workspace setup
- `git init` (done) + `.gitignore`.
- **`CLAUDE.md`** at repo root documenting: what the app is, how to run it
  (static file server, e.g. `python -m http.server`), the single-file/no-build
  architecture, storage keys, and how to invoke `/code-review` and
  `/security-review` before commits/merges.
- **`docs/tooling.md`** — `code-review` & `security-review` are available now;
  `claude-mem` and `gstack` are **not installed** and listed as opt-in TODOs
  with vetted install steps (no third-party install performed without go-ahead).

## 5. Risks / edge cases
- **Flash of wrong theme** → mitigated by pre-paint inline boot script.
- **Service-worker caching** stale UI after update → bump the SW cache version
  so the new `index.html` is fetched.
- **`theme-color` meta** must update on toggle and on system change.
- **Dashboard with empty data** (new user) → explicit empty states, no crashes.
- **localStorage migration** must remain intact — no key renames; only one new
  additive key.
- **Repo location** is the nested `PWA_v54/PWA_v54`; documented so it isn't
  surprising.

## 6. Verification (no automated harness)
Manual QA checklist run before claiming completion:
- Toggle cycles system→light→dark; persists across reload; no flash.
- All 5 original tabs render correctly in both themes; AA contrast spot-checked.
- Dashboard cards show correct today's-plan / last-session / week data, and
  correct empty states with no saved data.
- localStorage data from the pre-change app still loads (migration intact).
- Set-tracking, timer, save, export, backup/restore still work.
- Touch targets ≥44px on a 390px-wide viewport.
- After SW cache-version bump, a reload picks up the new build.
