import { RendererConnect } from 'react-cosmos-core';

export function createNoopRendererConnect(): RendererConnect {
  return {
    postMessage(rendererResponse) {
      // Allow headless browsers to capture renderer responses
      if (window.cosmosRendererResponse) {
        window.cosmosRendererResponse(rendererResponse);
      }
    },
    onMessage() {
      return () => {};
    },
  };
}
