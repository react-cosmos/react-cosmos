import { createRequire } from 'node:module';
import path from 'path';

// NOTE: This is ESM code that can't run in Jest yet, which means that this
// module always needs to be mocked in tests until Jest adds ESM support.

export function requireModule(moduleId: string) {
  const require = createRequire(import.meta.url);
  return require(moduleId);
}

export function requireFrom(fromDirectory: string, moduleId: string) {
  // Inspired by https://github.com/sindresorhus/import-from
  const require = createRequire(path.resolve(fromDirectory, 'noop.js'));
  return require(moduleId);
}
