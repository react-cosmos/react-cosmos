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

describe(`ComponentPlayground (${FIXTURE}) Render Children`, () => {
  const loadChild = require('react-component-tree').loadChild;
  const render = require('helpers/render-component');
  const spyLoadChild = require('helpers/spy-load-child');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  spyLoadChild();

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should not load preview component', () => {
    expect(loadChild.loadChild).to.not.have.been.called;
  });
});
