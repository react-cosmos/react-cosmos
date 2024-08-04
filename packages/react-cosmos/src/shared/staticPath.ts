import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getStaticPath(relPath: string) {
  // This is the original implementation, but it doesn't work in Vitest:
  // return fileURLToPath(new URL(`../static/${relPath}`, import.meta.url));
  // For some reason `new URL('.', import.meta.url)` returns a relative path
  // that starts with "/packages/react-cosmos" instead of the absolute path.

  const currentDir = dirname(fileURLToPath(import.meta.url));
  return resolve(currentDir, '../static', relPath);
}
