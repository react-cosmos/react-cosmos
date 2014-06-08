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
  startAnimationLoop: function() {
    // Prevent running more callbacks at the same time
    this.stopAnimationLoop();
    this._nextFrame();
  },
  stopAnimationLoop: function() {
    this._clearAnimation();
    this.setState({animationRequestId: null});
  },
  componentDidMount: function() {
    this._loadAnimationState(this.state);
  },
  componentWillReceiveProps: function(nextProps) {
    // This is a feature that only works in conjunction with the PersistState
    // mixin. Animations will be resumed or stopped based on previous states
    // loaded using setProps({state: ...})
    if (nextProps.state) {
      this._loadAnimationState(nextProps.state);
    }
  },
  componentWillUnmount: function() {
    this._clearAnimation();
  },
  _loadAnimationState: function(state) {
    // If the Component state had an on-going animation it will resume as soon
    // as a Component is mounted with the same state.
    // If the Componene state had a stopped animation it will stop any current
    // animation when overwriting state
    if (state && state.animationRequestId !== undefined) {
      if (state.animationRequestId) {
        this.startAnimationLoop();
      } else {
        this.stopAnimationLoop();
      }
    }
  },
  _nextFrame: function() {
    this._prevTime = Date.now();
    this.setState({
      // Keep a reference to the animation request for two reasons:
      // - To be able to clear it on stopAnimationLoop()
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
