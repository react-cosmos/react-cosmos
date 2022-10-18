import { createPostMessageConnect } from '../renderer/FixtureLoader/postMessage.js';
import { createWebSocketsConnect } from '../renderer/FixtureLoader/webSockets.js';
import { isInsideCosmosPreviewIframe } from './isInsideCosmosPreviewIframe.js';

export const rendererConnect = isInsideCosmosPreviewIframe()
  ? createPostMessageConnect()
  : createWebSocketsConnect(getWebSocketsUrl());

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
