import { homepageTests } from '../support/testBlocks';

describe('Export', () => {
  // WARNING: These tests are serial and share state
  before(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5002');
  });

  context('homepage', () => {
    it('has document title', () => {
      cy.title().should('include', 'React Cosmos');
    });

    it('displays pending renderer message', () => {
      cy.contains('Waiting for renderer...');
    });
  });

  context('user deps file', () => {
    it('has port option', () => {
      getUserDepsFile().should('contain', `"port": 5002`);
    });

    it('has fixture paths', () => {
      userDepsContainsModule('__fixtures__/Hello World.ts');
      userDepsContainsModule('Counter/index.fixture.tsx');
      userDepsContainsModule('WelcomeMessage/index.fixture.tsx');
    });

    it('has decorator paths', () => {
      userDepsContainsModule('WelcomeMessage/cosmos.decorator.tsx');
    });
  });
});

function getUserDepsFile() {
  return cy.readFile('example/cosmos.userdeps.js');
}

function userDepsContainsModule(moduleName) {
  getUserDepsFile().should('contain', `'${moduleName}': require(`);
}
