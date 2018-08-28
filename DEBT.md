Annoying aspects of the project that _work_ but their solution leaves a lot to be desired. Usually high-hanging fruit, but can also reflect a blind spot of the author so new perspectives are welcome!

## `web-dev-middleware` warning

> DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead

This warning is caused by an old version of `webpack-dev-middleware`, which Cosmos uses to support webpack versions as old as 1.x. Upgrading WDM would make this warning disappear, but would also break compatibility with webpack <4. Warning aside, everything still seems to work with every webpack version (for now).

## Sharing Flow types

> Note: `react-cosmos-flow` is deprecated for external use. It now serves as central place for storing types inside the monorepo. Being part of a package is convenient because of the path aliasing (not having to write deeply nested relative paths like `../../../types`).

Externally, types are now shared via `.js.flow` files that are published to npm. [Like this](https://github.com/react-cosmos/react-cosmos/blob/87b2ddca6d97f492843a492e9604dffbf2bd48e2/packages/react-cosmos/index.js.flow). But this has a shortcoming: It duplicates types.

Goal: Reuse types internally and externally. Two possible solutions come to mind:

1. Gradually move all Flow types to `index.js.flow` files tied to specific packages.
2. Create script that generates a public `.js.flow` file from source files that aren't published to npm.

PS. Include TypeScript in the solution.

## Unstable (and undocumented) package APIs

Historically, Cosmos respected semver with regards to the high level APIs: The `cosmos.config` options and the testing API. But Cosmos is made out of a few lower level abstractions that work together, like the _Loader_ (the fixture renderer) and the _Playground_ (the UI). Normally these APIs aren't accessed directly, but they make custom configurations possible, like a Browserify integration. Semver convention for these packages has been neglected.

As Cosmos matures, it's important to increase the stability of and document these lower level building blocks. Keep this in mind while [developing the JSX fixture and UI plugin APIs](https://github.com/react-cosmos/react-cosmos/blob/87b2ddca6d97f492843a492e9604dffbf2bd48e2/TODO.md#roadmap-summer-of-cosmos).

## Invariants and logging

Exceptions are logging in Cosmos are ad-hoc and minimalistic. `throw new Error` and `console.log` calls. While simplicity is nice, it's probably worth investing in light abstractions for both. Can be a single project or two separate ones. Thoughts to consider:

- Research what other big projects are doing
- Avoid unnecessary features
