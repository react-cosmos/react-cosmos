# Dependency slimming plan

Goal: reduce node_modules bloat (605MB as of 2026-07-24, measured on `upgrade-deps-2026-07`).
Target end state: **~250MB**, keeping only toolchain that's genuinely used.

## Where the 605MB goes

| Group                                                                             | Size   | Why it's there                                 |
| --------------------------------------------------------------------------------- | ------ | ---------------------------------------------- |
| react-native ecosystem (RN, Hermes, Metro, `@react-native`, devtools)             | ~200MB | Type-checks 100 lines in `react-cosmos-native` |
| Lerna ecosystem (lerna, nx, `@nx`, `@octokit`, node-gyp, conventional-changelog…) | ~110MB | Only `lerna publish` in release scripts        |
| TS 7 native binary + tsc                                                          | ~30MB  | The compiler — keep                            |
| oxlint/oxfmt binaries                                                             | ~28MB  | Lint/format — keep                             |
| Babel 8 + babel-loader + `core-js-pure` (webpack example)                         | ~45MB  | Webpack example transform + react-refresh      |
| Everything else (vite/rolldown, esbuild, webpack, playwright, jsdom…)             | ~190MB | Legit toolchain                                |

## Key findings

- **Removing Babel from the webpack example alone won't remove Babel from
  node_modules.** Metro (via react-native) depends on Babel 7 — currently nested
  under `metro-*/node_modules/@babel` because the example forces Babel 8 at
  root. Drop the example's Babel and v7 just hoists to root instead. Fix
  react-native first; the Babel win only materializes after.
- The root `@babel/core` devDep (added in commit `751496ae` "Fix Babel") exists
  purely to win the Babel 7 vs 8 hoisting fight between Metro and the webpack
  example. It becomes unnecessary once react-native is out.
- `react-cosmos-plugin-webpack` has **zero unit tests**. The webpack example's
  e2e run is the only coverage of `getDefaultWebpackConfig.ts` (incl. the
  babel-loader auto-detection and the `next/dist/compiled/babel-loader`
  fallback). Don't move the whole webpack example out of the repo without
  replacing that coverage.
- "babel-loader is the most popular webpack setup" still mostly holds in 2026:
  webpack's remaining audience is legacy apps, which overwhelmingly run
  babel-loader. The babel setup in the example is load-bearing test coverage.
- Nothing outside `packages/react-cosmos-native/src` imports `react-native`.
  The `cosmos-native` server command and the native e2e test are pure server/UI
  code — they don't need react-native installed.
- `core-js-pure` (15MB) is pulled solely by `@pmmmwh/react-refresh-webpack-plugin`
  in the webpack example.
- Root `css-loader` / `style-loader` / `html-webpack-plugin` devDeps exist so the
  webpack example's default config picks them up via `resolveFromSilent`
  (module resolution walks up to the hoisted root node_modules).

## Steps (in order — savings compound)

### 1. Get react-native out (~200MB, 33% of the tree)

The entire RN/Hermes/Metro toolchain exists to type-check
`NativeFixtureLoader.tsx` + `NativeRendererProvider.tsx` (100 lines, no tests).

Pick one:

- **Option A — dedicated repo**: move `react-cosmos-native` to its own repo
  (same model as the nextjs-example repo). It has no tests, changes rarely, and
  RN moves on its own release cadence.
- **Option B — type stub (cheaper)**: drop the `react-native` root devDep and
  type the two files against a minimal ambient `declare module 'react-native'`
  stub. RN no longer publishes standalone types (`@types/react-native` was
  deprecated), so a stub is the only install-free option. Loses type safety on
  100 lines.

Side effects either way: Babel 7, `hermes-*`, most `jest-*` copies vanish; the
root `@babel/core` hoisting hack can be removed.

### 2. Replace Lerna (~110MB)

Used for exactly one thing: `lerna publish` (scripts `release` /
`release:next`), plus `lerna.json` as the version source — which
`packages/react-cosmos-ui/webpack.config.js` imports for the `VERSION` define.

- Write a ~100-line tsx publish script (bump versions across workspaces,
  `npm publish --workspace` in dependency order) — same style as
  `scripts/build.ts`.
- Move the version source somewhere neutral (or keep `lerna.json` as a plain
  version file) and update the UI webpack config import.
- Removes lerna, nx, `@nx`, `@octokit`, node-gyp, handlebars,
  conventional-changelog, inquirer, jest-diff. (`rxjs` stays — `wait-on` also
  needs it.)

Lowest-risk big win in the repo.

### 3. Babel (~45MB incl. core-js-pure) — do AFTER step 1

Recommended middle path:

- Keep the webpack example in-repo (preserves the plugin's only per-PR e2e
  coverage; CI runs webpack on more matrix rows than vite) but switch it to
  `esbuild-loader` — esbuild is already in the tree via the UI build, so
  marginal cost ≈ 0.
- Create an external `webpack-babel-example` repo (nextjs-example model) for
  the babel-loader + react-refresh flavor. That's where the
  babel-loader-detection path and `@pmmmwh/react-refresh-webpack-plugin` get
  exercised instead.
- Removes from the monorepo: `@babel/*` (v8 + example-nested copies),
  `babel-loader`, `@babel/preset-react`, `@babel/preset-typescript`,
  `@pmmmwh/react-refresh-webpack-plugin`, `react-refresh`, `core-js-pure`, and
  the root `@babel/core` workaround.
- Trade-off to accept: the babel-loader branch of `getDefaultWebpackConfig.ts`
  is no longer covered by this repo's CI.

### 4. Free cleanups (any time)

- Delete `create-react-class` root devDep — referenced nowhere.
- Delete `isomorphic-fetch` + `@types/isomorphic-fetch` — imported as a fetch
  polyfill in 3 devServer test files
  (`packages/react-cosmos/src/devServer/__tests__/{devServerPlugin,devServerUiPlugin,startDevServer}.ts`);
  Node ≥18 has native fetch, so delete the imports and both deps.
