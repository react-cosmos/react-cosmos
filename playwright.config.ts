import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  // Run tests in files in parallel
  // fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  reporter: [['html', { outputFolder: './tests/playwright-report' }]],
  outputDir: './tests/test-results',
  use: {
    viewport: { width: 1440, height: 900 },
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
