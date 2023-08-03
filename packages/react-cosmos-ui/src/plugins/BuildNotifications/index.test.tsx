import { ServerMessage } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getMessageHandlerContext,
  mockMessageHandler,
  mockNotifications,
} from '../../testHelpers/pluginMocks.js';
import { register } from './index.js';

beforeEach(register);

afterEach(resetPlugins);

function emitServerMessage(msg: ServerMessage) {
  getMessageHandlerContext().emit('serverMessage', msg);
}

it('pushes build start notification', () => {
  mockMessageHandler();
  const { pushStickyNotification } = mockNotifications();

  loadPlugins();
  emitServerMessage({ type: 'buildStart' });

  expect(pushStickyNotification).toBeCalledWith(expect.any(Object), {
    id: 'build',
    type: 'loading',
    title: 'Rebuilding...',
    info: 'Your code is updating.',
  });
});

it('pushes build error notification', () => {
  mockMessageHandler();
  const { pushStickyNotification } = mockNotifications();

  loadPlugins();
  emitServerMessage({ type: 'buildError' });

  expect(pushStickyNotification).toBeCalledWith(expect.any(Object), {
    id: 'build',
    type: 'error',
    title: 'Build failed',
    info: 'Check your terminal for more information.',
  });
});

it('clears build notification', () => {
  mockMessageHandler();
  const { removeStickyNotification } = mockNotifications();

  loadPlugins();
  emitServerMessage({ type: 'buildDone' });

  expect(removeStickyNotification).toBeCalledWith(expect.any(Object), 'build');
});
