import { wait } from '@testing-library/react';
import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  getRendererCoreMethods,
  mockRouter,
  mockNotifications,
  getRouterContext,
  onRendererCore
} from '../../../testHelpers/pluginMocks';
import { mockRendererReady } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const fixtures = {};

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockRendererReady('mockRendererId2', fixtures);
  getRendererCoreMethods().selectPrimaryRenderer('mockRendererId2');
}

function emitRouterFixtureChange() {
  getRouterContext().emit('fixtureChange', {
    path: 'zwei.js',
    name: null
  });
}

it('posts "selectFixture" renderer requests', async () => {
  registerTestPlugins();
  const { request } = onRendererCore();

  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId1',
        fixtureId: { path: 'zwei.js', name: null },
        fixtureState: {}
      }
    })
  );

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId: { path: 'zwei.js', name: null },
        fixtureState: {}
      }
    })
  );
});
