import { test } from '@playwright/test';
import { webTests } from './helpers/webTests.js';

const url = 'http://localhost:5000';
const rendererUrl = 'http://localhost:5000/renderer.html';
const initialLoadTimeout = 30000;

test.describe('DOM dev', () => {
  test.beforeAll(async ({ page }) => {
    // NOTE: It seems that the webpack plugin can sometimes slow the Cosmos
    // server while it's compiling
    await page.waitForURL(url, { timeout: initialLoadTimeout });
    await page.waitForURL(rendererUrl, { timeout: initialLoadTimeout });
  });

  webTests(url);
});
