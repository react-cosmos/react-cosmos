/* global window */

export function isMobileDevice() {
  return 'ontouchstart' in window;
}


export function attachPointerDownEvent(eventHandler) {
  if (isMobileDevice()) {
    return { onTouchStart: eventHandler };
  }

  return { onMouseDown: eventHandler };
}

export function attachPointerUpEvent(eventHandler) {
  if (isMobileDevice()) {
    return { onTouchEnd: eventHandler };
  }

  return { onMouseUp: eventHandler };
}
