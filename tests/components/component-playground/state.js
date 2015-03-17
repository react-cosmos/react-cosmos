var $ = require('jquery'),
    Cosmos = require('../../../cosmos.js'),
    renderComponent = require('../../helpers/render-component.js'),
    ComponentPlayground =
      require('../../../components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var component,
      $component,
      props;

  function render(extraProps) {
    // Alow tests to extend fixture before rendering
    _.merge(props, extraProps);

    component = renderComponent(ComponentPlayground, props);
    $component = $(component.getDOMNode());
  };

  beforeEach(function() {
    // Don't render any children
    sinon.stub(Cosmos, 'createElement');

    props = {
      fixtures: {
        FirstComponent: {
          'blank-state': {
            myProp: false
          }
        },
        SecondComponent: {
          'simple-state': {
            myProp: true
          }
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

    describe('with fixture selected', function() {
      beforeEach(function() {
        _.extend(props, {
          selectedComponent: 'FirstComponent',
          selectedFixture: 'blank-state'
        });
      });

      it('should expand component from selected fixture', function() {
        render();

        var expandedComponents = component.state.expandedComponents;

        expect(expandedComponents.length).to.equal(1);
        expect(expandedComponents[0]).to.equal('FirstComponent');
      });

      it('should populate state with fixture contents', function() {
        render();

        expect(component.state.fixtureContents.myProp).to.equal(false);
      });

      it('should populate user input with stringified fixture contents',
         function() {
        render();

        var fixtureContents = component.state.fixtureContents;

        expect(component.state.fixtureUserInput)
              .to.equal(JSON.stringify(fixtureContents, null, 2));
      });

      describe('on fixture transition', function() {
        beforeEach(function() {
          render({
            state: {
              isFixtureUserInputValid: false
            }
          });

          component.setProps({
            selectedComponent: 'SecondComponent',
            selectedFixture: 'simple-state'
          });
        });

        it('should expand both prev and new components', function() {
          var expandedComponents = component.state.expandedComponents;

          expect(expandedComponents.length).to.equal(2);
          expect(expandedComponents[0]).to.equal('FirstComponent');
          expect(expandedComponents[1]).to.equal('SecondComponent');
        });

        it('should reset fixture contents', function() {
          expect(component.state.fixtureContents.myProp).to.equal(true);
        });

        it('should reset fixture user input', function() {
          var fixtureContents = props.fixtures.FirstComponent['blank-state'];

          expect(JSON.parse(component.state.fixtureUserInput).myProp)
                .to.equal(true);
        });

        it('should reset valid user input flag', function() {
          expect(component.state.isFixtureUserInputValid).to.be.true;
        });
      });
    });
  });
});
