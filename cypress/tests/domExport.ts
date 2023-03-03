import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests,
} from '../support/testBlocks';

describe('DOM export', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5001');
  });

  homepageTests();
  navTests();
  selectFixtureTests();
  staticTests();
});
