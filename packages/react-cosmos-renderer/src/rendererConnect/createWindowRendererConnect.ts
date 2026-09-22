import type { RendererConnect } from 'react-cosmos-core';
import {
  onWindowRendererRequest,
  postWindowRendererResponse,
} from './windowRendererHooks.js';

// Allows headless browsers to control the renderer via window hooks
export function createWindowRendererConnect(): RendererConnect {
  return {
    postMessage(rendererResponse) {
      postWindowRendererResponse(rendererResponse);
    },
    onMessage(onMessage) {
      return onWindowRendererRequest(onMessage);
    },
  };
}
