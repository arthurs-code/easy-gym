# Easy Gym — Dashboard, Dark Mode & HIG Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Home dashboard, system-aware dark mode, and HIG-style spacing/typography polish to the single-file Easy Gym PWA, plus document the workspace tooling.

**Architecture:** Stay single-file (`index.html`, one IIFE, SW-cached). Introduce a CSS custom-property token layer (spacing, type, semantic colors) and convert hardcoded color literals to those tokens so a single dark-mode override flips the whole UI. Dashboard and polish ride on the same token layer. One new additive storage key (`easyGym.theme.v1`); no schema changes.

**Tech Stack:** Vanilla HTML/CSS/JS, CSS custom properties, `localStorage`, service worker. No build step, no dependencies.

## Global Constraints

- Single-file architecture — all app code stays in `index.html`; do not split into separate `.css`/`.js` files. (verbatim from spec §3 non-goals)
- No framework or libraries added.
- No new persisted data beyond the theme preference key `easyGym.theme.v1` (values `'system'|'light'|'dark'`). (spec §4.2)
- Do not rename or remove any existing `localStorage` key; migration must stay intact. (spec §5)
- Contrast targets: ≥4.5:1 body text, ≥3:1 large text/UI on every surface. (spec §4.2)
- Touch targets ≥44px. (spec §4.4)
- No third-party tool installs (`claude-mem`, `gstack`) — document only. (spec §4.5)
- Repo root for all paths below: `PWA_v54/PWA_v54/`.

## Verification model

There is **no automated test harness** (spec §6). Each task's verification is a
concrete manual browser check. Serve locally with `python -m http.server 8000`
(run from the repo root) and open `http://localhost:8000`. Use DevTools device
toolbar at **390px** width for touch-target/layout checks, and
DevTools → Rendering → "Emulate CSS prefers-color-scheme" to force dark/light.
**Hard-reload (Ctrl+Shift+R)** after each change to bypass the service worker.

---

## Task 1: Token layer + literal→token color refactor (no visual change)

Establish the design-token system and convert every hardcoded color in the
`<style>` block to a semantic token, keeping **light-mode values identical**.
This is a pure refactor: the app must look pixel-identical afterward. It makes
Task 2 (dark mode) a single override block.

**Files:**
- Modify: `index.html:11` (the `:root{...}` declaration) and the `<style>` block (`index.html:11-179`)

**Interfaces:**
- Produces (CSS custom properties available to all later tasks):
  - Spacing: `--space-1:4px`, `--space-2:8px`, `--space-3:12px`, `--space-4:16px`, `--space-5:24px`, `--space-6:32px`
  - Type ramp: `--fs-title`, `--fs-heading`, `--fs-body`, `--fs-label`, `--fs-metric` (clamp values below)
  - Semantic colors: `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--text`, `--text-muted`, `--text-subtle`, `--border`, `--border-strong`, `--accent`, `--accent-contrast`, `--on-accent`, `--danger`, `--shadow`, `--ink` (always-dark ink for dividers/toast)
  - Legacy aliases (kept so untouched rules still work): `--blue`, `--text`, `--muted`, `--line`, `--bg`, `--card`, `--danger`, `--pad`, `--nav`

- [ ] **Step 1: Replace the `:root` block**

Replace the entire `:root{...}` at the start of line 11 (everything from `:root{` up to and including its closing `}`, i.e. the segment ending `...--nav:clamp(18px,4.6vw,30px)}`) with:

