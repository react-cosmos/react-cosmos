const FIXTURE = 'selected-fixture-with-search';

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

  it('should store the search input value in state', () => {
    component.onSearchChange({ target: { value: 'second' } });

    expect(component.state.searchText).to.equal('second');
  });

  it('should filter the components', () => {
    expect(component.getFilteredFixtures()).to.have.all.keys(
        'FirstComponent', 'SecondComponent');
  });
});
