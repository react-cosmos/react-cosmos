import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { NotificationsSpec } from '../../../Notifications/public';
import { connectRenderer } from '../../testHelpers';
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

  const pushNotification = jest.fn();
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification
  });

  loadPlugins();
  connectRenderer('mockRendererId1', {});

  await wait(() =>
    expect(pushNotification).toBeCalledWith(expect.any(Object), {
      type: 'success',
      content: 'Renderer connected'
    })
  );
});
