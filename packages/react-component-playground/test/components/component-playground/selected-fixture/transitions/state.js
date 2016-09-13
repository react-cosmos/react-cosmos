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

describe(`ComponentPlayground (${FIXTURE}) Transitions State`, () => {
  const React = require('react');
  const _ = require('lodash');
  const ComponentTree = require('react-component-tree');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;
  let stateInjected;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should inject preview state when fixture changes', () => {
    sinon.stub(ComponentTree, 'injectState');

    component.setState({
      fixtureChange: fixture.state.fixtureChange + 1,
    });

    stateInjected = ComponentTree.injectState.lastCall.args;
    expect(stateInjected[0]).to.equal(component.previewComponent);
    expect(stateInjected[1].somethingHappened).to.equal(false);

    ComponentTree.injectState.restore();
  });

  it('shoud not render when setting identical fixture contents', () => {
    sinon.stub(component, 'render').returns(React.createElement('span'));

    component.setState({
      fixtureContents: _.cloneDeep(fixture.state.fixtureContents),
    });

    expect(component.render).to.not.have.been.called;

    component.render.restore();
  });
});