```css
:root{
  /* spacing scale (4/8pt grid) */
  --space-1:4px;--space-2:8px;--space-3:12px;--space-4:16px;--space-5:24px;--space-6:32px;
  /* type ramp (responsive, preserves existing feel) */
  --fs-title:clamp(30px,8vw,48px);--fs-heading:clamp(18px,4.6vw,30px);
  --fs-body:clamp(18px,5.1vw,28px);--fs-label:clamp(18px,4.9vw,25px);--fs-metric:clamp(28px,8vw,44px);
  /* semantic colors — LIGHT values (unchanged appearance) */
  --bg:#f8fafc;--surface:#fff;--surface-2:#f5f7fb;--surface-3:#edf2f7;
  --text:#111827;--text-muted:#64748b;--text-subtle:#6b7280;
  --border:#d9e0ea;--border-strong:#e5e7eb;
  --accent:#2563eb;--accent-contrast:#2563eb;--on-accent:#fff;
  --danger:#c81e1e;--shadow:rgba(15,23,42,.18);--ink:#111827;
  /* legacy aliases (keep old rules working) */
  --blue:var(--accent);--muted:#687082;--line:var(--border);--card:var(--surface);
  --pad:clamp(14px,3.8vw,30px);--nav:var(--fs-heading);
  box-sizing:border-box;
}
```

- [ ] **Step 2: Convert hardcoded color literals to tokens**

Within the `<style>` block only (`index.html:11-179`), replace each color literal with its token using this mapping. Replace **every** occurrence. Do not touch the `--space`/`--fs`/`:root` values you just set, and do not touch base64 image data.

| Literal | Replace with | Notes |
|---|---|---|
| `#fff` (as background or fill) | `var(--surface)` | cards, header, name-box, metric-box, modal-panel, qr, set-btn.checked color |
| `#f8fafc` | `var(--bg)` | body bg, set-btn bg |
| `#f5f7fb` | `var(--surface-2)` | progress-table th |
| `#f4f6f9` | `var(--surface-2)` | disabled name/metric box |
| `#edf2f7` | `var(--surface-3)` | workout-row |
| `#111827` | `var(--text)` | text, name-box input, metric input |
| `#64748b` | `var(--text-muted)` | muted text, brand-sub, set-btn color |
| `#6b7280` | `var(--text-subtle)` | exercise-number, metric-label, th |
| `#687082` | `var(--muted)` | nav-link, action labels (already aliased) |
| `#aeb5c0` | `var(--text-subtle)` | disabled day-link |
| `#d9e0ea` | `var(--border)` | (already via `--line`; convert any literal ones) |
| `#e5e7eb` | `var(--border-strong)` | header border, donate-table border |
| `#dbe3ee` | `var(--border-strong)` | library rows |
| `#2563eb` | `var(--accent)` | any literal accent |
| `#c81e1e` | `var(--danger)` | any literal danger |

**Keep as-is (intentionally fixed):** the `#111827` used by `.toast{background:...}`, `.divider{border-top:3px solid #111827}`, and `.group-line td{border-top:3px solid #111827}` should become `var(--ink)` (NOT `--text`) so Task 2 can keep them dark-on-light but adjust for dark mode. Shadows like `rgba(15,23,42,.18)`/`rgba(15,23,42,.02)` may stay literal.

- [ ] **Step 3: Verify no visual change (light mode)**

