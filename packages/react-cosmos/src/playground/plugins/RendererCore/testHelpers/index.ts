import { FixtureState } from 'react-cosmos-core/fixtureState';
import { FixtureId, FixtureList } from 'react-cosmos-core/fixture';
import {
  FixtureListUpdateResponse,
  FixtureStateChangeResponse,
  RendererId,
  RendererReadyResponse,
} from 'react-cosmos-core/renderer';
import { getRendererCoreMethods } from '../../../testHelpers/pluginMocks.js';

export function createRendererReadyResponse(
  rendererId: RendererId,
  fixtures: FixtureList,
  initialFixtureId?: FixtureId
): RendererReadyResponse {
  return {
    type: 'rendererReady',
    payload: {
      rendererId,
      fixtures,
      initialFixtureId,
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
