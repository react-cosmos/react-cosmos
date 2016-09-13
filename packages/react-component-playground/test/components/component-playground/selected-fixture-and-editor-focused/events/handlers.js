const FIXTURE = 'selected-fixture-and-editor-focused';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, () => {
  const ComponentTree = require('react-component-tree');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));

    sinon.spy(component, 'setState');
  });

  afterEach(() => {
    component.setState.restore();
  });

  it('should ignore fixture update', () => {
    component.onFixtureUpdate();

    expect(component.setState).to.not.have.been.called;
  });
});
