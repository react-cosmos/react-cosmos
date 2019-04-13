export function isInsideCosmosPreviewIframe() {
  try {
    if (window.self === window.parent) {
      return false;
    }

    // Allow renderer URLs to be loaded inside iframes that aren't previews
    // in the Cosmos UI
    return typeof (window.parent as any).ReactPlugin !== 'undefined';
  } catch (e) {
    return true;
  }
}
