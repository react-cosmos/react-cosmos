import {
  RendererReadyResponse,
  RendererErrorResponse,
  SelectFixtureRequest
} from 'react-cosmos-shared2/renderer';

export const selectFixtureMsg: SelectFixtureRequest = {
  type: 'selectFixture',
  payload: {
    rendererId: 'mockRendererId',
    fixtureId: { path: 'mockFixturePath', name: null },
    fixtureState: null
  }
};

export const rendererReadyMsg: RendererReadyResponse = {
  type: 'rendererReady',
  payload: {
    rendererId: 'mockRendererId',
    fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null }
  }
};

export const rendererErrorMsg: RendererErrorResponse = {
  type: 'rendererError',
  payload: { rendererId: 'mockRendererId' }
};
