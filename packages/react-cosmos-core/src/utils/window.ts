export function isInsideWindowIframe() {
  // We also check for location because window is defined in React Native
  // where we want to return false.
  // https://stackoverflow.com/a/49911697
  if (typeof window === 'undefined' || typeof location === 'undefined') {
    return false;
  } else {
    try {
      return window.self !== window.parent;
    } catch (e) {
      return true;
    }
  }
}
