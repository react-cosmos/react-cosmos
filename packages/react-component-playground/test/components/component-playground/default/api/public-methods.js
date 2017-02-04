const FIXTURE = 'default';

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
    it('should be true, components found', () => {
      expect(component.userHasComponents()).to.equal(true);
    });
  });

  describe('userHasFixtures', () => {
    it('should be true, fixtures found', () => {
      expect(component.userHasFixtures()).to.equal(true);
    });
  });
});
