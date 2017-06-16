const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Render Children`, () => {
  const loadChild = require('react-component-tree').loadChild;
  const render = require('helpers/render-component');
  const spyLoadChild = require('helpers/spy-load-child');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  spyLoadChild();

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  it('should load split-pane child', () => {
    expect(loadChild.loadChild).to.have.been.calledWith(component, 'splitPane');
  });
});
