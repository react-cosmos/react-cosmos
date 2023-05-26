// CJS mock for packages/react-cosmos-plugin-webpack/src/server/webpackConfig/resolveWebpackClientPath.ts

export function resolveWebpackClientPath(relPath: string) {
  return require.resolve(`../../../client/${relPath}`);
}
