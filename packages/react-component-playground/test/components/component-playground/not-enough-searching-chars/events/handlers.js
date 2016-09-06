var FIXTURE = 'not-enough-searching-chars';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('helpers/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));
  });

  it('should store the search input value in state', function() {
    component.onSearchChange({target: {value: 'second'}});

    expect(component.state.searchText).to.equal('second');
  });

  it('should not filter the components', function() {
    expect(component.getFilteredFixtures()).to.deep.equal(fixture.components)
  });
});
