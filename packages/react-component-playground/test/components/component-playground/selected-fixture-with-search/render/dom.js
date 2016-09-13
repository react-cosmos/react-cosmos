const FIXTURE = 'selected-fixture-with-search';
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

  it('should render the second component based on search value', () => {
    expect(component.refs['componentName-SecondComponent']).to.exist;
  });

  it('should render the second component based on search value', () => {
    expect(component.refs['fixtureButton-SecondComponent-index']).to.exist;
  });

  it('should leave the component with the selected fixture', () => {
    expect(component.refs['componentName-FirstComponent']).to.exist;
  });
});
