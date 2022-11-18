const { join } = require('path');

// These 3rd party deps are pure ESM and need to be transformed for Jest.
// Once Jest ESM is safe to use, we can remove this.
// https://jestjs.io/docs/ecmascript-modules
const esDependencies = [
  'pkg-up',
  'find-up',
  'locate-path',
  'p-locate',
  'p-limit',
  'yocto-queue',
  'path-exists',
];

module.exports = {
  preset: 'ts-jest',
  resolver: 'ts-jest-resolver',
  testEnvironment: 'jsdom',
  rootDir: join(__dirname, '..'),
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { noUnusedLocals: false } }],
    '^.+\\.js$': ['ts-jest', { tsconfig: { allowJs: true } }],
  },
  // https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: [
    `/node_modules/(?!${esDependencies.join('|')})`,
    '\\.pnp\\.[^\\/]+$',
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!**/__fixtures__/**',
    '!**/*.fixture.{js,ts,tsx}',
    '!**/cosmos.decorator.{js,ts,tsx}',
    '!**/testHelpers/**',
    '!**/@types/**',
    '!packages/react-cosmos/src/playground/components/illustrations/**',
    // Ignore coverage from dark launched plugins
    '!packages/react-cosmos/src/playground/plugins/PluginList/**',
    '!packages/react-cosmos/src/playground/plugins/RendererSelect/**',
  ],
};
