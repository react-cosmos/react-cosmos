var parseComponentPath =
  require('../../../component-playground/lib/parse-component-path.js');

describe('Parse component path', function() {
  it('should extract component name', function() {
    var componentPath = './my-component.jsx';
    var parts = parseComponentPath(componentPath);

    expect(parts[1]).to.equal('my-component');
  });

  it('should extract nested component and fixture folder name', function() {
    var componentPath = './component-group1/component-group/my-component.jsx';
    var parts = parseComponentPath(componentPath);
    expect(parts[1])
      .to.equal('component-group1/component-group/my-component');
  });
});
