import { createRequire } from 'node:module';

export function requireModule(moduleId: string) {
  const require = createRequire(import.meta.url);
  return require(moduleId);
}
