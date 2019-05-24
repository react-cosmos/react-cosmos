import { loadPlugins } from 'react-plugin';
import { BuildMessage } from 'react-cosmos-shared2/build';
import { cleanup } from '../../testHelpers/plugin';
import * as pluginMocks from '../../testHelpers/pluginMocks';
import { register } from '.';

afterEach(cleanup);

function emitBuildMessage(msg: BuildMessage) {
  pluginMocks.getMessageHandlerContext().emit('serverMessage', msg);
}

it('pushes build start notification', () => {
  register();
  pluginMocks.mockMessageHandler({});

  const pushStickyNotification = jest.fn();
  pluginMocks.mockNotifications({ pushStickyNotification });

  loadPlugins();
  emitBuildMessage({ type: 'buildStart' });

  expect(pushStickyNotification).toBeCalledWith(expect.any(Object), {
    id: 'build',
    type: 'loading',
    title: 'Rebuilding...',
    info: 'Your code is updating.'
  });
});

it('pushes build error notification', () => {
  register();
  pluginMocks.mockMessageHandler({});

  const pushStickyNotification = jest.fn();
  pluginMocks.mockNotifications({ pushStickyNotification });

  loadPlugins();
  emitBuildMessage({ type: 'buildError' });

  expect(pushStickyNotification).toBeCalledWith(expect.any(Object), {
    id: 'build',
    type: 'error',
    title: 'Build failed',
    info: 'Check your terminal for more information.'
  });
});

it('clears build notification', () => {
  register();
  pluginMocks.mockMessageHandler({});

  const removeStickyNotification = jest.fn();
  pluginMocks.mockNotifications({ removeStickyNotification });

  loadPlugins();
  emitBuildMessage({ type: 'buildDone' });

  expect(removeStickyNotification).toBeCalledWith(expect.any(Object), 'build');
});
