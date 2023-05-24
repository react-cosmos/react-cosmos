export function getStaticPath(relPath: string) {
  return require.resolve(`../../static/${relPath}`);
}
