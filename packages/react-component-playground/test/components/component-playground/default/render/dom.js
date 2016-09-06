/* eslint-env browser, mocha */
/* eslint-disable
  global-require,
  no-unused-vars,
  no-unused-expressions,
  import/no-unresolved,
  import/no-extraneous-dependencies
*/
/* global expect, sinon */

const FIXTURE = 'default';
const style = require('component-playground/components/component-playground.less');

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, () => {
  const $ = require('jquery');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should render component names', () => {
    Object.keys(fixture.components).forEach((componentName) => {
      const nameElement = component.refs[`componentName-${componentName}`];

      expect($(nameElement).text()).to.equal(componentName);
    });
  });

  it('should render fixture buttons', () => {
    Object.keys(fixture.components).forEach((componentName) => {
      const fixtures = fixture.components[componentName].fixtures;

      Object.keys(fixtures).forEach((fixtureName) => {
        expect(component.refs[
            `fixtureButton-${componentName}-${fixtureName}`]).to.exist;
      });
    });
  });

  it('should render fixture names', () => {
    Object.keys(fixture.components).forEach((componentName) => {
      const fixtures = fixture.components[componentName].fixtures;

      Object.keys(fixtures).forEach((fixtureName) => {
        const fixtureButton = component.refs[
            `fixtureButton-${componentName}-${fixtureName}`];

        expect($(fixtureButton).text()).to.equal(fixtureName);
      });
    });
  });

  it('should not have full-screen class', () => {
    expect($component.hasClass(style['full-screen'])).to.equal(false);
  });

  it('should not render full screen button', () => {
    expect(component.refs.fullScreenButton).to.not.exist;
  });

  it('should not render fixture editor button', () => {
    expect(component.refs.editorButton).to.not.exist;
  });

  it('should not render fixture editor', () => {
    expect(component.refs.editor).to.not.exist;
  });

  it('should add selected class on home button', () => {
    expect($(component.refs.homeButton)
           .hasClass(style['selected-button'])).to.be.true;
  });

  it('should render the search input', () => {
    expect(component.refs.filterInput).to.exist;
  });

  it('should set the correct class name to search input', () => {
    expect($(component.refs.filterInput)
           .hasClass(style['filter-input'])).to.be.true;
  });

  it('should not render a split-pane', () => {
    expect(component.refs.splitPane).to.not.exist;
  });
});
