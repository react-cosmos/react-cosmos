const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Render URLs`, function () {
  var render = require('helpers/render-component.js'),
    getUrlProps = require('helpers/get-url-props.js'),
    fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
    $component,
    container,
    fixture;

  beforeEach(function () {
    ({ container, component, $component } = render(fixture));
  });

  it('should generate close fixture editor url', function () {
    const urlProps = getUrlProps(component.refs.editorButton);

    // The editor prop is undefined because default values are ignored
    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
    });
  });

  it('should include editor prop in fixture url', function () {
    let firstFixtureButton =
        component.refs['fixtureButton-FirstComponent-default'],
      urlProps = getUrlProps(firstFixtureButton);

    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
      editor: true,
    });
  });

  it('should not include editor prop in full-screen url', function () {
    const urlProps = getUrlProps(component.refs.fullScreenButton);

    expect(urlProps.editor).to.equal(undefined);
  });
});
