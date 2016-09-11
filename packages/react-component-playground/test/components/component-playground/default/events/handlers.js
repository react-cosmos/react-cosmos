const FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, () => {
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
