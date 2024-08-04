# Tech debt

## Pinned dependencies

In general we keep dependencies up to date. The following packages, however, need to be pinned to a specific version:

- `react-error-overlay@6.0.9` because of [this](https://github.com/facebook/create-react-app/issues/11773) and [this](https://github.com/react-cosmos/react-cosmos/issues/1359).
- `styled-components@5.x` because [6.x added a breaking change](https://github.com/styled-components/styled-components/releases/tag/v6.0.0) where all component props that don't start with `$` ("transient props") are passed down to the underlying components, which in most cases are DOM elements that shouldn't receive random attributes. We can upgrade to 6.x safely after prefixing styled props with `$`.

## Code improvements

- Enabling `noUncheckedIndexedAccess` in TypeScript would improve the overall quality of all Cosmos packages. Some research is required to learn common ways of handling mapping and reducing arrays, where TypeScript can't infer that a mapped key isn't undefined. I don't want to add unnecessary checks either because it decreases code conciseness.

## NPM optionalDependencies

When [migrating from Yarn 1.x to NPM latest](https://github.com/react-cosmos/react-cosmos/pull/1622) some platform-specific optional dependencies had to be added [here](https://github.com/react-cosmos/react-cosmos/blob/0703606691ec4d8c620e72bb25153a951c45a561/examples/vite/package.json#L26-L29) and [here](https://github.com/react-cosmos/react-cosmos/blob/0703606691ec4d8c620e72bb25153a951c45a561/docs/package.json#L23-L25) in order for GitHub Actions to work across Linux & Windows with the versioned `package-lock.json`. This doesn't affect users as those optional dependencies aren't added to any of the published packages. It's just a minor nuisance. The NPM issue is tracked [here](https://github.com/npm/cli/issues/4828). Vite discussion [here](https://github.com/vitejs/vite/discussions/15532#discussioncomment-8141236).
