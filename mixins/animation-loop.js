(function(Cosmos, window) {

Cosmos.mixins.AnimationLoop = {
  /**
   * Simple API for running a callback at 60fps. The callback receives a
   * *frames* argument which is equal to the number of frames passed since the
   * last call. Ideally, if the browser performs seamlessly the *frames* will
   * always be `1`. However, when the browser lags behind the value will
   * increase, akin to a frame-skipping mechanism. This way you can use the
   * *frames* value as a multiplier for a transition step.
   *
   * A requestAnimationFrame>setTimeout polyfill is used for the callbacks.
   *
   * TODO: shouldComponentUpdate should return false when only
   * state.animationRequestId changed
   */
  start: function() {
    // Prevent running more callbacks at the same time
    this.stop();
    this._nextFrame();
  },
  stop: function() {
    this._clearAnimation();
    this.setState({animationRequestId: null});
  },
  componentDidMount: function() {
    // If the Component state was frozen with an on-going animation it will
    // resume as soon as a Component is mounted with the same state
    if (this.state && this.state.animationRequestId) {
      this.start();
    }
  },
  componentWillUnmount: function() {
    this._clearAnimation();
  },
  _nextFrame: function() {
    this._prevTime = Date.now();
    this.setState({
      // Keep a reference to the animation request for two reasons:
      // - To be able to clear it on stop()
      // - To be reflected in the state of the Component, which will resume
      //   animating when loaded in a mounting Component later on
      animationRequestId: requestAnimationFrame(this._animationCallback)
    });
  },
  _clearAnimation: function() {
    if (this.state && this.state.animationRequestId) {
      cancelAnimationFrame(this.state.animationRequestId);
    }
  },
  _animationCallback: function() {
    if (typeof(this.onFrame) != 'function') {
      return;
    }
    var now = Date.now(),
        timePassed = now - this._prevTime,
        timeExpected = 1000 / 60;

    this.onFrame(timePassed / timeExpected);
    this._nextFrame();
  }
};

// Polyfill inspired by Paul Irish
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };

var cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function(requestId) {
    window.clearTimeout(requestId);
  };

})(Cosmos, window);
