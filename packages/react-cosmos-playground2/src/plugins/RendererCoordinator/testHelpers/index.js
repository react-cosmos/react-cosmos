// @flow

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';

export function createRendererReadyResponse(
  rendererId: RendererId,
  fixtures: string[]
) {
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
) {
  return {
    type: 'fixtureListUpdate',
    payload: {
      rendererId,
      fixtures
    }
  };
}

export function getFixtureStateChangeResponse(
  rendererId: RendererId,
  fixturePath: string,
  fixtureState: null | FixtureState
) {
  return {
    type: 'fixtureStateChange',
    payload: {
      rendererId,
      fixturePath,
      fixtureState
    }
  };
}
