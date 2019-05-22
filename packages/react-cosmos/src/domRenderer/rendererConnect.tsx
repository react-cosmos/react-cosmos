import { RendererConnect } from 'react-cosmos-shared2/renderer';
import {
  createPostMessageConnect,
  createWebSocketsConnect
} from 'react-cosmos-fixture';
import { isInsideCosmosPreviewIframe } from './shared';

let rendererConnect: null | RendererConnect = null;

export function getRendererConnect() {
  if (!rendererConnect) {
    rendererConnect = isInsideCosmosPreviewIframe()
      ? createPostMessageConnect()
      : createWebSocketsConnect(getWebSocketsUrl());
  }

  return rendererConnect;
}

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
