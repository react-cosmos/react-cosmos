/* eslint-env browser, mocha */
/* eslint-disable
  global-require,
  no-unused-vars,
  no-unused-expressions,
  import/no-unresolved,
  import/no-extraneous-dependencies
*/
/* global expect, sinon */

const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Render URLs`, () => {
  const render = require('helpers/render-component');
  const getUrlProps = require('helpers/get-url-props');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should generate close fixture editor url', () => {
    const urlProps = getUrlProps(component.refs.editorButton);

    // The editor prop is undefined because default values are ignored
    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
    });
  });

  it('should include editor prop in fixture url', () => {
    const firstFixtureButton =
        component.refs['fixtureButton-FirstComponent-default'];
    const urlProps = getUrlProps(firstFixtureButton);

    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
      editor: true,
    });
  });

  it('should not include editor prop in full-screen url', () => {
    const urlProps = getUrlProps(component.refs.fullScreenButton);

    expect(urlProps.editor).to.equal(undefined);
  });
});
