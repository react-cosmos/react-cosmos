export function isInsideCosmosPreviewIframe() {
  try {
    return window.self !== window.parent;
  } catch (e) {
    return true;
  }
}
