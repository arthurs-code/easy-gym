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
