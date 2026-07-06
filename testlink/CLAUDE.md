# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
Easy Gym — a zero-build Progressive Web App for tracking gym workouts. All app
logic lives in a single `index.html` (one IIFE) with `manifest.json` and a
cache-first `service-worker.js`. No framework, no build step, no dependencies.

## Run it
Serve the folder over HTTP (the service worker needs http/https, not file://):

    python -m http.server 8080 --bind 127.0.0.1

Then open http://127.0.0.1:8080. Hard-reload (Ctrl+Shift+R) after edits to
bypass the service-worker cache; bump `CACHE` in `service-worker.js` when
shipping a new build.

Note: on this Windows box port 8000 is blocked by a reserved port range
(`PermissionError: [WinError 10013]`), so we use 8080. If 8080 is also taken,
pick any free port (e.g. 5500, 8888). Check availability with
`python -c "import socket;s=socket.socket();s.bind(('127.0.0.1',8080));s.close()"`.

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
