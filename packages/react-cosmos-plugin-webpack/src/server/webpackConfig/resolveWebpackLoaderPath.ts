import { createRequire } from 'node:module';

export function resolveWebpackLoaderPath() {
  const require = createRequire(import.meta.url);
  return require.resolve('./userImportsLoader.cjs');
}
