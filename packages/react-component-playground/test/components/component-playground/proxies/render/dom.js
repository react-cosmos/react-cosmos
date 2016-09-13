const FIXTURE = 'proxies';
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

  it('should render markup proxy', () => {
    expect(component.refs.MarkupProxy).to.exist;
  });

  it('should render prop mutator proxy', () => {
    expect(component.refs.PropMutatorProxy).to.exist;
  });

  it('should render the selected component', () => {
    expect(component.refs.preview).to.exist;
  });

  it('should mutate component prop', () => {
    expect(component.refs.preview.props.myProp).to.be.true;
  });

  it('should add text span next to component', () => {
    expect(component.refs.MarkupProxy.refs.textSpan.innerHTML)
      .to.equal('Add some text near component');
  });
});
