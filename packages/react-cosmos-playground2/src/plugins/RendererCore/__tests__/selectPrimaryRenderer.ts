import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { NotificationsSpec } from './../../Notifications/public';
import { RouterSpec } from '../../Router/public';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { getRendererCoreMethods, connectRenderer } from '../testHelpers';
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
  connectRenderer('mockRendererId1', fixtures);
  connectRenderer('mockRendererId2', fixtures);
  getRendererCoreMethods().selectPrimaryRenderer('mockRendererId2');
}

it('sets primary renderer ID in state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  await wait(() =>
    expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
      'mockRendererId2'
    )
  );
});
