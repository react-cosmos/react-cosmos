import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests
} from '../support/testBlocks';

describe('Export', () => {
  // WARNING: These tests are serial and share state
  before(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5001');
  });

  homepageTests();
  navTests();
  selectFixtureTests();
  staticTests();
});
