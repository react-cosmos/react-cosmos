// @flow

import type {
  RendererReadyResponse,
  RendererErrorResponse
} from 'react-cosmos-shared2/renderer';

export const rendererReadyMsg: RendererReadyResponse = {
  type: 'rendererReady',
  payload: { rendererId: 'mockRendererId', fixtures: [] }
};

export const rendererErrorMsg: RendererErrorResponse = {
  type: 'rendererError',
  payload: { rendererId: 'mockRendererId' }
};
