# CLAUDE.md

Guidance for Claude Code when working in this monorepo.

## Dependencies

All npm dependencies are pinned to exact versions (no `^` or `~` prefix). When adding or upgrading a package, use `npm install --save-exact <pkg>` (or `-E`) so the `package.json` entry is an exact version.

## Build & test commands

Use the npm scripts, not raw `tsc` / `vitest` — the scripts wrap custom build orchestration (see `scripts/build.ts`) and shared config that the raw tools don't know about.

- **Build one package**: `npm run build <pkg>` — e.g. `npm run build react-cosmos-core`. Accepts shorthand (`plugin-webpack` → `react-cosmos-plugin-webpack`).
- **Build all packages**: `npm run build` (serial, in dependency order).
- **Clear builds**: `npm run build:clear`.
- **Type-check**: `npm run check-types`.
- **Lint**: `npm run lint`.
- **Format**: `npm run format` (writes) or `npm run format:check` (CI mode).
- **Run tests**: `npm run test:run <filter>` — e.g. `npm run test:run react-cosmos-core`. Without a filter runs the full suite.
- **Watch tests**: `npm run test`.
- **E2E**: `npm run test:e2e` (Playwright).
