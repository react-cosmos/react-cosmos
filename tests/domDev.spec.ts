import { test } from '@playwright/test';
import { webTests } from './helpers/webTests.js';

const url = 'http://localhost:5000';

test.describe('DOM dev', () => {
  webTests(url);
});
