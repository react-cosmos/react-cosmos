import { RendererId, RendererResponse } from './renderer';

export type RendererHmrFailResponse = {
  type: 'rendererHmrFail';
  payload: {
    rendererId: RendererId;
  };
};

export type WebpackRendererResponse =
  | RendererResponse
  | RendererHmrFailResponse;
