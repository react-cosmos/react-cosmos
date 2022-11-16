import {
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-core';
import { isInsideCosmosPreviewIframe } from './isInsideCosmosPreviewIframe.js';

// TODO: Rename to domRendererConnect
export const rendererConnect = isInsideCosmosPreviewIframe()
  ? createPostMessageConnect()
  : createWebSocketsConnect(getWebSocketsUrl());

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
