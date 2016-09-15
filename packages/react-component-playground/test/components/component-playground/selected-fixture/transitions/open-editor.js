const FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions Open Editor`, () => {
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

    sinon.stub(ComponentTree, 'injectState');

    const updatedFixture = _.clone(fixture);
    _.assign(updatedFixture, {
      editor: true,
    });
    delete updatedFixture.state;

    render(updatedFixture, container);

    stateInjected = ComponentTree.injectState.lastCall.args;
  });

  afterEach(() => {
    ComponentTree.injectState.restore();
  });

  it('should inject state to (re-created) preview child', () => {
    expect(stateInjected[0]).to.equal(component.previewComponent);
    expect(stateInjected[1].somethingHappened).to.equal(false);
  });
});
