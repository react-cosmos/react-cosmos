const { join } = require('path');

// These 3rd party deps are pure ESM and need to be transformed for Jest.
// Once Jest ESM is safe to use, we can remove this.
// https://jestjs.io/docs/ecmascript-modules
const esDependencies = [
  '@skidding/async-retry',
  'async-until',
  'find-up',
  'locate-path',
  'p-limit',
  'p-locate',
  'path-exists',
  'pkg-up',
  'yocto-queue',
];

module.exports = {
  preset: 'ts-jest',
  resolver: 'ts-jest-resolver',
  testEnvironment: 'jsdom',
  rootDir: join(__dirname, '..'),
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  modulePathIgnorePatterns: ['__testFs__'],
  moduleNameMapper: {
    // This seems faster than transpiling node_modules/lodash-es
    'lodash-es': '<rootDir>/node_modules/lodash/lodash.js',
    // Jest with jsdom environment imports the "browser" ws export, which
    // is a noop because wp isn't meant to be used in a browser environment.
    // Issue introduced here https://github.com/websockets/ws/pull/2118
    ws: '<rootDir>/node_modules/ws/index.js',
    // These files are mocked because they are only available after
    // Cosmos packages are built, and tests should run with source code only.
    'react-cosmos-ui/dist/playground.bundle.js.map':
      '<rootDir>/packages/react-cosmos/src/testMocks/playground.bundle.js.map',
    'react-cosmos-ui/dist/playground.bundle.js':
      '<rootDir>/packages/react-cosmos/src/testMocks/playground.bundle.js',
    // Mock ESM code that can't run in Jest until ESM support is ready
    // https://github.com/jestjs/jest/issues/9430
    'requireModule.js$':
      '<rootDir>/packages/react-cosmos/src/esmMocks/requireModule.js',
    'resolve.js$': '<rootDir>/packages/react-cosmos/src/esmMocks/resolve.js',
    'staticPath.js$':
      '<rootDir>/packages/react-cosmos/src/esmMocks/staticPath.js',
    'resolveWebpackClientPath.js$':
      '<rootDir>/packages/react-cosmos-plugin-webpack/src/server/esmMocks/resolveWebpackClientPath.js',
    'resolveWebpackLoaderPath.js$':
      '<rootDir>/packages/react-cosmos-plugin-webpack/src/server/esmMocks/resolveWebpackLoaderPath.js',
  },
  // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
  transform: {
    '^.+\\.[jt]sx?$': [
      'ts-jest',
      { tsconfig: { allowJs: true, noUnusedLocals: false } },
    ],
  },
  // https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: [
    `/node_modules/(?!${esDependencies.join('|')}/)`,
    '\\.pnp\\.[^\\/]+$',
  ],
  collectCoverageFrom: [
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
};
