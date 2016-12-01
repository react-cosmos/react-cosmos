const FIXTURE = 'selected-fixture';
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

  it('should remove selected class on home button', () => {
    expect($(component.refs.homeButton)
           .hasClass(style['selected-button'])).to.be.false;
  });

  it('should add extra class to selected fixture', () => {
    const classes = `.${style['component-fixture']}.${style.selected}`;
    const $fixture = $component.find(classes);

    expect($fixture.length).to.equal(1);
    expect($fixture.text()).to.equal('default');
  });

  it('should render full screen button', () => {
    expect(component.refs.fullScreenButton).to.exist;
  });

  it('should render fixture editor button', () => {
    expect(component.refs.editorButton).to.exist;
  });

  it('should render fixture loader frame', () => {
    expect(component.loaderFrame).to.exist;
  });

  it('should render fixture loader frame with `/loader/ src`', () => {
    expect(component.loaderFrame.src).to.match(/\/loader\/$/);
  });
});
