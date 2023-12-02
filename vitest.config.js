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
        // Ignore coverage from unsupported ES modules
        '!packages/react-cosmos/src/utils/requireModule.ts',
        '!packages/react-cosmos/src/utils/resolve.ts',
        '!packages/react-cosmos/src/shared/staticPath.ts',
        '!packages/react-cosmos-plugin-webpack/src/client/index.ts',
        '!packages/react-cosmos-plugin-webpack/src/client/errorOverlay/index.ts',
        '!packages/react-cosmos-plugin-webpack/src/server/utils/requireModule.ts',
        '!packages/react-cosmos-plugin-webpack/src/server/utils/resolve.ts',
        '!packages/react-cosmos-plugin-webpack/src/server/webpackConfig/resolveWebpackClientPath.ts',
        '!packages/react-cosmos-plugin-webpack/src/server/webpackConfig/resolveWebpackLoaderPath.ts',
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
