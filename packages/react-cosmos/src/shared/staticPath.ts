import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getStaticPath(relPath: string) {
  // For some reason `new URL('.', import.meta.url)` returns a relative path
  // that starts with "/packages/react-cosmos" instead of the absolute path.
  // At least in Vitest this happens, when the module URL has the .ts extension.
  const currentDir = dirname(fileURLToPath(new URL(import.meta.url)));
  return resolve(currentDir, '../static', relPath);
}
