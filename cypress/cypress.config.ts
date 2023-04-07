import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '7gsfa8',
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  // Disabled test isoation to try to fix flakiness of domDev test on Windows.
  // Every now and then it would fail before running any test with the message:
  // "This page was cleared by navigating to about:blank."
  // Found it here: https://stackoverflow.com/a/74762655
  testIsolation: false,
  e2e: {
    specPattern: 'cypress/tests/**/*.{js,jsx,ts,tsx}',
  },
});
