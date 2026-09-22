import type { RendererRequest } from 'react-cosmos-core';

const handlers = new Set<(msg: RendererRequest) => unknown>();

// Allow headless browsers to send renderer requests
export function onWindowRendererRequest(
  handler: (msg: RendererRequest) => unknown
) {
  if (!window.cosmosRendererRequest) {
    window.cosmosRendererRequest = msg => handlers.forEach(h => h(msg));
  }
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}
