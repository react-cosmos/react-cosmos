const { join } = require('path');

module.exports = {
  rootDir: join(__dirname, '..'),
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  setupTestFrameworkScriptFile: '<rootDir>/.jest/setup-framework.ts',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/{__fixtures__,__jsxfixtures__}/**',
    '!**/*.{fixture,jsxfixture}.{js,ts,tsx}',
    '!**/cosmos.decorator.{js,ts,tsx}',
    '!**/testHelpers/**',
    '!**/react-cosmos-playground2/src/shared/illustrations/**',
    // Ignore coverage from dark launched APIs
    '!**/react-cosmos-shared2/src/server/findUserModulePaths.ts',
    '!**/react-cosmos-playground2/src/plugins/ControlPanel/**'
  ]
};
