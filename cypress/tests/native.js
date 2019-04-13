import { clearTreeViewState } from '../support/localStorage';
import { homepageTests } from '../support/testBlocks';

describe('Export', () => {
  // WARNING: These tests are serial and share state
  before(() => {
    return clearTreeViewState().then(() => cy.visit('http://localhost:5002'));
  });

  context('homepage', () => {
    it('has document title', () => {
      cy.title().should('include', 'React Cosmos');
    });

    it('displays pending renderer message', () => {
      cy.contains('Waiting for renderer...');
    });
  });
});
