import { clearStorage } from '../support/localStorage';
import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests
} from '../support/testBlocks';

describe('Export', () => {
  // WARNING: These tests are serial and share state
  before(() => {
    return clearStorage().then(() => cy.visit('http://localhost:5001'));
  });

  homepageTests();
  navTests();
  selectFixtureTests();
  staticTests();
});
