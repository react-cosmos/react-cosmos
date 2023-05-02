import { createNoopRendererConnect } from './createNoopRendererConnect.js';
import { createPostMessageConnect } from './createPostMessageConnect.js';
import { createWebSocketsConnect } from './createWebSocketsConnect.js';

export function createDomRendererConnect(playgroundUrl: string) {
  if (typeof window === 'undefined') {
    return createNoopRendererConnect();
  } else {
    return isInsideCosmosPreviewIframe()
      ? createPostMessageConnect()
      : createWebSocketsConnect(getWebSocketsUrl(playgroundUrl));
  }
}

function getWebSocketsUrl(playgroundUrl: string) {
  return playgroundUrl.replace(/^https?:/, 'ws:');
}

function isInsideCosmosPreviewIframe() {
  try {
    return window.self !== window.parent;
  } catch (e) {
    return true;
  }
}
