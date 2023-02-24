import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests,
} from '../support/testBlocks';

describe('DOM dev', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5000', { timeout: 120000 });
  });

  homepageTests();
  navTests();
  selectFixtureTests();
  staticTests();
});
