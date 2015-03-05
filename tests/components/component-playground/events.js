var React = require('react/addons'),
    $ = require('jquery'),
    Cosmos = require('../../../cosmos.js'),
    renderComponent = require('../../helpers/render-component.js'),
    ComponentPlayground = require('../../../components/component-playground.jsx');


describe("ComponentPlayground component", function() {

  var utils = React.addons.TestUtils,
      component,
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
        SecondComponent: {}
      }
    };
  });

  afterEach(function() {
    Cosmos.createElement.restore();
  })

  describe("events", function() {

    it("should expand component on click", function() {
      render();

      utils.Simulate.click(component.refs.SecondComponentButton);

      expect(component.state.expandedComponents.length).to.equal(1);
      expect(component.state.expandedComponents[0]).to.equal('SecondComponent');
    });

    it("should contract expanded component on click", function() {
      props.state = {
        expandedComponents: ['FirstComponent', 'SecondComponent']
      };

      render();

      utils.Simulate.click(component.refs.SecondComponentButton);

      expect(component.state.expandedComponents.length).to.equal(1);
      expect(component.state.expandedComponents[0]).to.equal('FirstComponent');
    })
  });
});
