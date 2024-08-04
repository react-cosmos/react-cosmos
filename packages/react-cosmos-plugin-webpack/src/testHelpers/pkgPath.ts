import { fileURLToPath } from 'node:url';

export function pkgPath(relPath: string) {
  return fileURLToPath(new URL(`../${relPath}`, import.meta.url));
}
