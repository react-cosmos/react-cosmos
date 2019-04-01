const { join } = require('path');
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest',
  transform: { ...tsjPreset.transform },
  testEnvironment: 'jsdom',
  rootDir: join(__dirname, '..'),
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup-framework.ts'],
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/{__fixtures__,__jsxfixtures__}/**',
    '!**/*.{fixture,jsxfixture}.{js,ts,tsx}',
    '!**/cosmos.decorator.{js,ts,tsx}',
    '!**/testHelpers/**',
    '!**/react-cosmos-playground2/src/shared/illustrations/**',
    // Ignore coverage from dark launched APIs
    '!**/react-cosmos-playground2/src/plugins/ControlPanel/**'
  ]
};
