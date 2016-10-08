const FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Render URLs`, () => {
  const render = require('helpers/render-component');
  const getUrlProps = require('helpers/get-url-props');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should generate urls with component and fixture names', () => {
    Object.keys(fixture.components).forEach((componentName) => {
      const fixtures = fixture.fixtures[componentName];

      Object.keys(fixtures).forEach((fixtureName) => {
        const fixtureButton = component.refs[
            `fixtureButton-${componentName}-${fixtureName}`];
        const urlProps = getUrlProps(fixtureButton);

        expect(urlProps).to.deep.equal({
          component: componentName,
          fixture: fixtureName,
        });
      });
    });
  });
});
