describe("Components implementing the AnimationLoop mixin", function() {

  var _ = require('lodash'),
      jsdom = require('jsdom');

  // jsdom creates a fresh new window object for every test case and React needs
  // to be required *after* the window and document globals are available. The
  // var references however must be declared globally in order to be accessible
  // in test cases as well.
  var React,
      utils,
      Cosmos;

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../build/cosmos.js');
  });

  // In order to avoid any sort of state between tests, even the component class
  // generated for every test case
  var generateComponentClass = function(attributes) {
    return React.createClass(_.extend({}, {
      mixins: [Cosmos.mixins.AnimationLoop],
      render: function() {
        return React.DOM.span();
      }
    }, attributes));
  };

  var ComponentClass,
      componentInstance;

  describe("[with fake clock]", function() {

    beforeEach(function() {
      jasmine.clock().install();
    });
    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("should call onFrame method after starting animation loop", function() {
      var onFrameSpy = jasmine.createSpy('onFrame');
      ComponentClass = generateComponentClass({onFrame: onFrameSpy});
      componentInstance = utils.renderIntoDocument(ComponentClass());
      componentInstance.startAnimationLoop();
      jasmine.clock().tick(1000 / 60);
      expect(onFrameSpy.calls.count()).toBe(1);
    });

    it("should call onFrame with 60fps", function() {
      var onFrameSpy = jasmine.createSpy('onFrame');
      ComponentClass = generateComponentClass({onFrame: onFrameSpy});
      componentInstance = utils.renderIntoDocument(ComponentClass());
      componentInstance.startAnimationLoop();
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(60);
    });

    it("shouldn't call onFrame after stopping animation loop", function() {
      var onFrameSpy = jasmine.createSpy('onFrame');
      ComponentClass = generateComponentClass({onFrame: onFrameSpy});
      componentInstance = utils.renderIntoDocument(ComponentClass());
      componentInstance.startAnimationLoop();
      componentInstance.stopAnimationLoop();
      // Simulate one second before checking if calls were made after stopping
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(0);
    });

    it("shouldn't call onFrame after unmounting", function() {
      var onFrameSpy = jasmine.createSpy('onFrame'),
          componentContainer = document.createElement('div');
      ComponentClass = generateComponentClass({onFrame: onFrameSpy});
      componentInstance = React.renderComponent(ComponentClass(),
                                                componentContainer);
      componentInstance.startAnimationLoop();
      React.unmountComponentAtNode(componentContainer);
      // Simulate one second before checking if calls were made after
      // unmounting
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(0);
    });

    it("should resume animation when mounting previously animating state", function() {
      var onFrameSpy = jasmine.createSpy('onFrame'),
          snapshot;
      ComponentClass = generateComponentClass({
        mixins: [Cosmos.mixins.PersistState,
                 Cosmos.mixins.AnimationLoop],
        onFrame: onFrameSpy
      });
      componentInstance = utils.renderIntoDocument(ComponentClass());
      componentInstance.startAnimationLoop();
      snapshot = componentInstance.generateSnapshot();
      componentInstance.stopAnimationLoop();

      // Make sure calls weren't from the 1st Component
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(0);

      // Load state into a 2nd Component
      componentInstance = utils.renderIntoDocument(ComponentClass(snapshot));
      // It appers we need to add an extra millisecond for the Component to mount
      jasmine.clock().tick(1001);
      expect(onFrameSpy.calls.count()).toBe(60);
    });
  });

  it("should return frames proportional to time passed", function(done) {
    var onFrameSpy = jasmine.createSpy('onFrame');
    ComponentClass = generateComponentClass({onFrame: onFrameSpy});
    componentInstance = utils.renderIntoDocument(ComponentClass());

    // Instad of using the public methods, we're calling the internal animation
    // callback as if the browser were lagging and we're receiving 6 frames at
    // a time (roughly 10fps)
    componentInstance._prevTime = Date.now();
    // This will delay tests with real time (0.1 seconds);
    setTimeout(function() {
      componentInstance._animationCallback();
      componentInstance.stopAnimationLoop();
      expect(onFrameSpy.calls.mostRecent().args[0]).toBeCloseTo(6, 0);
      done();
    }, 100);
  });
});
