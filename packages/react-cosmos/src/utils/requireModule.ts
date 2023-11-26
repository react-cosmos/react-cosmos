import { createRequire } from 'node:module';
import path from 'path';

export function requireModule(moduleId: string) {
  const require = createRequire(import.meta.url);
  return require(moduleId);
}

export function requireFrom(fromDirectory: string, moduleId: string) {
  // Inspired by https://github.com/sindresorhus/import-from
  const require = createRequire(path.resolve(fromDirectory, 'noop.js'));
  return require(moduleId);
}
