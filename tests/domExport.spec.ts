import { test } from '@playwright/test';
import { webTests } from './helpers/webTests.js';

const url = 'http://localhost:5001';

test.describe('DOM export', () => {
  webTests(url);
});
