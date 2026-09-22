import type { RendererRequest, RendererResponse } from 'react-cosmos-core';

// Window hooks that allow headless browsers to interact with the renderer

const requestHandlers = new Set<(msg: RendererRequest) => unknown>();

export function onWindowRendererRequest(
  handler: (msg: RendererRequest) => unknown
) {
  if (!window.cosmosRendererRequest) {
    window.cosmosRendererRequest = msg => requestHandlers.forEach(h => h(msg));
  }
  requestHandlers.add(handler);
  return () => {
    requestHandlers.delete(handler);
  };
}

export function postWindowRendererResponse(msg: RendererResponse) {
  if (window.cosmosRendererResponse) {
    window.cosmosRendererResponse(msg);
  }
}
