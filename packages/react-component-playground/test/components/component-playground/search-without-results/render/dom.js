/* eslint-env browser, mocha */
/* eslint-disable
  global-require,
  no-unused-vars,
  no-unused-expressions,
  import/no-unresolved,
  import/no-extraneous-dependencies
*/
/* global expect, sinon */

const FIXTURE = 'search-without-results';
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

  it('should not render components', () => {
    expect($(component).find(style.components).html()).to.be.empty;
  });
});
