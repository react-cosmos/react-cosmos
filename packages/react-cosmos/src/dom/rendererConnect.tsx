import {
  createPostMessageConnect,
  createWebSocketsConnect,
} from 'react-cosmos-shared2/FixtureLoader';
import { isInsideCosmosPreviewIframe } from './shared';

export const rendererConnect = isInsideCosmosPreviewIframe()
  ? createPostMessageConnect()
  : createWebSocketsConnect(getWebSocketsUrl());

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
