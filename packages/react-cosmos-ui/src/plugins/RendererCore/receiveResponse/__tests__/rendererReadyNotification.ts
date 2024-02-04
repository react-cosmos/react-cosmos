import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockCore,
  mockNotifications,
  mockRouter,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import { mockRendererReady } from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => null,
  });
}

it('notifies renderer connection', async () => {
  registerTestPlugins();
  const { pushTimedNotification } = mockNotifications();

  loadPlugins();
  mockRendererReady('mockRendererId1');

  await waitFor(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-connect-mockRendererId1',
      type: 'info',
      title: 'Renderer connected',
      info: 'Your fixtures are ready to use.',
    })
  );
});
