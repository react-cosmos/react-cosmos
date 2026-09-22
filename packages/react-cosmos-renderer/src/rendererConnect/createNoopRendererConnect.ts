import type { RendererConnect } from 'react-cosmos-core';
import { onWindowRendererRequest } from './windowRendererRequest.js';

export function createNoopRendererConnect(): RendererConnect {
  return {
    postMessage(rendererResponse) {
      // Allow headless browsers to capture renderer responses
      if (window.cosmosRendererResponse) {
        window.cosmosRendererResponse(rendererResponse);
      }
    },
    onMessage(onMessage) {
      return onWindowRendererRequest(onMessage);
    },
  };
}
