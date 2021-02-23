describe('Native', () => {
  // WARNING: These tests are serial and share state
  before(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5002');
  });

  context('homepage', () => {
    it('has document title', () => {
      cy.title().should('include', 'react-cosmos-example');
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
      userDepsContainsModule('src/__fixtures__/HelloWorld.ts');
      userDepsContainsModule('src/Counter/Counter.fixture.tsx');
      userDepsContainsModule('src/WelcomeMessage/WelcomeMessage.fixture.tsx');
    });

    it('has decorator paths', () => {
      userDepsContainsModule('src/WelcomeMessage/cosmos.decorator.tsx');
    });
  });
});

function getUserDepsFile() {
  return cy.readFile('example/cosmos.userdeps.js');
}

function userDepsContainsModule(modulePath) {
  getUserDepsFile().should(
    'match',
    new RegExp(`import (fixture|decorator)[0-9]+ from './${modulePath}'`)
  );
}
