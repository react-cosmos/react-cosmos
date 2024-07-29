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
    pool: 'threads',
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
});
