const FIXTURE = 'selected-fixture-and-editor';
const style = require('component-playground/components/component-playground.less');

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, () => {
  const $ = require('jquery');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should render fixture editor', () => {
    expect(component.refs.editor).to.exist;
  });

  it('should add selected class on editor button', () => {
    expect($(component.refs.editorButton)
           .hasClass(style['selected-button'])).to.be.true;
  });

  it('should populate editor textarea from state', () => {
    component.setState({
      fixtureUserInput: 'lorem ipsum',
    });
    expect(component.refs.editor.props.value).to.equal('lorem ipsum');
  });

  it('should render a split-pane', () => {
    expect(component.refs.splitPane).to.exist;
  });

  it('should have proper split orientation on split-pane', () => {
    const splitByOrientation = {
      portrait: 'horizontal',
      landscape: 'vertical',
    };

    expect(component.refs.splitPane.props.split)
      .to.equal(splitByOrientation[component.state.orientation]);
  });
});
