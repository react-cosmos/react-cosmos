import { createPostMessageConnect } from '../FixtureLoader/postMessage';
import { createWebSocketsConnect } from '../FixtureLoader/webSockets';
import { isInsideCosmosPreviewIframe } from './isInsideCosmosPreviewIframe';

export const rendererConnect = isInsideCosmosPreviewIframe()
  ? createPostMessageConnect()
  : createWebSocketsConnect(getWebSocketsUrl());

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
