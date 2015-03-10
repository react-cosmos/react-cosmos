var React = require('react/addons'),
    $ = require('jquery'),
    Cosmos = require('../../../cosmos.js'),
    renderComponent = require('../../helpers/render-component.js'),
    ComponentPlayground =
      require('../../../components/component-playground.jsx');

describe('ComponentPlayground component', function() {
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
    sinon.stub(console, 'error');

    // Don't render any children
    sinon.stub(Cosmos, 'createElement');

    // Allow tests to extend the base fixture
    props = {
      fixtures: {
        FirstComponent: {},
        SecondComponent: {
          'simple-state': {
            myProp: true
          }
        }
      }
    };
  });

  afterEach(function() {
    console.error.restore();

    Cosmos.createElement.restore();
  })

  describe('events', function() {
    it('should expand component on click', function() {
      render();

      utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

      expect(component.state.expandedComponents.length).to.equal(1);
      expect(component.state.expandedComponents[0]).to.equal('SecondComponent');
    });

    it('should contract expanded component on click', function() {
      props.state = {
        expandedComponents: ['FirstComponent', 'SecondComponent']
      };

      render();

      utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

      expect(component.state.expandedComponents.length).to.equal(1);
      expect(component.state.expandedComponents[0]).to.equal('FirstComponent');
    });

    describe('editing fixture', function() {
      var triggerChange = function(value) {
        utils.Simulate.change(component.refs.fixtureEditor.getDOMNode(),
                              {target: {value: value}});
      };

      beforeEach(function() {
        props.fixturePath = 'SecondComponent/simple-state';

        render();
      });

      it('should update fixture user input on change', function() {
        triggerChange('lorem ipsum');

        expect(component.state.fixtureUserInput).to.equal('lorem ipsum');
      });

      it('should update fixture contents on valid change', function() {
        triggerChange('{"lorem": "ipsum"}');

        expect(component.state.fixtureContents.lorem).to.equal('ipsum');
      });

      it('should not update fixture contents on invalid change', function() {
        triggerChange('lorem ipsum');

        // We're expecting the initial fixture to be used
        expect(component.state.fixtureContents.myProp).to.equal(true);
      });

      it('should call console.error on invalid change', function() {
        triggerChange('lorem ipsum');

        expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
      });

      it('should mark valid change in state', function() {
        triggerChange('{"lorem": "ipsum"}');

        expect(component.state.isFixtureUserInputValid).to.equal(true);
      });

      it('should mark invalid change in state', function() {
        triggerChange('lorem ipsum');

        expect(component.state.isFixtureUserInputValid).to.equal(false);
      });
    });
  });
});
