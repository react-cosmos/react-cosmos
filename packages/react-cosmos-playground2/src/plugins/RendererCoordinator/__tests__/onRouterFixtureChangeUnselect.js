// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockPlugin,
  mockEvent,
  mockEmit,
  getPluginState
} from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererCoordinatorState } from '..';

afterEach(cleanup);

const state: RendererCoordinatorState = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: [],
  fixtureState: { components: [] }
};

function registerTestPlugins() {
  register();
  mockPlugin('router');
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function emitRouterFixtureChange() {
  mockEmit('router.fixtureChange', undefined);
}

it('resets fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(getPluginState('rendererCoordinator').fixtureState).toEqual(null)
  );
});

it('posts "unselectFixture" renderer requests', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('rendererCoordinator.request', handleRendererRequest);

  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'mockRendererId1'
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'mockRendererId2'
      }
    })
  );
});
