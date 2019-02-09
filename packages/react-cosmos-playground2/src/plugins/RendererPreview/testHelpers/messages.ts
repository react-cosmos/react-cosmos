import {
  RendererReadyResponse,
  RendererErrorResponse,
  SelectFixtureRequest
} from 'react-cosmos-shared2/renderer';

export const selectFixtureMsg: SelectFixtureRequest = {
  type: 'selectFixture',
  payload: {
    rendererId: 'mockRendererId',
    fixturePath: 'mockFixturePath',
    fixtureState: null
  }
};

export const rendererReadyMsg: RendererReadyResponse = {
  type: 'rendererReady',
  payload: {
    rendererId: 'mockRendererId',
    fixtures: ['ein.js', 'zwei.js', 'drei.js']
  }
};

export const rendererErrorMsg: RendererErrorResponse = {
  type: 'rendererError',
  payload: { rendererId: 'mockRendererId' }
};
