import type { RendererRequest, RendererResponse } from 'react-cosmos-core';

// Window hooks that allow headless browsers to interact with the renderer

const requestHandlers = new Set<(msg: RendererRequest) => unknown>();

function handleWindowRendererRequest(msg: RendererRequest) {
  requestHandlers.forEach(handler => handler(msg));
}

export function onWindowRendererRequest(
  handler: (msg: RendererRequest) => unknown
) {
  // Assigned on every subscription to replace a stale global, e.g. one left
  // behind by a previous instance of this module
  window.cosmosRendererRequest = handleWindowRendererRequest;
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
