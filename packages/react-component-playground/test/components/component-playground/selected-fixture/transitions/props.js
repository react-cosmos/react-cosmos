var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions Props`, function() {
  var _ = require('lodash'),
      ComponentTree = require('react-component-tree'),
      render = require('helpers/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture,
      stateSet,
      stateInjected;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));

    sinon.stub(ComponentTree, 'injectState');
    sinon.spy(component, 'setState');

    const updatedFixture = _.clone(fixture);
    _.assign(updatedFixture, {
      component: 'SecondComponent',
      fixture: 'index'
    });
    delete updatedFixture.state;

    render(updatedFixture, container);

    stateSet = component.setState.lastCall.args[0];
    stateInjected = ComponentTree.injectState.lastCall.args;
  });

  afterEach(function() {
    ComponentTree.injectState.restore();
    component.setState.restore();
  });

  it('should replace fixture contents', function() {
    expect(stateSet.fixtureContents.myProp).to.equal(true);
  });

  it('should reset unserializable fixture props', function() {
    expect(stateSet.fixtureUnserializableProps).to.deep.equal({});
  });

  it('should replace fixture user input', function() {
    expect(JSON.parse(stateSet.fixtureUserInput).myProp).to.equal(true);
  });

  it('should reset valid user input flag', function() {
    expect(stateSet.isFixtureUserInputValid).to.be.true;
  });

  it('should inject new state to preview child', function() {
    expect(stateInjected[0]).to.equal(component.refs.preview);
    expect(stateInjected[1].somethingHappened).to.equal(true);
  });
});
