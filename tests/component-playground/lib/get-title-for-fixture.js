var getTitleForFixture =
    require('../../../component-playground/lib/get-title-for-fixture.js');

describe('Get title for fixture', function() {
  it('should return "React Component Playground" ' +
     'when no fixture is selected', function() {
    var title = getTitleForFixture({});

    expect(title).to.equal('React Component Playground');
  });

  it('should include component and fixture name in title ' +
     'when no fixture is selected', function() {
    var title = getTitleForFixture({
      selectedComponent: 'FooComponent',
      selectedFixture: 'bar-fixture'
    });

    expect(title)
          .to.equal('FooComponent:bar-fixture – React Component Playground');
  });
})
