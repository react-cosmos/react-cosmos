import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// NOTE: This is ESM code that can't run in Jest yet, which means that this
// module always needs to be mocked in tests until Jest adds ESM support.

export function resolveWebpackClientPath(relPath: string) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return resolve(currentDir, '../../client', relPath);
}
