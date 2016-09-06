const FIXTURE = 'default';

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

  it('should generate urls with component and fixture names', function () {
    for (const componentName in fixture.components) {
      const fixtures = fixture.components[componentName].fixtures;

      for (const fixtureName in fixtures) {
        const fixtureButton = component.refs[
            'fixtureButton-' + componentName + '-' + fixtureName];
        const urlProps = getUrlProps(fixtureButton);

        expect(urlProps).to.deep.equal({
          component: componentName,
          fixture: fixtureName,
        });
      }
    }
  });
});
