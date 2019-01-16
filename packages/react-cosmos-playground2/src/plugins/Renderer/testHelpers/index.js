// @flow

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererStatus } from '../shared';

export const mockFixtures = [
  'fixtures/ein.js',
  'fixtures/zwei.js',
  'fixtures/drei.js'
];

export const mockFixtureState = {
  components: []
};

export function getReadyRes(rendererId: RendererId) {
  return {
    type: 'rendererReady',
    payload: {
      rendererId,
      fixtures: mockFixtures
    }
  };
}

export function getErrorRes(rendererId: RendererId) {
  return {
    type: 'rendererError',
    payload: { rendererId }
  };
}

export function getFxListUpdateRes(rendererId: RendererId, fixtures: string[]) {
  return {
    type: 'fixtureListUpdate',
    payload: {
      rendererId,
      fixtures
    }
  };
}

export function getRendererState(overrides: {
  status?: RendererStatus,
  fixtureState?: null | FixtureState
}) {
  return {
    status: overrides.status || 'ok',
    fixtures: mockFixtures,
    fixtureState: overrides.fixtureState || null
  };
}

export function getFxStateChangeReq(rendererId: RendererId) {
  return {
    type: 'fixtureStateChange',
    payload: {
      rendererId,
      fixturePath: 'fixtures/zwei.js',
      fixtureState: mockFixtureState
    }
  };
}
