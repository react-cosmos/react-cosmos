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
  function render(extraProps) {
    _.merge(props, extraProps);

    component = renderComponent(ComponentPlayground, props);
    $component = $(component.getDOMNode());
  };

  beforeEach(function() {
    // Don't render any children
    sinon.stub(Cosmos, 'createElement');

    // Allow tests to extend the base fixture
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

    it('should expand component from selected fixture', function() {
      render({
        fixturePath: 'SecondComponent/simple-state'
      });

      expect(component.state.expandedComponents.length).to.equal(1);
      expect(component.state.expandedComponents[0]).to.equal('SecondComponent');
    });

    it('should populate state with fixture contents', function() {
      render({
        fixturePath: 'SecondComponent/simple-state'
      });

      expect(component.state.fixtureContents.myProp).to.equal(true);
    });

    it('should populate user input with stringified fixture contents',
       function() {
      render({
        fixturePath: 'SecondComponent/simple-state'
      });

      var fixtureContents = component.state.fixtureContents;
      expect(component.state.fixtureUserInput)
            .to.equal(JSON.stringify(fixtureContents, null, 2));
    });

    describe('on fixture transition', function() {
      it('should reset expanded components', function() {
        render({
          fixturePath: 'SecondComponent/simple-state'
        });

        component.setProps({fixturePath: 'FirstComponent/blank-state'});

        expect(component.state.expandedComponents.length).to.equal(1);
        expect(component.state.expandedComponents[0])
              .to.equal('FirstComponent');
      });

      it('should reset fixture contents', function() {
        render({
          fixturePath: 'SecondComponent/simple-state'
        });

        component.setProps({fixturePath: 'FirstComponent/blank-state'});

        expect(component.state.fixtureContents.myProp).to.equal(false);
      });

      it('should reset fixture user input', function() {
        render({
          fixturePath: 'SecondComponent/simple-state'
        });

        component.setProps({fixturePath: 'FirstComponent/blank-state'});

        var fixtureContents = props.fixtures.FirstComponent['blank-state'];
        expect(component.state.fixtureUserInput)
              .to.equal(JSON.stringify(fixtureContents, null, 2));
      });

      it('should reset valid user input flag', function() {
        render({
          fixturePath: 'SecondComponent/simple-state',
          state: {
            isFixtureUserInputValid: false
          }
        });

        component.setProps({fixturePath: 'FirstComponent/blank-state'});

        expect(component.state.isFixtureUserInputValid).to.be.true;
      });
    });
  });
});
