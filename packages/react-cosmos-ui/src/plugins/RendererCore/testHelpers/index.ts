import {
  FixtureId,
  FixtureList,
  FixtureListUpdateResponse,
  FixtureState,
  FixtureStateChangeResponse,
  RendererId,
  RendererReadyResponse,
} from 'react-cosmos-core';
import { getRendererCoreMethods } from '../../../testHelpers/pluginMocks.js';

export function createRendererReadyResponse(
  rendererId: RendererId,
  fixtures: FixtureList,
  selectedFixtureId?: FixtureId
): RendererReadyResponse {
  return {
    type: 'rendererReady',
    payload: {
      rendererId,
      fixtures,
      selectedFixtureId,
    },
  };
}

export function createFixtureListUpdateResponse(
  rendererId: RendererId,
  fixtures: FixtureList
): FixtureListUpdateResponse {
  return {
    type: 'fixtureListUpdate',
    payload: {
      rendererId,
      fixtures,
    },
  };
}

export function createFixtureStateChangeResponse(
  rendererId: RendererId,
  fixtureId: FixtureId,
  fixtureState: FixtureState
): FixtureStateChangeResponse {
  return {
    type: 'fixtureStateChange',
    payload: {
      rendererId,
      fixtureId,
      fixtureState,
    },
  };
}

export function mockRendererReady(
  rendererId: RendererId,
  fixtures: FixtureList,
  initialFixtureId?: FixtureId
) {
  return getRendererCoreMethods().receiveResponse(
    createRendererReadyResponse(rendererId, fixtures, initialFixtureId)
  );
}

export function mockFixtureStateChange(
  rendererId: RendererId,
  fixtureId: FixtureId,
  fixtureState: FixtureState
) {
  return getRendererCoreMethods().receiveResponse(
    createFixtureStateChangeResponse(rendererId, fixtureId, fixtureState)
  );
}
