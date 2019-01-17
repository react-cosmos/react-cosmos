// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, getPluginState, mockCall } from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererCoordinatorState } from '..';

afterEach(cleanup);

const rendererState: RendererCoordinatorState = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: [],
  fixtureState: null
};

it('sets primary renderer ID in state', async () => {
  register();
  loadPlugins({ state: { renderer: rendererState } });

  mockCall('renderer.selectPrimaryRenderer', 'mockRendererId2');

  await wait(() =>
    expect(getPluginState('renderer').primaryRendererId).toEqual(
      'mockRendererId2'
    )
  );
});
