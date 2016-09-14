const FIXTURE = 'proxies';
const style = require('component-playground/components/component-playground.less');
const React = require('react');
const { findDOMNode } = require('react-dom-polyfill')(React);

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
    expect(findDOMNode(component.previewComponent).parentNode.className)
      .to.equal('markupProxy');
  });

  it('should render the selected component', () => {
    expect(component.previewComponent).to.exist;
  });

  it('should mutate component prop', () => {
    expect(component.previewComponent.props.myProp).to.be.true;
  });

  it('should add text span next to component', () => {
    expect(findDOMNode(component.previewComponent).previousSibling.innerHTML)
      .to.equal('Add some text near component');
  });
});
