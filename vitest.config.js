import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // TODO: Try to disable this after migration from Jest to Vitest is complete
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['packages/react-cosmos-renderer/src/**/*', 'jsdom'],
      ['packages/react-cosmos-ui/src/**/*', 'jsdom'],
    ],
    // Default value: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    include: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  },
  plugins: [
    // Allow testing React Native code without installing react-native
    // https://github.com/vitest-dev/vitest/issues/4326#issuecomment-1766697671
    // This is not needed anymore?
    // { resolveId: id => (id === 'react-native' ? 'virtual:' + id : undefined) },
  ],
});
