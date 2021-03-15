import {
  FixturesByPath,
  FixtureId,
  RendererId,
  RendererReadyResponse,
  FixtureListUpdateResponse,
  FixtureStateChangeResponse,
} from 'react-cosmos-shared2/renderer';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { getRendererCoreMethods } from '../../../testHelpers/pluginMocks';

export function createRendererReadyResponse(
  rendererId: RendererId,
  fixtures: FixturesByPath
): RendererReadyResponse {
  return {
    type: 'rendererReady',
    payload: {
      rendererId,
      fixtures,
    },
  };
}

export function createFixtureListUpdateResponse(
  rendererId: RendererId,
  fixtures: FixturesByPath
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
  fixtures: FixturesByPath
) {
  return getRendererCoreMethods().receiveResponse(
    createRendererReadyResponse(rendererId, fixtures)
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
