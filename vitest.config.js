import { defineConfig } from 'vitest/config';

const testInclude = [
  'packages/*/src/**/__tests__/**/*.{ts,tsx}',
  'packages/*/src/**/?(*.)test.{ts,tsx}',
];
const jsdomTestInclude = [
  'packages/react-cosmos-renderer/src/**/__tests__/**/*.{ts,tsx}',
  'packages/react-cosmos-renderer/src/**/?(*.)test.{ts,tsx}',
  'packages/react-cosmos-ui/src/**/__tests__/**/*.{ts,tsx}',
  'packages/react-cosmos-ui/src/**/?(*.)test.{ts,tsx}',
  'packages/react-cosmos/src/getFixtures/getFixtures.test.ts',
];

export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
  test: {
    // Globals were enabled to make it easier to migrate from Jest to Vitest
    globals: true,
    setupFiles: ['./vitest-setup.js'],
    testTimeout: 10_000,
    pool: 'threads',
    // Disabling isolation makes tests faster but breaks tests in some packages.
    // react-cosmos-core and react-cosmos-renderer tests pass without isolation,
    // but react-cosmos-ui and react-cosmos tests fail due to mocking issues.
    // Potentially relevant: https://github.com/vitest-dev/vitest/issues/4894
    isolate: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: testInclude,
          exclude: [...jsdomTestInclude],
        },
      },
      {
        extends: true,
        test: {
          name: 'jsdom',
          environment: 'jsdom',
          include: jsdomTestInclude,
        },
      },
    ],
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
