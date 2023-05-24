// CJS mock for packages/react-cosmos/src/utils/requireModule.ts

export function requireModule(moduleId: string) {
  return require(moduleId);
}

export function requireFrom(fromDirectory: string, moduleId: string) {
  return require(require.resolve(moduleId, { paths: [fromDirectory] }));
}
