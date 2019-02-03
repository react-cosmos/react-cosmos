import {
  RendererId,
  RendererReadyResponse,
  FixtureListUpdateResponse,
  FixtureStateChangeResponse
} from 'react-cosmos-shared2/renderer';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';

export function createRendererReadyResponse(
  rendererId: RendererId,
  fixtures: string[]
): RendererReadyResponse {
  return {
    type: 'rendererReady',
    payload: {
      rendererId,
      fixtures
    }
  };
}

export function createFixtureListUpdateResponse(
  rendererId: RendererId,
  fixtures: string[]
): FixtureListUpdateResponse {
  return {
    type: 'fixtureListUpdate',
    payload: {
      rendererId,
      fixtures
    }
  };
}

export function createFixtureStateChangeResponse(
  rendererId: RendererId,
  fixturePath: string,
  fixtureState: null | FixtureState
): FixtureStateChangeResponse {
  return {
    type: 'fixtureStateChange',
    payload: {
      rendererId,
      fixturePath,
      fixtureState
    }
  };
}
