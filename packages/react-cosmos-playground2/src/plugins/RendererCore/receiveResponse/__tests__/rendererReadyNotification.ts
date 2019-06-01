import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../../testHelpers/plugin';
import { mockRendererReady } from '../../testHelpers';
import { register } from '../..';
import {
  mockRouter,
  mockNotifications
} from '../../../../testHelpers/pluginMocks';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => null
  });
}

it('notifies renderer connection', async () => {
  registerTestPlugins();
  const { pushTimedNotification } = mockNotifications();

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
