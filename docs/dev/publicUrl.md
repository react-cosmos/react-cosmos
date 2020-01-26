# How and where is `publicUrl` used

- As the base path for the renderer URL. ([here](packages/react-cosmos/src/shared/playgroundHtml.ts))
- As the static dir root path. Leading slash is removed. ([here](packages/react-cosmos/src/shared/devServer/index.ts))
- As the nested path for static assets in exports. **Path needs to be relative for static exports to load from non-root URLs.** ([here](packages/react-cosmos/src/shared/export.ts))

## Webpack

- As the `output.publicPath` in dev server webpack config. ([here](packages/react-cosmos/src/plugins/webpack/webpackConfig/devServer.ts))
- As the `publicPath` of webpack-dev-server middleware. Path is made absolute by removing leading `.`. ([here](packages/react-cosmos/src/plugins/webpack/devServer.ts))
- As the `output.path` in export webpack config. Leading slash is removed and publicUrl is resolved from `exportPath`. ([here](packages/react-cosmos/src/plugins/webpack/webpackConfig/export.ts))
- As the `output.publicPath` in export webpack config. ([here](packages/react-cosmos/src/plugins/webpack/webpackConfig/export.ts))
- Embedded as `process.env.PUBLIC_URL`. Trailing slash is removed. ([here](packages/react-cosmos/src/plugins/webpack/webpackConfig/shared.ts) and [here](packages/react-cosmos/src/shared/static.ts))
- As the `publicPath` in export webpack configs. ([here](packages/react-cosmos/src/plugins/webpack/webpackConfig/export.ts))
- As the nested path for static assets in exports, based on `devServer.contentBase`. ([here](packages/react-cosmos/src/plugins/webpack/devServer.ts))

## Related issues

- https://github.com/react-cosmos/react-cosmos/issues/777
- https://github.com/react-cosmos/react-cosmos/issues/1149
