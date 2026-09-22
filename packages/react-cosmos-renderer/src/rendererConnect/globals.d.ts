import type { RendererRequest, RendererResponse } from 'react-cosmos-core';

declare global {
  interface Window {
    cosmosRendererRequest?: (msg: RendererRequest) => void;
    cosmosRendererResponse?: (msg: RendererResponse) => void;
  }
}
