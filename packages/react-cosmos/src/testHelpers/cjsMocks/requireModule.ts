export function requireModule(moduleId: string) {
  return require(moduleId);
}

export function requireFrom(fromDirectory: string, moduleId: string) {
  return require(require.resolve(moduleId, { paths: [fromDirectory] }));
}