Serve (`python -m http.server 8000`), hard-reload `http://localhost:8000`.
Expected: app looks **identical** to the committed baseline — header, all 5
tabs (Plan, Do-it, Progress, Explanations, Donate), cards, tables, modal, set
buttons. Spot-check by toggling tabs and opening the "Add exercise" modal.
If anything shifted color, a literal was missed or mismapped — fix it.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "refactor(css): introduce design tokens, map color literals (no visual change)"
```

---

## Task 2: System-aware dark mode + toggle

Add a dark token override, a pre-paint theme boot, a persisted preference, a
header toggle, and dynamic `theme-color`. Bump the SW cache so clients fetch
the new build.

**Files:**
- Modify: `index.html` (`<head>` lines 4-7; `<style>` block; header markup line ~183-188; IIFE `KEYS`/`init`/`wire` regions; nav)
- Modify: `service-worker.js:1`

**Interfaces:**
- Consumes: semantic color tokens from Task 1.
- Produces (JS, available to later tasks):
  - `const THEMES = ['system','light','dark']`
  - `function applyTheme(mode)` — sets `<html data-theme>` (removes attr when `'system'`) and updates the `theme-color` meta
  - `function effectiveTheme()` → `'light'|'dark'` (resolves `'system'` via `matchMedia`)
  - `function cycleTheme()` — advances system→light→dark→system, persists to `KEYS.theme`, re-applies
  - `KEYS.theme = 'easyGym.theme.v1'`

- [ ] **Step 1: Add dark token override to `<style>`**

Append at the very end of the `<style>` block (just before `</style>` at line 179):

```css
:root[data-theme="dark"]{
  --bg:#000000;--surface:#1c1c1e;--surface-2:#2c2c2e;--surface-3:#3a3a3c;
  --text:#f2f2f7;--text-muted:#aeb4bf;--text-subtle:#98a0ad;
  --border:#3a3a3c;--border-strong:#48484a;
  --accent:#0a84ff;--accent-contrast:#0a84ff;--on-accent:#ffffff;
  --danger:#ff5a5a;--shadow:rgba(0,0,0,.6);--ink:#f2f2f7;
  --muted:#98a0ad;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#000000;--surface:#1c1c1e;--surface-2:#2c2c2e;--surface-3:#3a3a3c;
    --text:#f2f2f7;--text-muted:#aeb4bf;--text-subtle:#98a0ad;
    --border:#3a3a3c;--border-strong:#48484a;
    --accent:#0a84ff;--accent-contrast:#0a84ff;--on-accent:#ffffff;
    --danger:#ff5a5a;--shadow:rgba(0,0,0,.6);--ink:#f2f2f7;
    --muted:#98a0ad;
  }
}
.theme-toggle{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;border-radius:12px;color:var(--text-muted);font-size:22px;line-height:1}
.theme-toggle:active{background:var(--surface-2)}
```

- [ ] **Step 2: Add pre-paint theme boot script in `<head>`**

Immediately after the `<meta name="theme-color" content="#ffffff">` line (`index.html:6`), insert:

```html
<script>
(function(){try{var m=localStorage.getItem('easyGym.theme.v1');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}}catch(e){}})();
</script>
```

This runs before first paint so the saved theme applies with no flash.

- [ ] **Step 3: Add the toggle button to the header**

The header (`index.html` ~line 183-188) has a `grid-template-columns:auto 1fr`
logo/brand layout with `.main-nav` spanning `grid-column:1/-1`. Add a toggle
button as the last child of the `.main-nav` row so it sits inline with the nav.
Find the nav line (187) ending with `...data-tab="donate">Donate</button>` and
append immediately after the final `</button>`, still inside `.main-nav`:

```html
<button class="theme-toggle" id="themeToggle" aria-label="Toggle color theme" title="Theme">◐</button>
```

- [ ] **Step 4: Add theme JS to the IIFE**

4a. Add the key. In the `KEYS = {...}` object (`index.html:257-260`), add `theme:'easyGym.theme.v1'` (do not remove existing keys):

```js
const KEYS = {
  week:'easyGym.weekPlans.v1', train:'easyGym.trainSessions.v1', saved:'easyGym.savedPlans.v1', journal:'easyGym.journal.v1',
  library:'easyGym.exerciseLibrary.v1', start:'easyGym.trainStartTimes.v1', backup:'easyGym.backupReady.v1', theme:'easyGym.theme.v1'
};
```

4b. Add the theme functions. Place them just before `function init(){` (`index.html:294`):

```js
const THEMES = ['system','light','dark'];
function effectiveTheme(){
  const m = load(KEYS.theme, 'system');
  if(m==='light'||m==='dark') return m;
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}
function applyTheme(mode){
  const root = document.documentElement;
  if(mode==='light'||mode==='dark') root.setAttribute('data-theme',mode);
  else root.removeAttribute('data-theme');
  const dark = effectiveTheme()==='dark';
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', dark ? '#000000' : '#ffffff');
}
function cycleTheme(){
  const cur = load(KEYS.theme, 'system');
  const next = THEMES[(THEMES.indexOf(cur)+1) % THEMES.length];
  save(KEYS.theme, next);
  applyTheme(next);
  toast('Theme: '+next);
}
```

4c. Apply theme on startup. In `init()` (`index.html:294`), call `applyTheme` first:

```js
function init(){applyTheme(load(KEYS.theme,'system')); cacheEls(); wire(); normalizeData(); renderAll(); updateTimerLoop();}
```

4d. Wire the toggle + react to system changes. Inside `wire()` (near the
`document.querySelectorAll('[data-tab]')` handler at line 310), add:

```js
const tt = document.getElementById('themeToggle');
if(tt) tt.addEventListener('click', cycleTheme);
if(window.matchMedia){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{ if(load(KEYS.theme,'system')==='system') applyTheme('system'); });
}
```

- [ ] **Step 5: Bump the service-worker cache version**

In `service-worker.js:1`, change the cache name so old caches are evicted on activate:

```js
const CACHE='easy-gym-v55';
```

- [ ] **Step 6: Verify dark mode**

Serve and hard-reload. Checks:
- Click the header toggle: cycles `system → light → dark` (toast confirms);
  the whole UI (header, cards, tables, modal, set buttons, inputs) recolors —
  no white patches left in dark mode (those signal a missed literal from Task 1).
- Set dark, reload: theme persists, **no white flash** on load.
- Set `system`, then flip DevTools → Rendering → prefers-color-scheme: the UI
  follows automatically.
- In dark mode, the iOS/Android status-bar color (theme-color meta) is black:
  inspect `<meta name="theme-color">` → `content="#000000"`.
- Contrast spot-check (DevTools color picker) on body text and the accent
  buttons: ≥4.5:1 / ≥3:1.

- [ ] **Step 7: Commit**

```bash
git add index.html service-worker.js
git commit -m "feat: system-aware dark mode with persisted toggle"
```

---

## Task 3: Home dashboard tab ("Today")

Add a new first tab that summarizes today's plan, last session, a start/resume
action, and weekly activity — all read-only from existing state.

**Files:**
- Modify: `index.html` — nav (line 187), sections region (after `<section id="plan">`, ~line 191), `cacheEls` (line 278), `renderAll` (line 337), default `activeTab` (line 267), and add `renderHome` + helpers in the IIFE.

**Interfaces:**
- Consumes: `DAYS`, `DAY_SHORT`, `weekPlans`, `trainSessions`, `journal`,
  `trainStartTimes`, `selectedTrainDay`, `formatDuration`, `dateDisplay`,
  `dayName`, `activeTab`, `renderAll`, `esc`.
- Produces: `function renderHome()`, `function todayKey()` (returns a `DAYS`
  value for the current weekday), `function goTab(tab)` (sets `activeTab` and
  re-renders), all called from `renderAll`.

- [ ] **Step 1: Add "Today" to the nav (first link)**

In the nav (`index.html:187`), prepend before the `Plan` button and remove
`active` from `Plan`:

```html
<button class="nav-link active" data-tab="home">Today</button><button class="nav-link" data-tab="plan">Plan</button>
```

(Leave the remaining `train`/`progress`/`explanations`/`donate` buttons unchanged.)

- [ ] **Step 2: Add the Home section markup**

Immediately before `<section id="plan" class="section active">` (~line 191),
insert the new section AND remove `active` from the `plan` section
(`class="section active"` → `class="section"`):

```html
<section id="home" class="section active">
  <h2 class="compact-title" id="homeGreeting">Today</h2>
  <div class="card" id="homeTodayCard"></div>
  <div class="card" id="homeLastCard"></div>
  <div class="action-row"><button class="action" id="homeStartBtn">Start training</button></div>
  <div class="card" id="homeWeekCard"></div>
