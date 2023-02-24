import { fileURLToPath } from 'url';

export function getStaticPath(relPath: string) {
  return fileURLToPath(new URL(`../static/${relPath}`, import.meta.url));
}
