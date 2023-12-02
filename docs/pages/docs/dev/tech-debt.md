# Tech debt

## Pinned dependencies

In general we keep dependencies up to date. The following packages, however, need to be pinned to a specific version:

- `react-error-overlay@6.0.9` because of [this](https://github.com/facebook/create-react-app/issues/11773) and [this](https://github.com/react-cosmos/react-cosmos/issues/1359).
- `styled-components@5.x` because [6.x added a breaking change](https://github.com/styled-components/styled-components/releases/tag/v6.0.0) where all component props that don't start with `$` ("transient props") are passed down to the underlying components, which in most cases are DOM elements that shouldn't receive random attributes. We can upgrade to 6.x safely after prefixing styled props with `$`.

### Pure ESM in Node.js

Some Node packages are pinned to their last CommonJS version until [ESM is fully supported in Jest](https://jestjs.io/docs/ecmascript-modules) or until we [migrate to Vitest](https://github.com/react-cosmos/react-cosmos/pull/1574) or another ESM compatible test runner.

- `open@4.x`.
- `pkg-up@4.x`.
