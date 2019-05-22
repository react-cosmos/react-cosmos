import { NotificationsSpec } from '../../Notifications/public';
import { loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { getRendererCoreMethods } from '../../../testHelpers/pluginMocks';
import { mockRendererReady } from '../testHelpers';
import { register } from '..';
import { RouterSpec } from '../../Router/public';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushTimedNotification: () => {}
  });
}

function isRendererConnected() {
  return getRendererCoreMethods().isRendererConnected();
}

it('returns false', async () => {
  registerTestPlugins();
  loadPlugins();

  expect(isRendererConnected()).toBe(false);
});

it('returns true', async () => {
  registerTestPlugins();
  loadPlugins();
  mockRendererReady('mockRendererId', {});

  expect(isRendererConnected()).toBe(true);
});
