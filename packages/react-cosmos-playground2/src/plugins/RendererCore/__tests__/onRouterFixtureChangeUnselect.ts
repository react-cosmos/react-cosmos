import { waitFor } from '@testing-library/dom';
import {
  getRendererCoreMethods,
  getRouterContext,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from 'react-cosmos-shared2/ui';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { mockRendererReady } from '../testHelpers';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

const fixtures = {};

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => null,
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
  getRouterContext().emit('fixtureChange', null);
}

it('resets fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  emitRouterFixtureChange();

  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual({})
  );
});

it('posts "unselectFixture" renderer requests', async () => {
  registerTestPlugins();
  const { request } = onRendererCore();

  loadTestPlugins();
  emitRouterFixtureChange();

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'mockRendererId1',
      },
    })
  );

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'mockRendererId2',
      },
    })
  );
});
