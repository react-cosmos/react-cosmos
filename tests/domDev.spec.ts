import { test } from '@playwright/test';
import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests,
} from './helpers/testBlocks.js';

const url = 'http://localhost:5000';

test.describe('DOM dev', () => {
  // cy.clearStorage();
  homepageTests(url);
  navTests(url);
  selectFixtureTests(url);
  staticTests(url);
});
