import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Globals were enabled to make it easier to migrate from Jest to Vitest
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['packages/react-cosmos-renderer/src/**/*', 'jsdom'],
      ['packages/react-cosmos-ui/src/**/*', 'jsdom'],
    ],
    // Default value: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    include: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
    pool: 'forks',
    coverage: {
      include: [
        'packages/*/src/**/*.{ts,tsx}',
        '!**/__fixtures__/**',
        '!**/*.fixture.{js,ts,tsx}',
        '!**/cosmos.decorator.{js,ts,tsx}',
        '!**/testHelpers/**',
        '!**/testMocks/**',
        '!**/@types/**',
        // Ignore coverage from dark launched plugins
        '!packages/react-cosmos-ui/src/plugins/PluginList/**',
        '!packages/react-cosmos-ui/src/plugins/RendererSelect/**',
      ],
    },
  },
  plugins: [
    // Allow testing React Native code without installing react-native
    // https://github.com/vitest-dev/vitest/issues/4326#issuecomment-1766697671
    // Q:This is not needed anymore?
    // { resolveId: id => (id === 'react-native' ? 'virtual:' + id : undefined) },
  ],
});
