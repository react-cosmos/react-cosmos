const FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Render Children`, () => {
  const loadChild = require('react-component-tree').loadChild;
  const render = require('helpers/render-component');
  const spyLoadChild = require('helpers/spy-load-child');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;
  let childParams;

  spyLoadChild();

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));

    childParams = component.children.preview.call(component);
  });

  it('should load preview component', () => {
    expect(loadChild.loadChild).to.have.been.called;
  });

  it('should send component class to preview child', () => {
    expect(childParams.component)
          .to.equal(fixture.components[fixture.component].class);
  });

  it('should send fixture contents to preview child', () => {
    const fixtureContents = fixture.state.fixtureContents;

    Object.keys(fixtureContents).forEach((key) => {
      if (key !== 'state') {
        expect(childParams[key]).to.deep.equal(fixtureContents[key]);
      }
    });
  });

  it('should send unserializable props to preview child', () => {
    const fixtureUnserializableProps =
        fixture.state.fixtureUnserializableProps;

    Object.keys(fixtureUnserializableProps).forEach((key) => {
      expect(childParams[key]).to.deep.equal(fixtureUnserializableProps[key]);
    });
  });

  it('should not send state as prop to preview child', () => {
    expect(childParams.state).to.be.undefined;
  });

  it('should clone fixture contents sent to child', () => {
    expect(childParams.nested.shouldBeCloned).to.deep.equal(
        fixture.state.fixtureContents.nested.shouldBeCloned);
    expect(childParams.nested.shouldBeCloned).to.not.equal(
        fixture.state.fixtureContents.nested.shouldBeCloned);
  });
});
