import { getSelector } from '../support/utils/css-modules';

describe('Local state example', () => {
  context('homepage', () => {
    before(() => {
      cy.visit('/');
    });

    it('should have correct title', () => {
      cy.title().should('include', 'React Cosmos');
    });

    it('should list components', () => {
      const componentSel = getSelector('component-playground__component-name');
      cy.get(`${componentSel}:eq(0)`).should('contain', 'Counter');
      cy.get(`${componentSel}:eq(1)`).should('contain', 'CounterList');
    });

    it('should list fixtures', () => {
      const fixtureSel = getSelector('component-playground__component-fixture');
      cy.get(`${fixtureSel}:eq(0)`).should('contain', 'default');
      cy.get(`${fixtureSel}:eq(1)`).should('contain', 'fiveClicks');
      cy.get(`${fixtureSel}:eq(2)`).should('contain', 'default');
      cy.get(`${fixtureSel}:eq(3)`).should('contain', 'oneTwoThree');
    });

    it('should show welcome message', () => {
      cy
        .get(getSelector('display-screen__header'))
        .should('contain', 'You\'re all set');
    });
  });

  context('filter', () => {
    before(() => {
      const inputSel = getSelector('component-playground__filter-input');
      cy.get(inputSel).type('oneThree');
    });

    it('should match only one fixture', () => {
      const fixtureSel = getSelector('component-playground__component-fixture');
      cy
        .get(fixtureSel)
        .should('have.length', 1)
        .eq(0)
        .should('contain', 'oneTwoThree');
    });

    context('select fixture', () => {
      // There's only one fixture at this point
      const fixtureButtonSel = `${getSelector('component-playground__component-fixture')}:eq(0)`;

      before(() => {
        cy.get(fixtureButtonSel).click();
      });

      it('should add active class to button', () => {
        cy
          .get(fixtureButtonSel)
          .then($fixtureButton => {
            return $fixtureButton.attr('class');
          })
          .should('contain', 'component-playground__selected__');
      });

      it('should render Loader iframe', () => {
        cy
          .get('iframe')
          .should('have.exist')
          .should('have.attr', 'src', './loader/index.html');
      });

      context('fixture editor', () => {});
    });
  });
});
