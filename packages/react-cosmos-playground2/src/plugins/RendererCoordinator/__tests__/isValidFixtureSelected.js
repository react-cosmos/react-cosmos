// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockState, mockCall } from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererCoordinatorState } from '..';

afterEach(cleanup);

const rendererId = 'mockRendererId';
const state: RendererCoordinatorState = {
  connectedRendererIds: [rendererId],
  primaryRendererId: rendererId,
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: null
};

function mockFixturePath(fixturePath) {
  mockState('router', { urlParams: { fixturePath } });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCoordinator: state } });
}

it('returns false on missing fixture', async () => {
  register();
  mockFixturePath('sechs.js');
  loadTestPlugins();

  expect(mockCall('rendererCoordinator.isValidFixtureSelected')).toBe(false);
});

it('returns true on existing fixture', async () => {
  register();
  mockFixturePath('drei.js');
  loadTestPlugins();

  expect(mockCall('rendererCoordinator.isValidFixtureSelected')).toBe(true);
});
