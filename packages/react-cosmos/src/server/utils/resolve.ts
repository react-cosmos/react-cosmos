import { createRequire } from 'node:module';

// NOTE: This is ESM code that can't run in Jest yet, which means that this
// module always needs to be mocked in tests until Jest adds ESM support.

export function resolve(moduleId: string) {
  const require = createRequire(import.meta.url);
  return require.resolve(moduleId);
}

export function resolveFrom(fromDirectory: string, moduleId: string) {
  const require = createRequire(import.meta.url);
  return require.resolve(moduleId, { paths: [fromDirectory] });
}
