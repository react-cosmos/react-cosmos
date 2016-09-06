/* eslint-env browser, mocha */
/* eslint-disable
  global-require,
  no-unused-vars,
  no-unused-expressions,
  import/no-unresolved,
  import/no-extraneous-dependencies
*/
/* global expect, sinon */

const FIXTURE = 'selected-fixture';

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

  it('should generate open full-screen url', () => {
    const urlProps = getUrlProps(component.refs.fullScreenButton);

    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
      fullScreen: true,
    });
  });

  it('should generate open fixture editor url', () => {
    const urlProps = getUrlProps(component.refs.editorButton);

    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
      editor: true,
    });
  });
});
