// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockPlugin,
  mockEvent,
  mockEmit
} from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererCoordinatorState } from '..';

afterEach(cleanup);

const rendererState: RendererCoordinatorState = {
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
  loadPlugins({ state: { renderer: rendererState } });
}

function emitRouterFixtureChange() {
  mockEmit('router.fixtureChange', 'zwei.js');
}

it('posts "selectFixture" renderer requests', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId1',
        fixturePath: 'zwei.js',
        fixtureState: null
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixturePath: 'zwei.js',
        fixtureState: null
      }
    })
  );
});
