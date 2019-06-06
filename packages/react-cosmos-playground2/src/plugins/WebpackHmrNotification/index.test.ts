import { wait } from '@testing-library/react';
import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../testHelpers/plugin';
import {
  mockNotifications,
  getRendererCoreContext,
  mockRendererCore
} from '../../testHelpers/pluginMocks';
import { register } from '.';

afterEach(cleanup);

function emitRendererCoreResponse() {
  getRendererCoreContext().emit('response', {
    type: 'rendererHmrFail',
    payload: {
      rendererId: 'mockRendererId1'
    }
  });
}

it('notifies HMR fail', async () => {
  register();
  mockRendererCore();
  const { pushTimedNotification } = mockNotifications();

  loadPlugins();
  emitRendererCoreResponse();

  await wait(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-hmr-fail',
      type: 'error',
      title: 'Hot reload failed',
      info:
        'Check the browser console to see which module failed to hot reload.'
    })
  );
});
