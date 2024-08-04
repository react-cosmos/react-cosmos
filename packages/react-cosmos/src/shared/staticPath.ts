import { fileURLToPath } from 'node:url';

export function getStaticPath(relPath: string) {
  // baseUrl is stored in a variable to bypass Vite's regex-based replacement
  // of `import.meta.url` with self.location in jsdom environments.
  // https://github.com/vitest-dev/vitest/issues/3988#issuecomment-1686450535
  // Why would this code be running in a jsdom environment? Some server tests
  // use a jsdom environment in order to simulate WebSocket connections.
  // This code only runs on the server in production.
  const baseUrl = import.meta.url;
  return fileURLToPath(new URL(`../static/${relPath}`, baseUrl));
}
