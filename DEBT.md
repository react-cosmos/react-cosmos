Annoying aspects of the project that work but their solution leaves a lot to be desired. Usually high-hanging fruit, but can also reflect a blind spot of the author so new perspectives are welcome!

## Invariants and logging

Exceptions are logging in Cosmos are ad-hoc and minimalistic. `throw new Error` and `console.log` calls. While simplicity is nice, it's worth investing in some type of abstractions. Can be a single project or two separate ones. Thoughts to consider:

- Research what other big projects are doing
- Avoid unnecessary features
- Server-side vs client-side (and code that runs in both)

## Pinned dependencies

In general we keep dependencies up to date. The following packages, however, need to be pinned to a specific version:

- `react-error-overlay@6.0.9` because of [this](https://github.com/facebook/create-react-app/issues/11773) and [this](https://github.com/react-cosmos/react-cosmos/issues/1359).
- `open@4.x` because 5.x no longer works in Jest (until ESM is fully supported by Jest).
