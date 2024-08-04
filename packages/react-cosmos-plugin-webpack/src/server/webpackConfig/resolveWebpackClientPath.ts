import { fileURLToPath } from 'node:url';

export function resolveWebpackClientPath(relPath: string) {
  return fileURLToPath(new URL(`../../client/${relPath}`, import.meta.url));
}
