const { join } = require('path');

// Why aren't we using Jest projects?
// _Grab your popcorn_
//
// What are Jest projects?
// - https://jestjs.io/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html#multi-project-runner-configuration-overhaul
// - https://jestjs.io/docs/en/cli#projects-project1-projectn-
//
// Reasons to use projects:
// 1. Only load react-native preset in react-native tests. But presets cannot
//    be specified per project, only globally.
//    https://github.com/facebook/jest/issues/6292
// 2. Easily filter tests by project (eg. only run fast tests). But filtering
//    only applies to files names, not project names.
//    https://github.com/facebook/jest/issues/6358#issuecomment-413166783
//    https://github.com/facebook/jest/issues/5595#issuecomment-369755739
//
// Why not create separate configs altogether? Because we want the coverage
// report to include all tests.

module.exports = {
  rootDir: join(__dirname, '..'),
  preset: 'react-native',
  // Test environment is sometimes set to 'node' in specific test files
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)test.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '/__fsmocks__/',
    '/_shared'
  ],
  watchPathIgnorePatterns: ['jestnowatch'],
  transformIgnorePatterns: [
    // Ignore node_modules compilation except for
    // - src/ paths from other packages in the monorepo
    // - node_modules/react-native/
    '/node_modules/(?!((react-cosmos[a-z0-9-]*|react-querystring-router)/src|react-native/))'
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(jpg|png)$': '<rootDir>/packages/react-cosmos-playground/img-stub.js'
  },
  setupFiles: ['<rootDir>/.jest/setup-enzyme-adapter-react.js'],
  setupTestFrameworkScriptFile: '<rootDir>/.jest/setup-framework.js',
  testURL: 'http://foo.bar/',
  globals: {
    fetch: '__GLOBAL_FETCH_MOCK__',
    COSMOS_CONFIG: {
      containerQuerySelector: '__mock__containerQuerySelector'
    }
  },
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/{__fixtures__,__jsxfixtures__}/**',
    '!**/*.{fixture,jsxfixture}.js',
    '!**/cosmos.decorator.js',
    '!**/testHelpers/**',
    '!**/react-cosmos-voyager/src/use-cases/**',
    // Ignore coverage from dark launched APIs
    '!**/react-cosmos-playground2/src/plugins/ControlPanel/**',
    '!**/react-cosmos/src/client/next/**',
    '!**/react-cosmos/src/server/web/webpack/embed-modules-webpack-loader-next.js',
    '!**/react-cosmos-shared2/src/server/findUserModulePaths.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text']
};
