import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockNotifications,
  getRendererCoreContext,
  mockRendererCore,
} from '../../testHelpers/pluginMocks';
import { register } from '.';

afterEach(resetPlugins);

function emitRendererCoreResponse() {
  getRendererCoreContext().emit('response', {
    type: 'rendererHmrFail',
    payload: {
      rendererId: 'mockRendererId1',
    },
  });
}

it('notifies HMR fail', async () => {
  register();
  mockRendererCore();
  const { pushTimedNotification } = mockNotifications();

  loadPlugins();
  emitRendererCoreResponse();

  await waitFor(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-hmr-fail',
      type: 'error',
      title: 'Hot reload failed',
      info:
        'Check the browser console to see which module failed to hot reload.',
    })
  );
});
