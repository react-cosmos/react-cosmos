# CLAUDE.md

Guidance for Claude Code when working in this monorepo.

Never commit without an explicit prompt — the user reviews changes before they land.

## Architecture

See [docs/pages/docs/dev/architecture.md](docs/pages/docs/dev/architecture.md) for the three-part breakdown of React Cosmos (Server, UI, Renderer) and how they communicate. Keep it in mind when making changes — the boundaries between these parts are load-bearing.

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

## Cross-package source linking

`npm run src` rewrites the root shim files (`packages/*/{index,client,vitest}.{js,d.ts}`) to point at `./src/…` so cross-package edits resolve without rebuilding and so cross-package test coverage is measured against source. CI runs it before `check-types`, `lint`, and `test:run` — source-mode must type-check cleanly, not just dist-mode.

`npm run dist` flips them back. Always run this before committing; the repo's committed state is dist-mode.
