export function resolveWebpackClientPath(relPath: string) {
  return require.resolve(`../../client/${relPath}`);
}
