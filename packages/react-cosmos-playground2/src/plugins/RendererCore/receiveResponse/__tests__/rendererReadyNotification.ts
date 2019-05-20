import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { NotificationsSpec } from '../../../Notifications/public';
import { mockRendererReady } from '../../testHelpers';
import { register } from '../..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
}

it('notifies renderer connection', async () => {
  registerTestPlugins();

  const pushTimedNotification = jest.fn();
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushTimedNotification
  });

  loadPlugins();
  mockRendererReady('mockRendererId1', {});

  await wait(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-connect-mockRendererId1',
      type: 'info',
      title: 'Renderer connected',
      info: 'Your fixtures are ready to use.'
    })
  );
});
