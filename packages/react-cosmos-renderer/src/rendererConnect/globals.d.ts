import { RendererResponse } from 'react-cosmos-core';

declare global {
  interface Window {
    cosmosRendererResponse?: (msg: RendererResponse) => void;
  }
}
