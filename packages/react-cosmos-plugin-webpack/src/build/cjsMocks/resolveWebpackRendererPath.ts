// CJS mock for packages/react-cosmos-plugin-webpack/src/server/webpackConfig/resolveWebpackRendererPath.ts

export function resolveWebpackRendererPath(relPath: string) {
  return require.resolve(`../../renderer/${relPath}`);
}
