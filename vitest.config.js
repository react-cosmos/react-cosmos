import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Globals were enabled to make it easier to migrate from Jest to Vitest
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['packages/react-cosmos-renderer/src/**/*', 'jsdom'],
      ['packages/react-cosmos-ui/src/**/*', 'jsdom'],
      ['packages/react-cosmos/src/getFixtures/getFixtures.test.ts', 'jsdom'],
    ],
    // Default value: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    include: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
    setupFiles: ['./vitest-setup.js'],
    pool: 'threads',
    poolOptions: {
      threads: {
        // Disabling isolation makes tests faster but breaks tests in some packages.
        // react-cosmos-core and react-cosmos-renderer tests pass without isolation,
        // but react-cosmos-ui and react-cosmos tests fail due to mocking issues.
        // Potentially relevant: https://github.com/vitest-dev/vitest/issues/4894
        isolate: true,
      },
    },
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
