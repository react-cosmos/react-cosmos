import {
  RendererErrorResponse,
  RendererReadyResponse,
  SelectFixtureRequest,
} from 'react-cosmos-core';

export const selectFixtureMsg: SelectFixtureRequest = {
  type: 'selectFixture',
  payload: {
    rendererId: 'mockRendererId',
    fixtureId: { path: 'mockFixturePath' },
    fixtureState: {},
  },
};

export const rendererReadyMsg: RendererReadyResponse = {
  type: 'rendererReady',
  payload: {
    rendererId: 'mockRendererId',
  },
};

export const rendererErrorMsg: RendererErrorResponse = {
  type: 'rendererError',
  payload: { rendererId: 'mockRendererId' },
};
