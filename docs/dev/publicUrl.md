# How and where is `publicUrl` used

- As the base path for the renderer URL ([here](https://github.com/react-cosmos/react-cosmos/blob/9529482eea18d81878fbcd7214a5e72bc7a45009/packages/react-cosmos/src/shared/playgroundHtml.ts#L78)).
- As the base URL for static assets ([here](https://github.com/react-cosmos/react-cosmos/blob/9529482eea18d81878fbcd7214a5e72bc7a45009/packages/react-cosmos/src/shared/devServer/index.ts#L33)). Leading dot is removed ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/shared/static.ts#L17)), because the path passed to Express cannot be relative.
  - [ ] **Deprecate reason for removing leading dot, as relative paths should no longer be required. But keep it for backwards compatibility.**
- As the dir path for static export assets ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/shared/export.ts#L51)).
  - [ ] **Make path relative automatically, for static exports to load from non-root URLs.**
  - [ ] **Use `path.resolve` instead of `path.join`**

## Webpack

- Embedded as `process.env.PUBLIC_URL` ([here](https://github.com/react-cosmos/react-cosmos/blob/4f7a8dbdb5e1d36abce623a96e39df40d961cbdf/packages/react-cosmos/src/plugins/webpack/webpackConfig/shared.ts#L117)). Trailing slash is removed for compatibility with CRA convention.

### Dev server

- As the `output.publicPath` in webpack config ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/plugins/webpack/webpackConfig/devServer.ts#L55)).
- As the `publicPath` in webpack-dev-server middleware ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/plugins/webpack/devServer.ts#L92)). Leading dot is removed ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/shared/static.ts#L17)), because the path passed to WDS cannot be relative.
  - [ ] **Deprecate reason for removing leading dot, as relative paths should no longer be required. But keep it for backwards compatibility.**
- As the base URL for static assets, whose path is inferred from `devServer.contentBase` ([here](https://github.com/react-cosmos/react-cosmos/blob/9529482eea18d81878fbcd7214a5e72bc7a45009/packages/react-cosmos/src/shared/devServer/index.ts#L33)). Leading dot is removed ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/shared/static.ts#L17)), because the path passed to Express cannot be relative.
  - [ ] **Deprecate reason for removing leading dot, as relative paths should no longer be required. But keep it for backwards compatibility.**

### Static export

- As the `output.path` in webpack config ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/plugins/webpack/webpackConfig/export.ts#L46)). Leading slash is removed and publicUrl is resolved from `exportPath`.
- As the `output.publicPath` in webpack config ([here](https://github.com/react-cosmos/react-cosmos/blob/e93fa5fb12f7ed19d1ef5f920e38ccd5be0c3629/packages/react-cosmos/src/plugins/webpack/webpackConfig/export.ts#L48)).

## Related issues

- https://github.com/react-cosmos/react-cosmos/issues/777
- https://github.com/react-cosmos/react-cosmos/issues/1149
