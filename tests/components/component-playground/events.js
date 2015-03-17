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

  function render(extraProps) {
    // Alow tests to extend fixture before rendering
    _.merge(props, extraProps);

    component = renderComponent(ComponentPlayground, props);
    $component = $(component.getDOMNode());
  };

  beforeEach(function() {
    sinon.stub(console, 'error');

    // Don't render any children
    sinon.stub(Cosmos, 'createElement');

    props = {
      fixtures: {}
    };
  });

  afterEach(function() {
    console.error.restore();

    Cosmos.createElement.restore();
  })

  describe('events', function() {
    describe('clicking on components', function() {
      beforeEach(function() {
        props.fixtures = {
          FirstComponent: {},
          SecondComponent: {
            'simple-state': {}
          }
        };
      });

      it('should expand component on click', function() {
        render();

        utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

        var expandedComponents = component.state.expandedComponents;
        expect(expandedComponents.length).to.equal(1);
        expect(expandedComponents[0]).to.equal('SecondComponent');
      });

      it('should keep expanding components click', function() {
        render({
          state: {
            expandedComponents: ['FirstComponent']
          }
        });

        utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

        var expandedComponents = component.state.expandedComponents;
        expect(expandedComponents.length).to.equal(2);
        expect(expandedComponents[0]).to.equal('FirstComponent');
        expect(expandedComponents[1]).to.equal('SecondComponent');
      });

      it('should contract expanded component on click', function() {
        render({
          state: {
            expandedComponents: ['FirstComponent', 'SecondComponent']
          }
        });

        utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

        var expandedComponents = component.state.expandedComponents;
        expect(expandedComponents.length).to.equal(1);
        expect(expandedComponents[0]).to.equal('FirstComponent');
      });
    });

    describe('editing fixture', function() {
      var triggerChange = function(value) {
        utils.Simulate.change(component.refs.fixtureEditor.getDOMNode(),
                              {target: {value: value}});
      };

      var initialFixtureContents = {
        myProp: 'dolor sit'
      };

      beforeEach(function() {
        render({
          fixtureEditor: true,
          state: {
            fixtureContents: initialFixtureContents
          }
        });
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

        expect(component.state.fixtureContents.myProp)
               .to.equal(initialFixtureContents.myProp);
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
