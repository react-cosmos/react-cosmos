const FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Render Children`, function () {
  var loadChild = require('react-component-tree').loadChild,
    render = require('helpers/render-component.js'),
    spyLoadChild = require('helpers/spy-load-child.js'),
    fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
    $component,
    container,
    fixture,
    childParams;

  spyLoadChild();

  beforeEach(function () {
    ({ container, component, $component } = render(fixture));

    childParams = component.children.preview.call(component);
  });

  it('should load preview component', function () {
    expect(loadChild.loadChild).to.have.been.called;
  });

  it('should send component class to preview child', function () {
    expect(childParams.component)
          .to.equal(fixture.components[fixture.component].class);
  });

  it('should send fixture contents to preview child', function () {
    const fixtureContents = fixture.state.fixtureContents;

    for (const key in fixtureContents) {
      if (key !== 'state') {
        expect(childParams[key]).to.deep.equal(fixtureContents[key]);
      }
    }
  });

  it('should send unserializable props to preview child', function () {
    const fixtureUnserializableContents =
        fixture.state.fixtureUnserializableContents;

    for (const key in fixtureUnserializableContents) {
      expect(childParams[key]).to.equal(fixtureUnserializableContents[key]);
    }
  });

  it('should not send state as prop to preview child', function () {
    expect(childParams.state).to.be.undefined;
  });

  it('should generate unique key for preview child', function () {
    expect(childParams.key).to.equal(
        fixture.component + '-' +
        fixture.fixture + '-' +
        component.state.fixtureChange);
  });

  it('should clone fixture contents sent to child', function () {
    expect(childParams.nested.shouldBeCloned).to.deep.equal(
        fixture.state.fixtureContents.nested.shouldBeCloned);
    expect(childParams.nested.shouldBeCloned).to.not.equal(
        fixture.state.fixtureContents.nested.shouldBeCloned);
  });
});
