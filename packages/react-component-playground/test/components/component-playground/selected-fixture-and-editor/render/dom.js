var FIXTURE = 'selected-fixture-and-editor';
var style = require('component-playground/components/component-playground.less');

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, function() {
  var $ = require('jquery'),
      render = require('helpers/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));
  });

  it('should render fixture editor', function() {
    expect(component.refs.editor).to.exist;
  });

  it('should add editor class on content frame node', function() {
    expect($(component.refs.contentFrame)
           .hasClass(style['with-editor'])).to.be.true;
  });

  it('should add selected class on editor button', function() {
    expect($(component.refs.editorButton)
           .hasClass(style['selected-button'])).to.be.true;
  });

  it('should populate editor textarea from state', function() {
    component.setState({
      fixtureUserInput: 'lorem ipsum'
    });

    expect(component.refs.editor.value).to.equal('lorem ipsum');
  });

  it('should add invalid class on editor on state flag', function() {
    component.setState({
      isFixtureUserInputValid: false
    });

    expect($(component.refs.editor)
           .hasClass(style['invalid-syntax'])).to.be.true;
  });
});
