// @flow

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';

export const fixtures = [
  'fixtures/ein.js',
  'fixtures/zwei.js',
  'fixtures/drei.js'
];

export function getFixtureListResponse(rendererId: RendererId) {
  return {
    type: 'fixtureList',
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
    fixtures,
    fixtureState
  };
}

export function getFixtureStateChangeRequest(rendererId: RendererId) {
  return {
    type: 'fixtureStateChange',
    payload: {
      rendererId,
      fixturePath: 'fixtures/zwei.js',
      fixtureState: {
        components: []
      }
    }
  };
}
