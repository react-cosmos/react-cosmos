module.exports = {
  attachPointerDownEvent: function(eventHandler) {
    if (this._isMobileDevice()) {
      return {onTouchStart: eventHandler};
    } else {
      return {onMouseDown: eventHandler};
    }
  },

  attachPointerUpEvent: function(eventHandler) {
    if (this._isMobileDevice()) {
      return {onTouchEnd: eventHandler};
    } else {
      return {onMouseUp: eventHandler};
    }
  },

  _isMobileDevice: function() {
    return 'ontouchstart' in window;
  }
};
