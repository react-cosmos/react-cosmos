var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('helpers/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));

    sinon.spy(component, 'setState');
  });

  afterEach(function() {
    component.setState.restore();
  });

  describe('orientation', function() {
    function simulateWindowResize(width, height) {
      sinon.stub(component, 'getContentNode').returns({
        offsetWidth: width,
        offsetHeight: height
      });

      component.onWindowResize();
    }

    it('should be set to landscape on width > height', function() {
      simulateWindowResize(300, 200);

      expect(component.setState.lastCall.args[0].orientation).to.equal('landscape');
    });

    it('should be set to landscape on width == height', function() {
      simulateWindowResize(300, 300);

      expect(component.setState.lastCall.args[0].orientation).to.equal('landscape');
    });

    it('should be set to portrait on width < height', function() {
      simulateWindowResize(200, 300);

      expect(component.setState.lastCall.args[0].orientation).to.equal('portrait');
    });
  });
});
