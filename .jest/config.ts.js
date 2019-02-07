const { join } = require('path');

module.exports = {
  rootDir: join(__dirname, '..'),
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)test.{ts,tsx}'],
  setupTestFrameworkScriptFile: '<rootDir>/.jest/setup-framework.ts'
};
