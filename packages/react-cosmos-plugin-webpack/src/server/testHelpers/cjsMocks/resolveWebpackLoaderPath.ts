// CJS mock for packages/react-cosmos-plugin-webpack/src/server/webpackConfig/resolveWebpackLoaderPath.ts

export function resolveWebpackLoaderPath() {
  return require.resolve('../../webpackConfig/userImportsLoader.cjs');
}
