import {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import {
  createPostMessageConnect,
  createWebSocketsConnect
} from 'react-cosmos-fixture';
import { isInsideCosmosPreviewIframe } from './shared';

export function getRendererConnect<
  Request = RendererRequest,
  Response = RendererResponse
>() {
  return isInsideCosmosPreviewIframe()
    ? createPostMessageConnect<Request, Response>()
    : createWebSocketsConnect<Request, Response>(getWebSocketsUrl());
}

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
