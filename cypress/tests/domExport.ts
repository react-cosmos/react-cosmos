import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests,
} from '../support/testBlocks';

describe('DOM export', () => {
  before(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5001');
  });

  homepageTests();
  navTests();
  selectFixtureTests();
  staticTests();
});
