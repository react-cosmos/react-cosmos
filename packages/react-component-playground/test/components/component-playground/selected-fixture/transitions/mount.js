var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('helpers/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  // The following tests are about the initial state generation, so we don't
  // want it included in the fixture
  var statelessFixture = _.omit(fixture, 'state');

  beforeEach(function() {
    sinon.stub(ComponentTree, 'injectState');

    ({container, component, $component} = render(statelessFixture));
  });

  afterEach(function() {
    ComponentTree.injectState.restore();
  });

  it('should populate state with serializable fixture contents', function() {
    expect(component.state.fixtureContents.myProp).to.equal(false);
  });

  it('should populate state with unserializable fixture props', function() {
    expect(component.state.fixtureUnserializableProps.children).to.equal(
        fixture.components[fixture.component]
               .fixtures[fixture.fixture].children);
  });

  it('should populate stringified fixture contents as user input', function() {
    expect(component.state.fixtureUserInput).to.equal(
        JSON.stringify(component.state.fixtureContents, null, 2));
  });

  it('should inject state to preview child', function() {
    var args = ComponentTree.injectState.lastCall.args;
    expect(args[0]).to.equal(component.refs.preview);
    expect(args[1].somethingHappened).to.equal(false);
  });
});
