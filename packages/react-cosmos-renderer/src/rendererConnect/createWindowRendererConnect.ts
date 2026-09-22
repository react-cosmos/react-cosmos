import type {
  RendererConnect,
  RendererRequest,
  RendererResponse,
} from 'react-cosmos-core';

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

const requestHandlers = new Set<(msg: RendererRequest) => unknown>();

function handleWindowRendererRequest(msg: RendererRequest) {
  requestHandlers.forEach(handler => handler(msg));
}

function onWindowRendererRequest(handler: (msg: RendererRequest) => unknown) {
  // Assigned on every subscription to replace a stale global, e.g. one left
  // behind by a previous instance of this module
  window.cosmosRendererRequest = handleWindowRendererRequest;
  requestHandlers.add(handler);
  return () => {
    requestHandlers.delete(handler);
  };
}

function postWindowRendererResponse(msg: RendererResponse) {
  if (window.cosmosRendererResponse) {
    window.cosmosRendererResponse(msg);
  }
}
