const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Render Children`, function () {
  var loadChild = require('react-component-tree').loadChild,
    render = require('helpers/render-component.js'),
    spyLoadChild = require('helpers/spy-load-child.js'),
    fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
    $component,
    container,
    fixture;

  spyLoadChild();

  beforeEach(function () {
    ({ container, component, $component } = render(fixture));
  });

  it('should load preview child', function () {
    expect(loadChild.loadChild).to.have.been.calledWith(component, 'preview');
  });

  it('should load split-pane child', function () {
    expect(loadChild.loadChild).to.have.been.calledWith(component, 'splitPane');
  });
});
