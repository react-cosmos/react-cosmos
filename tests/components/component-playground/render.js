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
      render({
        fixturePath: 'FirstComponent/error-state'
      });

      var $selectedFixture = $component.find('.component-fixture.selected');

      expect($selectedFixture.length).to.equal(1);
      expect($selectedFixture.text()).to.equal('error state');
    });

    it('should not add full-screen class when prop is false', function() {
      render({
        fullScreen: false
      });

      expect($component.hasClass('full-screen')).to.equal(false);
    });

    it('should add full-screen class when prop is true', function() {
      render({
        fullScreen: true
      });

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
      render({
        fixturePath: 'SecondComponent/simple-state'
      });

      var href = $(component.refs.fullScreenButton.getDOMNode()).attr('href');

      expect(href).to.equal('?fixturePath=SecondComponent%2Fsimple-state' +
                            '&fullScreen=true');
    });

    it('should add container class on preview element', function() {
      render({
        containerClassName: 'my-app-namespace'
      });

      var $previewDOMNode = $(component.refs.previewContainer.getDOMNode());

      expect($previewDOMNode.hasClass('my-app-namespace')).to.equal(true);
    });

    it('should not render fixture editor when closed', function() {
      render({
        state: {
          isFixtureEditorOpen: false
        }
      });

      expect(component.refs.fixtureEditor).to.not.exist;
    })

    it('should render fixture editor when open', function() {
      render({
        state: {
          isFixtureEditorOpen: true
        }
      });

      expect(component.refs.fixtureEditor).to.exist;
    })

    it('should add class on preview when fixture editor is open', function() {
      render({
        fixturePath: 'SecondComponent/simple-state',
        state: {
          isFixtureEditorOpen: true
        }
      });

      expect($(component.refs.previewContainer.getDOMNode())
             .hasClass('aside-fixture-editor')).to.be.true;
    });

    it('should populate fixture editor textarea from state', function() {
      render({
        state: {
          isFixtureEditorOpen: true,
          fixtureUserInput: 'lorem ipsum'
        }
      });

      expect(component.refs.fixtureEditor.getDOMNode().value)
             .to.equal('lorem ipsum');
    });

    it('should add invalid class on fixture editor on state flag', function() {
      render({
        state: {
          isFixtureEditorOpen: true,
          isFixtureUserInputValid: false
        }
      });

      expect($(component.refs.fixtureEditor.getDOMNode())
             .hasClass('invalid-syntax')).to.be.true;
    });
  });
});
