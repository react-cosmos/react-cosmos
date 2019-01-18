// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererCoordinatorState } from '..';

afterEach(cleanup);

function loadTestPlugins(state?: RendererCoordinatorState) {
  loadPlugins({ state: { rendererCoordinator: state } });
}

it('returns false', async () => {
  register();
  loadTestPlugins();

  expect(mockCall('rendererCoordinator.isRendererConnected')).toBe(false);
});

it('returns true', async () => {
  register();

  const rendererId = 'mockRendererId';
  loadTestPlugins({
    connectedRendererIds: [rendererId],
    primaryRendererId: rendererId,
    fixtures: [],
    fixtureState: null
  });

  expect(mockCall('rendererCoordinator.isRendererConnected')).toBe(true);
});
