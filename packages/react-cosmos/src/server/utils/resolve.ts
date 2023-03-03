import { createRequire } from 'node:module';

// NOTE: This is ESM code that can't run in Jest yet, which means that this
// module always needs to be mocked in tests until Jest adds ESM support.

// One day this code will be replaced by import.meta.resolve
// https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
// Still under --experimental-import-meta-resolve flag in Node v19

export function resolve(moduleId: string) {
  const require = createRequire(import.meta.url);
  return require.resolve(moduleId);
}

export function resolveFrom(fromDirectory: string, moduleId: string) {
  const require = createRequire(import.meta.url);
  return require.resolve(moduleId, { paths: [fromDirectory] });
}
