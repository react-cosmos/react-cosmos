const FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, function () {
  var render = require('helpers/render-component.js'),
    fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
    $component,
    container,
    fixture;

  beforeEach(function () {
    ({ container, component, $component } = render(fixture));

    sinon.spy(component, 'setState');
  });

  afterEach(function () {
    component.setState.restore();
  });

  it('should ignore fixture update', function () {
    component.onFixtureUpdate();

    expect(component.setState).to.not.have.been.called;
  });
});
