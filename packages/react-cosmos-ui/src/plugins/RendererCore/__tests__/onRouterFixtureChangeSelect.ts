import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  getRouterContext,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import { mockRendererReady } from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1');
  mockRendererReady('mockRendererId2');
  getRendererCoreMethods().selectPrimaryRenderer('mockRendererId2');
}

function emitRouterFixtureSelect() {
  getRouterContext().emit('fixtureSelect', { path: 'zwei.js' });
}

it('posts "selectFixture" renderer requests', async () => {
  registerTestPlugins();
  const { request } = onRendererCore();

  loadTestPlugins();
  emitRouterFixtureSelect();

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId1',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {},
      },
    })
  );

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId: { path: 'zwei.js' },
        fixtureState: {},
      },
    })
  );
});
