const FIXTURE = 'search-without-results';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, () => {
  const ComponentTree = require('react-component-tree');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should not render any components based on search value', () => {
    expect(component.getFilteredFixtures()).to.be.empty;
  });
});
