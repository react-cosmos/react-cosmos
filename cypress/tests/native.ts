import { exampleName } from '../support/envVars';

describe('Native', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5002');
  });

  context('homepage', () => {
    it('has document title', () => {
      cy.title().should('include', `example-${exampleName()}`);
    });

    it('displays pending renderer message', () => {
      cy.contains('Waiting for renderer...');
    });
  });

  context('user deps file', () => {
    it('has port option', () => {
      getUserDepsFile().should(
        'contain',
        `"playgroundUrl": "http://localhost:5002"`
      );
    });

    it('has fixture paths', () => {
      userDepsContainsModule('src/__fixtures__/HelloWorld.ts');
      userDepsContainsModule('src/Counter.fixture.tsx');
      userDepsContainsModule('src/WelcomeMessage/WelcomeMessage.fixture.tsx');
    });

    it('has decorator paths', () => {
      userDepsContainsModule('src/WelcomeMessage/cosmos.decorator.tsx');
    });
  });
});

function getUserDepsFile() {
  return cy.readFile(`examples/${exampleName()}/cosmos.userdeps.js`);
}

function userDepsContainsModule(modulePath: string) {
  getUserDepsFile().should(
    'match',
    new RegExp(`import (fixture|decorator)[0-9]+ from './${modulePath}'`)
  );
}
