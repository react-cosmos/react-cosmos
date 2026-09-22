import type { RendererConnect } from 'react-cosmos-core';
import {
  onWindowRendererRequest,
  postWindowRendererResponse,
} from './windowRendererHooks.js';

export function createNoopRendererConnect(): RendererConnect {
  return {
    postMessage(rendererResponse) {
      postWindowRendererResponse(rendererResponse);
    },
    onMessage(onMessage) {
      return onWindowRendererRequest(onMessage);
    },
  };
}
