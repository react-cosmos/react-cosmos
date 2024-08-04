import { fileURLToPath } from 'node:url';

export function rootPath(relPath: string) {
  // baseUrl is stored in a variable to bypass Vite's regex-based replacement
  // of `import.meta.url` with self.location in jsdom environments.
  // https://github.com/vitest-dev/vitest/issues/3988#issuecomment-1686450535
  const baseUrl = import.meta.url;
  return fileURLToPath(new URL(`../../../${relPath}`, baseUrl));
}
