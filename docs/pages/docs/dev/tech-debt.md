# Tech debt

## Pinned dependencies

In general we keep dependencies up to date. The following packages, however, need to be pinned to a specific version:

- `react-error-overlay@6.0.9` because of [this](https://github.com/facebook/create-react-app/issues/11773) and [this](https://github.com/react-cosmos/react-cosmos/issues/1359).
- `open@4.x` because 5.x no longer works in Jest (until ESM is fully supported by Jest).
