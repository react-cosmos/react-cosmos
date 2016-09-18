/* global window */

module.exports = {
  attachPointerDownEvent(eventHandler) {
    if (this.isMobileDevice()) {
      return { onTouchStart: eventHandler };
    }

    return { onMouseDown: eventHandler };
  },

  attachPointerUpEvent(eventHandler) {
    if (this.isMobileDevice()) {
      return { onTouchEnd: eventHandler };
    }

    return { onMouseUp: eventHandler };
  },

  isMobileDevice() {
    return 'ontouchstart' in window;
  },
};
