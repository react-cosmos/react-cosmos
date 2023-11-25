import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getStaticPath(relPath: string) {
  const currentDir = dirname(fileURLToPath(new URL(import.meta.url)));
  return resolve(currentDir, '../static', relPath);
}
