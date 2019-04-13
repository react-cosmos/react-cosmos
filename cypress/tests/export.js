import { clearTreeViewState } from '../support/localStorage';
import {
  homepageTests,
  navTests,
  selectFixtureTests
} from '../support/testBlocks';

describe('Export', () => {
  // WARNING: These tests are serial and share state
  before(() => {
    return clearTreeViewState().then(() => cy.visit('http://localhost:5001'));
  });

  homepageTests();
  navTests();
  selectFixtureTests();
});
