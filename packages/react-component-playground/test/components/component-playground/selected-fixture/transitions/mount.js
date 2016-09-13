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

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, () => {
  const _ = require('lodash');
  const ComponentTree = require('react-component-tree');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  // The following tests are about the initial state generation, so we don't
  // want it included in the fixture
  const statelessFixture = _.omit(fixture, 'state');

  beforeEach(() => {
    sinon.stub(ComponentTree, 'injectState');

    ({ container, component, $component } = render(statelessFixture));
  });

  afterEach(() => {
    ComponentTree.injectState.restore();
  });

  it('should populate state with serializable fixture contents', () => {
    expect(component.state.fixtureContents.myProp).to.equal(false);
  });

  it('should populate state with unserializable fixture props', () => {
    expect(component.state.fixtureUnserializableProps.children).to.equal(
        fixture.components[fixture.component]
               .fixtures[fixture.fixture].children);
  });

  it('should populate stringified fixture contents as user input', () => {
    expect(component.state.fixtureUserInput).to.equal(
        JSON.stringify(component.state.fixtureContents, null, 2));
  });

  it('should inject state to preview child', () => {
    const args = ComponentTree.injectState.lastCall.args;
    expect(args[0]).to.equal(component.previewComponent);
    expect(args[1].somethingHappened).to.equal(false);
  });
});
