var parseFixturePath =
    require('../../../component-playground/lib/parse-fixture-path.js');

describe('Parse fixture path', function() {
  it('should extract component and fixture name', function() {
    var parts = parseFixturePath('./my-component/my-state.js');

    expect(parts[1]).to.equal('my-component');
    expect(parts[2]).to.equal('my-state');
  });

  it('should extract nested component and fixture name', function() {
    var parts = parseFixturePath('./component-group/my-component/my-state.js');

    expect(parts[1]).to.equal('component-group/my-component');
    expect(parts[2]).to.equal('my-state');
  });
})
