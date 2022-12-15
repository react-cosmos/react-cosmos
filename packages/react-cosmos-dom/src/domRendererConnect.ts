import {
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-core';
import { isInsideCosmosPreviewIframe } from './utils/isInsideCosmosPreviewIframe.js';

export const domRendererConnect = isInsideCosmosPreviewIframe()
  ? createPostMessageConnect()
  : createWebSocketsConnect(getWebSocketsUrl());

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin.replace(/^https?:/, 'ws:');
}
