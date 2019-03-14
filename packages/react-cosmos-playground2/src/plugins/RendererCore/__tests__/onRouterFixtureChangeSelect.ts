import { NotificationsSpec } from './../../Notifications/public';
import { wait } from 'react-testing-library';
import { loadPlugins, getPluginContext } from 'react-plugin';
import { cleanup, on, mockMethodsOf } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { mockRendererReady, getRendererCoreMethods } from '../testHelpers';
import { RendererCoreSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

const fixtures = {};

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification: () => {}
  });
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockRendererReady('mockRendererId2', fixtures);
  getRendererCoreMethods().selectPrimaryRenderer('mockRendererId2');
}

function emitRouterFixtureChange() {
  getPluginContext<RouterSpec>('router').emit('fixtureChange', {
    path: 'zwei.js',
    name: null
  });
}

it('posts "selectFixture" renderer requests', async () => {
  registerTestPlugins();

  const request = jest.fn();
  on<RendererCoreSpec>('rendererCore', { request });

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
