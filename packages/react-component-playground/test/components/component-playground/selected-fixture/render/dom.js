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

  it('should add container class on preview element', () => {
    const $previewContainer = $(component.refs.previewContainer);

    expect($previewContainer.hasClass(fixture.containerClassName)).to.be.true;
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
});