</section>
```

- [ ] **Step 3: Add dashboard styles**

Append before `</style>` (line 179):

```css
.home-row{display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-3);margin-bottom:var(--space-2)}
.home-label{font-weight:950;color:var(--text-subtle);font-size:var(--fs-label)}
.home-value{font-weight:950;color:var(--text);font-size:var(--fs-body)}
.home-sub{color:var(--text-muted);font-weight:850;font-size:var(--fs-label)}
.week-strip{display:flex;justify-content:space-between;gap:var(--space-2);margin-top:var(--space-3)}
.week-dot{flex:1;text-align:center;font-weight:950;color:var(--text-subtle);font-size:clamp(13px,3.4vw,18px)}
.week-dot .pip{display:block;width:14px;height:14px;border-radius:50%;margin:6px auto 0;background:var(--border-strong)}
.week-dot.done .pip{background:var(--accent)}
.week-dot.today{color:var(--accent)}
```

- [ ] **Step 4: Add `todayKey`, `goTab`, and `renderHome`**

Place these just before `function renderAll(){` (`index.html:334`). `getDay()`
returns 0=Sun..6=Sat; `DAYS` is `['mon'...'sun']`, so map accordingly:

```js
function todayKey(){ const idx=(new Date().getDay()+6)%7; return DAYS[idx]; }
function goTab(tab){ activeTab=tab; renderAll(); window.scrollTo(0,0); }
function renderHome(){
  if(!els.homeTodayCard) return;
  const tk = todayKey();
  // Today's plan
  const plan = (weekPlans[tk]||[]);
  els.homeTodayCard.innerHTML = `<div class="home-row"><span class="home-label">Today · ${DAY_SHORT[tk]}</span></div>`+
    (plan.length
      ? `<div class="home-value">${plan.length} exercise${plan.length>1?'s':''} planned</div>`+
        `<div class="home-sub">${plan.map(e=>esc(e.name)).slice(0,4).join(' · ')}${plan.length>4?' …':''}</div>`
      : `<div class="home-sub">No plan for today. Tap Plan to add exercises.</div>`);
  els.homeTodayCard.onclick = ()=>goTab('plan');
  // Last session (most recent journal entry; journal newest-last or newest-first — pick max by date)
  const last = (journal||[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0];
  els.homeLastCard.innerHTML = `<div class="home-row"><span class="home-label">Last session</span></div>`+
    (last
      ? `<div class="home-value">${esc(dateDisplay ? dateDisplay(last.date) : last.date)}</div>`+
        `<div class="home-sub">${(last.exercises||[]).length} exercises${last.durationMs?(' · '+formatDuration(last.durationMs)):''}</div>`
      : `<div class="home-sub">No sessions yet. Your finished workouts show here.</div>`);
  els.homeLastCard.onclick = ()=>goTab('progress');
  // Start/resume button
  const openStart = trainStartTimes && trainStartTimes[tk];
  els.homeStartBtn.textContent = openStart ? 'Resume training' : 'Start training';
  els.homeStartBtn.onclick = ()=>goTab('train');
  // Week strip — days with a saved journal session this week
  const doneDays = new Set((journal||[]).map(s=>s.day).filter(Boolean));
  els.homeWeekCard.innerHTML = `<div class="home-row"><span class="home-label">This week</span></div>`+
    `<div class="week-strip">`+DAYS.map(d=>`<div class="week-dot ${doneDays.has(d)?'done':''} ${d===tk?'today':''}">${DAY_SHORT[d]}<span class="pip"></span></div>`).join('')+`</div>`;
}
```

- [ ] **Step 5: Cache the new elements**

In `cacheEls()` (`index.html:278`), add the new ids to the cached list. Append
`'homeTodayCard','homeLastCard','homeStartBtn','homeWeekCard','homeGreeting'`
to the array of ids passed to the caching loop.

- [ ] **Step 6: Render Home in `renderAll` + default to it**

6a. In `renderAll` (`index.html:337`), add `renderHome();` to the render calls:

```js
renderHome(); renderDays(); renderPlan(); renderTrain(); renderProgress(); renderExplanations(); updateTimerLoop();
```

6b. Change the default tab (`index.html:267`):

```js
let activeTab = 'home';
```

- [ ] **Step 7: Verify the dashboard**

Serve and hard-reload. With existing data:
- App opens on **Today**. "Today's plan" card shows the count + first exercise
  names for the current weekday (matches the Plan tab for that day); tapping it
  navigates to Plan.
- "Last session" shows the most recent finished workout's date/exercise count;
  tapping navigates to Progress.
- "Start training" → Train tab; if a session is open for today it reads
  "Resume training".
- "This week" strip highlights today and fills accent pips for days with saved
  sessions.
Then test **empty state**: Explanations → Reset (or use a fresh browser
profile) and confirm all cards show their empty-state copy with no errors in
the console.

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: add Home dashboard tab (today's plan, last session, week strip)"
```

---

## Task 4: HIG spacing/typography polish + touch targets

Apply the spacing tokens for consistent rhythm and guarantee ≥44px touch
targets. No feature changes.

**Files:**
- Modify: `index.html` `<style>` block.

**Interfaces:**
- Consumes: `--space-*` and `--fs-*` tokens from Task 1.

- [ ] **Step 1: Enforce 44px touch targets**

In the `<style>` block, update these rules (find each selector and adjust):
- `.nav-link,.day-link` — add `min-height:44px;display:inline-flex;align-items:center;`
- `.set-btn` — change `height:48px` is OK; ensure `min-width:52px` stays (already ≥44).
- `.check` — keep `33px` visual but add a tap affordance: change to
  `width:33px;height:33px;` wrapped — instead set the rule to
  `.check{width:33px;height:33px;accent-color:var(--accent)}` and add
  `.name-box,.metric-box{min-height:44px}` (boxes already 58px; this just guards small screens).
- `.modal-close` — add `min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;`
- `.add-mini` — add `min-width:44px;min-height:44px;`

- [ ] **Step 2: Apply spacing tokens for rhythm**

Replace ad-hoc values with tokens where it improves consistency (visual intent
unchanged):
- `.section{...padding:16px var(--pad) 34px}` → `padding:var(--space-4) var(--pad) var(--space-6)`
- `.card,.exercise-card{...margin:11px 0...padding:12px}` → `margin:var(--space-3) 0;padding:var(--space-3)`
- `.action-row{...margin:8px 0 18px}` → `margin:var(--space-2) 0 var(--space-5)`
- `.metric-row{...margin-top:10px}` → `margin-top:var(--space-3)`
- `.set-buttons{...margin-top:12px}` → `margin-top:var(--space-3)`

- [ ] **Step 3: Verify polish**

Serve, hard-reload, DevTools device toolbar at **390px**:
- Inspect nav links, set buttons, modal close (✕), the `+` add-mini, day links:
  each computed box ≥44px in the smaller dimension.
- Visually confirm consistent vertical rhythm across Plan/Do-it/Progress; no
  overlapping or clipped controls in light and dark.
- Confirm all features still work (add exercise, edit metrics, save, timer).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: HIG spacing scale and >=44px touch targets"
```

---

## Task 5: Workspace documentation

Document the project and the review tooling; record opt-in steps for the
not-installed tools.

**Files:**
- Create: `CLAUDE.md`
- Create: `docs/tooling.md`

- [ ] **Step 1: Write `CLAUDE.md`**

Create `CLAUDE.md` at the repo root:

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
Easy Gym — a zero-build Progressive Web App for tracking gym workouts. All app
logic lives in a single `index.html` (one IIFE) with `manifest.json` and a
cache-first `service-worker.js`. No framework, no build step, no dependencies.

## Run it
Serve the folder over HTTP (the service worker needs http/https, not file://):

    python -m http.server 8000

Then open http://localhost:8000. Hard-reload (Ctrl+Shift+R) after edits to
bypass the service-worker cache; bump `CACHE` in `service-worker.js` when
shipping a new build.

## Architecture
- `index.html` — markup, `<style>` design-token CSS, and the app IIFE. Tabs are
  `.section` elements toggled by `data-tab`; `renderAll()` re-renders everything.
- State persists in `localStorage` under versioned keys: `easyGym.weekPlans.v1`,
  `easyGym.trainSessions.v1`, `easyGym.savedPlans.v1`, `easyGym.journal.v1`,
  `easyGym.exerciseLibrary.v1`, `easyGym.trainStartTimes.v1`,
  `easyGym.backupReady.v1`, `easyGym.theme.v1`. Legacy `fitnessEasy.*.v4` keys
  migrate on load. **Never rename a key** — it orphans user data.
- Theming: semantic CSS custom properties in `:root`, overridden by
  `:root[data-theme="dark"]` and `@media (prefers-color-scheme:dark)`.

## Review workflow
Before committing or merging substantive changes:
- Run `/code-review` on the working diff for correctness and cleanups.
- Run `/security-review` (handles localStorage/XSS-via-innerHTML surfaces).
These are available in this workspace today. See `docs/tooling.md` for the
status of `claude-mem` and `gstack`.

## Constraints
- Keep it single-file (no JS/CSS split) and dependency-free.
- The future SwiftUI native port is deferred (needs macOS/Xcode; we author on
  Windows). Design specs/plans live under `docs/superpowers/`.
```

- [ ] **Step 2: Write `docs/tooling.md`**

```markdown
# Workspace Tooling

## Enabled now
- **code-review** — `/code-review` slash command. Reviews the current diff.
- **security-review** — `/security-review` slash command. Security pass on pending changes.
- **superpowers** — enabled via `.claude/settings.json` (`enabledPlugins`).

## Not installed (opt-in TODO — do not install without the owner's go-ahead)
- **claude-mem** — persistent cross-session memory plugin. NOT present in this
  workspace. To adopt, add it to `.claude/settings.json` `enabledPlugins` (or
  install per its README) and verify on Windows. Until then, the built-in
  file-based memory under `~/.claude/.../memory/` is the only memory available.
- **gstack** — git-stacking workflow tool. NOT installed; this repo was only
  just `git init`-ed with a linear history. To adopt: install the tool
  (e.g. Graphite `gt` or chosen equivalent), confirm Windows support, then
  document the stacking commands here.

When either is enabled, move it to the "Enabled now" section and update
`CLAUDE.md`'s Review workflow accordingly.
```

- [ ] **Step 3: Verify**

Confirm both files exist and render as valid Markdown; confirm `CLAUDE.md`
storage-key list matches `KEYS` in `index.html` (including `theme`).

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md docs/tooling.md
git commit -m "docs: add CLAUDE.md and tooling status (code-review, security-review, claude-mem, gstack)"
```

---

## Self-review notes (author)

- **Spec coverage:** §4.1 tokens → Task 1; §4.2 dark mode (system default,
  manual override, `theme.v1`, pre-paint, header toggle, dynamic theme-color,
  contrast) → Task 2; §4.3 dashboard (today's plan, last session, start/resume,
  week strip, default landing) → Task 3; §4.4 spacing/type + 44px → Task 4;
  §4.5 workspace docs (git done in setup; CLAUDE.md; tooling.md) → Task 5; §5
  risks (flash, SW cache bump, theme-color, empty states, migration) covered in
  Tasks 2-3; §6 verification → per-task manual checks.
- **Type consistency:** `applyTheme`/`effectiveTheme`/`cycleTheme`/`THEMES`/
  `KEYS.theme`, `renderHome`/`todayKey`/`goTab` names used consistently across
  tasks and in `renderAll`/`init`/`wire`.
- **Placeholders:** none — all steps carry concrete code or concrete checks.
```
