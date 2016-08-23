var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions State`, function() {
  var React = require('react'),
      _ = require('lodash'),
      ComponentTree = require('react-component-tree'),
      render = require('helpers/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture,
      stateInjected;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));
  });

  it('should inject preview state when fixture changes', function() {
    sinon.stub(ComponentTree, 'injectState');

    component.setState({
      fixtureChange: fixture.state.fixtureChange + 1
    });

    stateInjected = ComponentTree.injectState.lastCall.args;
    expect(stateInjected[0]).to.equal(component.refs.preview);
    expect(stateInjected[1].somethingHappened).to.equal(false);

    ComponentTree.injectState.restore();
  });

  it('shoud not render when setting identical fixture contents', function() {
    sinon.stub(component, 'render').returns(React.createElement('span'));

    component.setState({
      fixtureContents: _.cloneDeep(fixture.state.fixtureContents)
    });

    expect(component.render).to.not.have.been.called;

    component.render.restore();
  });
});
