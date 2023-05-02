export function isInsideWindowIframe() {
  if (typeof window === 'undefined') {
    return false;
  } else {
    try {
      return window.self !== window.parent;
    } catch (e) {
      return true;
    }
  }
}
