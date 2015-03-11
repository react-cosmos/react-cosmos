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
        FirstComponent: {
          'blank-state': {},
          'error-state': {},
          'available-state': {}
        },
        SecondComponent: {
          'simple-state': {}
        }
      }
    };
  });

  afterEach(function() {
    Cosmos.createElement.restore();
  })

  describe('render', function() {
    it('should render each component', function() {
      render();

      var $components = $component.find('.component');

      expect($components.length).to.equal(2);
    });

    it('should render component names', function() {
      render();

      var $names = $component.find('.component-name');

      expect($names.eq(0).text()).to.equal('FirstComponent');
      expect($names.eq(1).text()).to.equal('SecondComponent');
    });

    it('should render nested fixtures', function() {
      render();

      var $component1 = $component.find('.component:eq(0)'),
          $component2 = $component.find('.component:eq(1)');

      expect($component1.find('.component-fixtures li').length).to.equal(3);
      expect($component2.find('.component-fixtures li').length).to.equal(1);
    });

    it('should add spaces from hypens in fixture names', function() {
      render();

      var $component1 = $component.find('.component:eq(0)'),
          $component2 = $component.find('.component:eq(1)');

      expect($component1.find('.component-fixtures li:first').text())
            .to.equal('blank state');
      expect($component2.find('.component-fixtures li:first').text())
            .to.equal('simple state');
    });

    it('should add class to expanded components', function() {
      props.fixturePath = 'FirstComponent/error-state';

      render();

      var $selectedFixture = $component.find('.component-fixture.selected');

      expect($selectedFixture.length).to.equal(1);
      expect($selectedFixture.text()).to.equal('error state');
    });

    it('should not add full-screen class when prop is false', function() {
      props.fullScreen = false;

      render();

      expect($component.hasClass('full-screen')).to.equal(false);
    });

    it('should add full-screen class when prop is true', function() {
      props.fullScreen = true;

      render();

      expect($component.hasClass('full-screen')).to.equal(true);
    });

    it('should generate url with fixture path', function() {
      render();

      var firstHref = $component.find('.component-fixture a').attr('href');

      expect(firstHref).to.equal('?fixturePath=FirstComponent%2Fblank-state');
    });

    it('should not render full-screen button w/out fixture selected',
       function() {
      render();

      expect(component.refs.fullScreenButton).to.not.exist;
    });

    it('should generate full-screen url', function() {
      props.fixturePath = 'SecondComponent/simple-state';

      render();

      var href = $(component.refs.fullScreenButton.getDOMNode()).attr('href');

      expect(href).to.equal('?fixturePath=SecondComponent%2Fsimple-state' +
                            '&fullScreen=true');
    });

    it('should add container class on preview element', function() {
      props.containerClassName = 'my-app-namespace';

      render();

      var $previewDOMNode = $(component.refs.previewContainer.getDOMNode());

      expect($previewDOMNode.hasClass('my-app-namespace')).to.equal(true);
    });

    it('should not render fixture editor when closed', function() {
      props.state = {
        isFixtureEditorOpen: false
      };

      render();

      expect(component.refs.fixtureEditor).to.not.exist;
    })

    it('should render fixture editor when open', function() {
      props.state = {
        isFixtureEditorOpen: true
      };

      render();

      expect(component.refs.fixtureEditor).to.exist;
    })

    it('should add class on preview when fixture editor is open', function() {
      props.fixturePath = 'SecondComponent/simple-state';
      props.state = {
        isFixtureEditorOpen: true
      };

      render();

      expect($(component.refs.previewContainer.getDOMNode())
             .hasClass('aside-fixture-editor')).to.be.true;
    });

    it('should populate fixture editor textarea from state', function() {
      props.state = {
        isFixtureEditorOpen: true,
        fixtureUserInput: 'lorem ipsum'
      };

      render();

      expect(component.refs.fixtureEditor.getDOMNode().value)
             .to.equal('lorem ipsum');
    });

    it('should add invalid class on fixture editor on state flag', function() {
      props.state = {
        isFixtureEditorOpen: true,
        isFixtureUserInputValid: false
      };

      render();

      expect($(component.refs.fixtureEditor.getDOMNode())
             .hasClass('invalid-syntax')).to.be.true;
    });
  });
});
