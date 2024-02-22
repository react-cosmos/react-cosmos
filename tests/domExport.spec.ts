import { test } from '@playwright/test';
import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests,
} from './helpers/testBlocks.js';

const url = 'http://localhost:5001';

test.describe('DOM export', () => {
  homepageTests(url);
  navTests(url);
  selectFixtureTests(url);
  staticTests(url);
});
