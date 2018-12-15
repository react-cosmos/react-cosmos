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

export function getFxListRes(rendererId: RendererId) {
  return {
    type: 'fixtureList',
    payload: {
      rendererId,
      fixtures: mockFixtures
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
