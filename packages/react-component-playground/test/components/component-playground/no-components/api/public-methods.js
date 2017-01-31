const FIXTURE = 'no-components';

describe(`ComponentPlayground (${FIXTURE}) Public Methods`, () => {
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  describe('userHasComponents', () => {
    it('should be false, no components found', () => {
      expect(component.userHasComponents()).to.equal(false);
    });
  });

  describe('userHasFixtures', () => {
    it('should be false, no fixtures found', () => {
      expect(component.userHasFixtures()).to.equal(false);
    });
  });
});
