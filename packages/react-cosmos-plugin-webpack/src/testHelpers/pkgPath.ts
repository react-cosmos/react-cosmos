import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function pkgPath(relPath: string) {
  const currentDir = fileURLToPath(new URL('.', import.meta.url));
  return path.resolve(currentDir, '..', relPath);
}
