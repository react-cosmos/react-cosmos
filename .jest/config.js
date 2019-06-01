const { join } = require('path');
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest',
  transform: { ...tsjPreset.transform },
  testEnvironment: 'jsdom',
  rootDir: join(__dirname, '..'),
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup-framework.ts'],
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/__fixtures__/**',
    '!**/*.fixture.{js,ts,tsx}',
    '!**/cosmos.decorator.{js,ts,tsx}',
    '!**/testHelpers/**',
    '!**/@types/**',
    '!**/react-cosmos-playground2/src/shared/illustrations/**',
    // Ignore coverage from dark launched plugins
    '!**/react-cosmos-playground2/src/plugins/ControlPanel/**',
    '!**/react-cosmos-playground2/src/plugins/PropsPanel/**',
    '!**/react-cosmos-playground2/src/plugins/ClassStatePanel/**',
    '!**/react-cosmos-playground2/src/plugins/PluginList/**',
    '!**/react-cosmos-playground2/src/plugins/RendererSelect/**'
  ]
};
