var $ = require('jquery'),
    Cosmos = require('../../../cosmos.js'),
    renderComponent = require('../../helpers/render-component.js'),
    ComponentPlayground =
      require('../../../components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var component,
      $component,
      props;

  // Alow tests to extend fixture before rendering
  function render() {
    component = renderComponent(ComponentPlayground, props);
    $component = $(component.getDOMNode());
  };

  beforeEach(function() {
    // Don't render any children
    sinon.stub(Cosmos, 'createElement');

    // Allow tests to extend the base fixture
    props = {
      fixtures: {
        FirstComponent: {},
        SecondComponent: {
          'simple-state': {}
        }
      }
    };
  });

  afterEach(function() {
    Cosmos.createElement.restore();
  })

  describe('state', function() {
    it('should default to no expanded components', function() {
      render();

      expect(component.state.expandedComponents.length).to.equal(0);
    });

    it('should expand component from selected fixture', function() {
      props.fixturePath = 'SecondComponent/simple-state';

      render();

      expect(component.state.expandedComponents.length).to.equal(1);
      expect(component.state.expandedComponents[0]).to.equal('SecondComponent');
    });
  });
});
