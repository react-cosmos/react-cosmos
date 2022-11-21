import { createRequire } from 'node:module';

// NOTE: This is ESM code that can't run in Jest yet, which means that this
// module always needs to be mocked in tests until Jest adds ESM support.

export function resolveWebpackLoaderPath() {
  const require = createRequire(import.meta.url);
  return require.resolve('./userDepsLoader.cjs');
}
