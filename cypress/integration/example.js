import { clearTreeViewState } from '../support/localStorage';

describe('Example', () => {
  beforeEach(() => {
    cy.visit('/').then(() => clearTreeViewState());
  });

  context('homepage', () => {
    it('has document title', () => {
      cy.title().should('include', 'React Cosmos');
    });

    it('displays welcome message', () => {
      cy.contains('Welcome to Cosmos Next');
    });

    it('shows renderer connected notification', () => {
      cy.contains('Renderer connected');
    });
  });

  context('nav', () => {
    it('renders tree view root items', () => {
      cy.contains('Counter');
      cy.contains('WelcomeMessage');
      cy.contains('hello world');
    });

    it('expands tree view items', () => {
      cy.contains('Counter').click();
      cy.contains('small numbers').click();
      cy.contains('fifty');
      cy.contains('fifty five');
    });
  });

  context('select fixture', () => {
    it('renders selected fixture', () => {
      cy.contains('hello world').click();
      getRendererBody()
        .find('#root')
        .should('have.text', 'Hello World!');
    });
  });

  context.only('fixture state', () => {
    it('preseves state after HMR update', () => {
      cy.contains('Counter').click();
      cy.contains('large number').click();
      getRendererBody()
        .find('button')
        .should('have.text', '555555555 times');
      getRendererBody()
        .find('button')
        .click()
        .click()
        .should('have.text', '555555557 times');
      getRendererWindow().then(rendererWindow => {
        rendererWindow.__fakeHotReload();
      });
      getRendererBody()
        .find('button')
        .should('have.text', '555555557 times');
    });
  });
});

function getRendererBody() {
  return cy.get('iframe').then($iframe => $iframe.contents().find('body'));
}

function getRendererWindow() {
  return cy.get('iframe').then($iframe => $iframe[0].contentWindow);
}
