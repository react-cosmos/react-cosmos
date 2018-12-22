// @flow

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';

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

export function getFxListChangeRes(rendererId: RendererId, fixtures: string[]) {
  return {
    type: 'fixtureListChange',
    payload: {
      rendererId,
      fixtures
    }
  };
}

export function getRendererState({
  fixtureState
}: {
  fixtureState: null | FixtureState
}) {
  return {
    fixtures: mockFixtures,
    fixtureState
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
