import { createRequire } from 'node:module';

export function resolveWebpackClientPath(relPath: string) {
  const require = createRequire(import.meta.url);
  return require.resolve(`../../client/${relPath}`);
}
