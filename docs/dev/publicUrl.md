# How and where is `publicUrl` used

- As the base path for the renderer URL ([here](https://github.com/react-cosmos/react-cosmos/blob/a9bbef2c89f13715bf2cb2f9726d01c564043450/packages/react-cosmos/src/shared/playgroundHtml.ts#L78)).
- As the base URL for static assets ([here](https://github.com/react-cosmos/react-cosmos/blob/a9bbef2c89f13715bf2cb2f9726d01c564043450/packages/react-cosmos/src/shared/devServer/index.ts#L33)). Leading dot is removed[0].
- As the dir path for static export assets ([here](https://github.com/react-cosmos/react-cosmos/blob/a9bbef2c89f13715bf2cb2f9726d01c564043450/packages/react-cosmos/src/shared/export.ts#L51)). Leading slash is removed and publicUrl is resolved from `exportPath`.

## Webpack

- Embedded as `process.env.PUBLIC_URL` ([here](https://github.com/react-cosmos/react-cosmos/blob/4f7a8dbdb5e1d36abce623a96e39df40d961cbdf/packages/react-cosmos/src/plugins/webpack/webpackConfig/shared.ts#L117)). Trailing slash is removed for compatibility with CRA convention.

### Dev server

- As the `output.publicPath` in webpack config ([here](https://github.com/react-cosmos/react-cosmos/blob/a9bbef2c89f13715bf2cb2f9726d01c564043450/packages/react-cosmos/src/plugins/webpack/webpackConfig/devServer.ts#L55)).
- As the `publicPath` in webpack-dev-server middleware ([here](https://github.com/react-cosmos/react-cosmos/blob/a9bbef2c89f13715bf2cb2f9726d01c564043450/packages/react-cosmos/src/plugins/webpack/devServer.ts#L93)). Leading dot is removed because the path passed to WDS cannot be relative[0].
- As the base URL for static assets, whose path is inferred from `devServer.contentBase` ([here](https://github.com/react-cosmos/react-cosmos/blob/4f7a8dbdb5e1d36abce623a96e39df40d961cbdf/packages/react-cosmos/src/plugins/webpack/devServer.ts#L51)). Leading dot is removed because the path passed to Express cannot be relative[0].

### Static export

- As the `output.path` in webpack config ([here](https://github.com/react-cosmos/react-cosmos/blob/a9bbef2c89f13715bf2cb2f9726d01c564043450/packages/react-cosmos/src/plugins/webpack/webpackConfig/export.ts#L46)). Leading slash is removed and publicUrl is resolved from `exportPath`.
- As the `output.publicPath` in webpack config ([here](https://github.com/react-cosmos/react-cosmos/blob/a9bbef2c89f13715bf2cb2f9726d01c564043450/packages/react-cosmos/src/plugins/webpack/webpackConfig/export.ts#L48)).

## Related issues

- https://github.com/react-cosmos/react-cosmos/issues/777
- https://github.com/react-cosmos/react-cosmos/issues/1149

> [0] The `publicUrl` must have a trailing dot (eg. `"./"`) in order to server static exports from a nested path (eg. `http://mydomain.com/cosmos-export/`).
