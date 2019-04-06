export function isInsideIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
