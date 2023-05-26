// CJS mock for packages/react-cosmos/src/shared/staticPath.ts

export function getStaticPath(relPath: string) {
  return require.resolve(`../static/${relPath}`);
}
