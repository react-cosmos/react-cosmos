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
    Cosmos = require('../../build/cosmos.js');
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
      componentElement,
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
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);
      componentInstance.startAnimationLoop();
      jasmine.clock().tick(1000 / 60);
      expect(onFrameSpy.calls.count()).toBe(1);
    });

    it("should call onFrame with 60fps", function() {
      var onFrameSpy = jasmine.createSpy('onFrame');
      ComponentClass = generateComponentClass({onFrame: onFrameSpy});
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);
      componentInstance.startAnimationLoop();
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(60);
    });

    it("shouldn't call onFrame after stopping animation loop", function() {
      var onFrameSpy = jasmine.createSpy('onFrame');
      ComponentClass = generateComponentClass({onFrame: onFrameSpy});
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);
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
      componentElement = React.createElement(ComponentClass);
      componentInstance = React.render(componentElement, componentContainer);

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
        mixins: [Cosmos.mixins.ComponentTree,
                 Cosmos.mixins.AnimationLoop],
        onFrame: onFrameSpy
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);
      componentInstance.startAnimationLoop();
      snapshot = componentInstance.serialize();
      componentInstance.stopAnimationLoop();

      // Make sure calls weren't from the 1st Component
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(0);

      // Load state into a 2nd Component
      componentElement = React.createElement(ComponentClass, snapshot);
      componentInstance = utils.renderIntoDocument(componentElement);

      // It appers we need to add an extra millisecond for the Component to mount
      jasmine.clock().tick(1001);
      expect(onFrameSpy.calls.count()).toBe(60);
    });

    it("should stop animation when mounting previously stopped state", function() {
      var onFrameSpy = jasmine.createSpy('onFrame'),
          snapshot;
      ComponentClass = generateComponentClass({
        mixins: [Cosmos.mixins.ComponentTree,
                 Cosmos.mixins.AnimationLoop],
        onFrame: onFrameSpy
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);
      componentInstance.stopAnimationLoop();
      snapshot = componentInstance.serialize();
      componentInstance.startAnimationLoop();

      // Make sure animation runs until loading stopped state
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(60);
      // Load the state of the stopping animation inside the same component
      componentInstance.setProps({state: snapshot.state});
      jasmine.clock().tick(1000);
      expect(onFrameSpy.calls.count()).toBe(60);
    });
  });

  it("should return frames proportional to time passed", function(done) {
    var onFrameSpy = jasmine.createSpy('onFrame');
    ComponentClass = generateComponentClass({onFrame: onFrameSpy});
    componentElement = React.createElement(ComponentClass);
    componentInstance = utils.renderIntoDocument(componentElement);

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
