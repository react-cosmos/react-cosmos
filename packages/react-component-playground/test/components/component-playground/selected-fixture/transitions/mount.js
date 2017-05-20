const FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, () => {
  const _ = require('lodash');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  // The following tests are about the initial state generation, so we don't
  // want it included in the fixture
  const statelessFixture = _.omit(fixture, 'state');

  beforeEach(() => {
    ({ container, component, $component } = render(statelessFixture));
  });

  it('should populate state with fixture contents', () => {
    expect(component.state.fixtureContents.myProp).to.equal(false);
  });

  it('should populate stringified fixture contents as user input', () => {
    expect(component.state.fixtureUserInput).to.equal(
        JSON.stringify(component.state.fixtureContents, null, 2));
  });
});
