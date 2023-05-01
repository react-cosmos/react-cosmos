import {
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-core/client.js';
import { isInsideCosmosPreviewIframe } from './utils/isInsideCosmosPreviewIframe.js';

export function createDomRendererConnect(playgroundUrl: string) {
  return isInsideCosmosPreviewIframe()
    ? createPostMessageConnect()
    : createWebSocketsConnect(getWebSocketsUrl(playgroundUrl));
}

function getWebSocketsUrl(playgroundUrl: string) {
  return playgroundUrl.replace(/^https?:/, 'ws:');
}
