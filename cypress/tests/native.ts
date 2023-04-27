import { exampleName, lazy } from '../support/envVars';

describe('Native', () => {
  before(() => {
    cy.clearStorage();
    cy.visit('http://localhost:5002');
  });

  context('homepage', () => {
    it('has document title', () => {
      cy.title().should('include', `example-${exampleName()}`);
    });

    it('displays welcome message', () => {
      cy.contains('Welcome to React Cosmos');
    });
  });

  context('nav', () => {
    it('renders tree view root items', () => {
      cy.contains('Counter');
      cy.contains('CounterButton');
      cy.contains('WelcomeMessage');
      cy.contains('HelloWorld');
    });
  });

  context('select fixture', () => {
    it('displays pending renderer message', () => {
      cy.contains('HelloWorld').click();
      cy.contains('Waiting for renderer');
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
      containsImport('src/__fixtures__/HelloWorld.js');
      containsImport('src/Counter.fixture.js');
      containsImport('src/WelcomeMessage/WelcomeMessage.fixture.js');
    });

    it('has decorator paths', () => {
      containsImport('src/WelcomeMessage/cosmos.decorator.js');
    });
  });
});

function getUserDepsFile() {
  return cy.readFile(`examples/${exampleName()}/cosmos.modules.ts`);
}

function containsImport(modulePath: string) {
  if (lazy()) {
    getUserDepsFile().should(
      'match',
      new RegExp(`import\\('./${modulePath}'\\)`)
    );
  } else {
    getUserDepsFile().should(
      'match',
      new RegExp(`import \\* as [a-z0-9]+ from './${modulePath}'`)
    );
  }
}
