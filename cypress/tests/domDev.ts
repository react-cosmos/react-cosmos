import {
  homepageTests,
  navTests,
  selectFixtureTests,
  staticTests,
} from '../support/testBlocks';

describe('DOM dev', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5000');
  });

  homepageTests();
  navTests();
  selectFixtureTests();
  staticTests();
});
