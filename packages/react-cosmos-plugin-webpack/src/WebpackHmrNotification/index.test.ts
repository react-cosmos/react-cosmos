import { waitFor } from '@testing-library/dom';
import {
  getRendererCoreContext,
  mockNotifications,
  mockRendererCore,
} from 'react-cosmos/src/ui/plugin/mocks';
import { loadPlugins, resetPlugins } from 'react-plugin';

beforeEach(() => jest.isolateModules(() => require('.')));

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
  mockRendererCore();
  const { pushTimedNotification } = mockNotifications();

  loadPlugins();
  emitRendererCoreResponse();

  await waitFor(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-hmr-fail',
      type: 'error',
      title: 'Hot reload failed',
      info: 'Check the browser console to see which module failed to hot reload.',
    })
  );
});
