import { RendererId, RendererResponse } from 'react-cosmos/src';

export type RendererHmrFailResponse = {
  type: 'rendererHmrFail';
  payload: {
    rendererId: RendererId;
  };
};

export type WebpackRendererResponse =
  | RendererResponse
  | RendererHmrFailResponse;
