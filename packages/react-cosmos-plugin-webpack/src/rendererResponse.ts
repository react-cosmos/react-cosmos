import { RendererId, RendererResponse } from 'react-cosmos/src/renderer/types';

export type RendererHmrFailResponse = {
  type: 'rendererHmrFail';
  payload: {
    rendererId: RendererId;
  };
};

export type WebpackRendererResponse =
  | RendererResponse
  | RendererHmrFailResponse;
