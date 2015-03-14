var $ = require('jquery'),
    Cosmos = require('../../../cosmos.js'),
    renderComponent = require('../../helpers/render-component.js'),
    ComponentPlayground =
      require('../../../components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var component,
      $component,
      props,
      childProps;

  // Alow tests to extend fixture before rendering
  function render(extraProps) {
    _.merge(props, extraProps);

    component = renderComponent(ComponentPlayground, props);
    $component = $(component.getDOMNode());

    if (Cosmos.createElement.callCount) {
      childProps = Cosmos.createElement.lastCall.args[0];
    }
  };

  beforeEach(function() {
    // Don't render any children
    sinon.stub(Cosmos, 'createElement');

    // Allow tests to extend the base fixture
    props = {
      fixtures: {
        MyComponent: {
          'small-size': {
            width: 200,
            height: 100
          }
        }
      },
      fixturePath: 'MyComponent/small-size'
    };
  });

  afterEach(function() {
    Cosmos.createElement.restore();
  })

  describe('children', function() {
    it('should not render child if no fixture is selected', function() {
      delete props.fixturePath;

      render();

      expect(Cosmos.createElement).to.not.have.been.called;
    });

    it('should send down component name to preview child', function() {
      render();

      expect(childProps.component).to.equal('MyComponent');
    });

    it('should send fixture contents to preview child', function() {
      render();

      var fixtureContents = component.state.fixtureContents;
      expect(childProps.width).to.equal(fixtureContents.width);
      expect(childProps.height).to.equal(fixtureContents.height);
    });

    it('should send (Cosmos) router instance to preview child', function() {
      render({
        router: {}
      });

      expect(childProps.router).to.equal(props.router);
    });

    it('should use fixture contents as key for preview child', function() {
      render();

      var fixtureContents = component.state.fixtureContents,
          stringifiedFixtureContents = JSON.stringify(fixtureContents);
      expect(childProps.key).to.equal(stringifiedFixtureContents);
    });

    it('should clone fixture contents sent to child', function() {
      var obj = {};

      render({
        fixtures: {
          MyComponent: {
            'small-size': {
              shouldBeCloned: obj
            }
          }
        }
      });

      expect(childProps.shouldBeCloned).to.not.equal(obj);
    });
  });
});
