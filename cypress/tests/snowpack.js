import { homepageTests, navTests, staticTests } from '../support/testBlocks';

describe('DOM dev', () => {
  // WARNING: These tests are serial and share state
  before(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5010');
  });

  homepageTests();
  navTests();
  staticTests();
});
