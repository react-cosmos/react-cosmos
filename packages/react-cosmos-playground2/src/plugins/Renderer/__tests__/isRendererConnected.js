// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererCoordinatorState } from '..';

afterEach(cleanup);

function loadTestPlugins(rendererState?: RendererCoordinatorState) {
  loadPlugins({ state: { renderer: rendererState } });
}

it('returns false', async () => {
  register();
  loadTestPlugins();

  expect(mockCall('renderer.isRendererConnected')).toBe(false);
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

  expect(mockCall('renderer.isRendererConnected')).toBe(true);
});
