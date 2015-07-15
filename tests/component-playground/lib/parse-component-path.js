var parseComponentPath =
  require('../../../component-playground/lib/parse-component-path.js');

describe('Parse fixture path', function() {
  it('should extract component name', function() {
    var componentPath = './my-component.jsx';
    expect(parseComponentPath(componentPath)).to.equal('my-component');
  });

  it('should extract nested component and fixture name', function() {
    var componentPath = './component-group/my-component.jsx';
    expect(parseComponentPath(componentPath)).to.equal('my-component');
  });
});
