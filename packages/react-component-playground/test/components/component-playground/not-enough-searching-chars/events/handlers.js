const FIXTURE = 'not-enough-searching-chars';

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

  it('should not filter the fixtures', () => {
    expect(component.getFilteredFixtures()).to.deep.equal(fixture.fixtures);
  });
});
