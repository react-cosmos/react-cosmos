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

  context('imports file', () => {
    it('has port option', () => {
      getImportsFile().should(
        'contain',
        `"playgroundUrl": "http://localhost:5002"`
      );
    });

    it('has fixture paths', () => {
      containsImport('src/__fixtures__/HelloWorld');
      containsImport('src/Counter.fixture');
      containsImport('src/WelcomeMessage/WelcomeMessage.fixture');
    });

    it('has decorator paths', () => {
      containsImport('src/WelcomeMessage/cosmos.decorator');
    });
  });
});

function getImportsFile() {
  return cy.readFile(`examples/${exampleName()}/cosmos.imports.ts`);
}

function containsImport(importPath: string) {
  if (lazy()) {
    getImportsFile().should(
      'match',
      new RegExp(`import\\('./${importPath}'\\)`)
    );
  } else {
    getImportsFile().should(
      'match',
      new RegExp(`import \\* as [a-z0-9]+ from './${importPath}'`)
    );
  }
}
