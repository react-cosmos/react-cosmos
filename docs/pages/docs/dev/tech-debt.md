# Tech debt

## Pinned dependencies

In general we keep dependencies up to date. The following packages, however, need to be pinned to a specific version:

- `react-error-overlay@6.0.9` (a dependency of `react-cosmos-plugin-webpack`) because 6.0.10+ broke outside CRA's webpack-with-DefinePlugin setup ([CRA #11773](https://github.com/facebook/create-react-app/issues/11773), Cosmos symptom in [#1359](https://github.com/react-cosmos/react-cosmos/issues/1359)). The regression — an unguarded `process.env.NODE_ENV` reference in the bundle — is still open as [CRA #12064](https://github.com/facebook/create-react-app/issues/12064); 6.1.0 (Feb 2025) is just a republish, no code fix. The pin is low-cost: the package has zero runtime dependencies and ships a single ~360KB bundled file. The realistic exit is replacing it altogether — kept for now because it provides a tasteful default error overlay with click-to-open-in-editor, and only burdens the webpack plugin, not Cosmos itself.

## Code improvements

- Enabling `noUncheckedIndexedAccess` in TypeScript would improve the overall quality of all Cosmos packages. Some research is required to learn common ways of handling mapping and reducing arrays, where TypeScript can't infer that a mapped key isn't undefined. I don't want to add unnecessary checks either because it decreases code conciseness.

## NPM optionalDependencies

When [migrating from Yarn 1.x to NPM latest](https://github.com/react-cosmos/react-cosmos/pull/1622) some platform-specific optional dependencies had to be added [here](https://github.com/react-cosmos/react-cosmos/blob/0703606691ec4d8c620e72bb25153a951c45a561/examples/vite/package.json#L26-L29) and [here](https://github.com/react-cosmos/react-cosmos/blob/0703606691ec4d8c620e72bb25153a951c45a561/docs/package.json#L23-L25) in order for GitHub Actions to work across Linux & Windows with the versioned `package-lock.json`. This doesn't affect users as those optional dependencies aren't added to any of the published packages. It's just a minor nuisance. The NPM issue is tracked [here](https://github.com/npm/cli/issues/4828). Vite discussion [here](https://github.com/vitejs/vite/discussions/15532#discussioncomment-8141236).
