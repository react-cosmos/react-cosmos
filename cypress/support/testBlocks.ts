import { exampleName } from './envVars';

export function homepageTests() {
  context('homepage', () => {
    it('has document title', () => {
      cy.title().should('include', `example-${exampleName()}`);
    });

    it('displays welcome message', () => {
      // It seems the webpack plugin can sometimes slow the Cosmos server
      // while it's compiling
      cy.contains('Welcome to React Cosmos', { timeout: 60000 });
    });

    it('shows renderer connected notification', () => {
      cy.contains('Renderer connected', { timeout: 60000 });
    });
  });
}

export function navTests() {
  context('nav', () => {
    it('renders tree view root items', () => {
      cy.contains('Counter');
      cy.contains('CounterButton');
      cy.contains('WelcomeMessage');
      cy.contains('HelloWorld');
    });

    it('expands tree view items', () => {
      cy.contains('Counter').click();
      cy.contains('default');
      cy.contains('small number');
      cy.contains('large number');
    });
  });
}

export function selectFixtureTests() {
  context('select fixture', () => {
    it('renders selected fixtures', () => {
      cy.contains('HelloWorld').click();
      getRendererBody().find('#root').should('have.text', 'Hello World!');
    });

    it('renders updated fixture', () => {
      cy.contains('Counter').click();
      cy.contains('large number').click();
      getRendererBody().find('button').should('have.text', '555555555 times');
      getRendererBody()
        .find('button')
        .dblclick()
        .should('have.text', '555555557 times');
    });

    it('renders searched fixture', () => {
      getRendererBody().type(`{meta}k`);
      cy.get('[placeholder="Fixture search"]').type(`Hello`).type('{enter}');
      getRendererBody().find('#root').should('have.text', 'Hello World!');
    });
  });
}

export function staticTests() {
  context('static path', () => {
    it('serves static asset', () => {
      cy.request('/cookie.txt').its('body').should('include', 'nom nom nom');
    });
  });
}

function getRendererBody() {
  return cy.get('iframe').then($iframe => $iframe.contents().find('body'));
}
