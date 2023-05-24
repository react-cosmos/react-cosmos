export function resolve(moduleId: string) {
  return require.resolve(moduleId);
}

export function resolveFrom(fromDirectory: string, moduleId: string) {
  return require.resolve(moduleId, { paths: [fromDirectory] });
}
