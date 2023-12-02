import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function resolveWebpackClientPath(relPath: string) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return resolve(currentDir, '../../client', relPath);
}
