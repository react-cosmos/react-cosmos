const FIXTURE = 'selected-fixture';

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

  describe('orientation', () => {
    function simulateWindowResize(width, height) {
      sinon.stub(component, 'getContentNode').returns({
        offsetWidth: width,
        offsetHeight: height,
      });

      component.onWindowResize();
    }

    it('should be set to landscape on width > height', () => {
      simulateWindowResize(300, 200);

      expect(component.setState.lastCall.args[0].orientation).to.equal('landscape');
    });

    it('should be set to landscape on width == height', () => {
      simulateWindowResize(300, 300);

      expect(component.setState.lastCall.args[0].orientation).to.equal('landscape');
    });

    it('should be set to portrait on width < height', () => {
      simulateWindowResize(200, 300);

      expect(component.setState.lastCall.args[0].orientation).to.equal('portrait');
    });
  });
});
