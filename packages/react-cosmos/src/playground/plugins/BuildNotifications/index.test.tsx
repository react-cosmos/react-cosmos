import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '.';
import { BuildMessage } from '../../../shared/serverMessage';
import {
  getMessageHandlerContext,
  mockMessageHandler,
  mockNotifications,
} from '../../testHelpers/pluginMocks';

beforeEach(register);

afterEach(resetPlugins);

function emitBuildMessage(msg: BuildMessage) {
  getMessageHandlerContext().emit('serverMessage', msg);
}

it('pushes build start notification', () => {
  mockMessageHandler();
  const { pushStickyNotification } = mockNotifications();

  loadPlugins();
  emitBuildMessage({ type: 'buildStart' });

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
  emitBuildMessage({ type: 'buildError' });

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
  emitBuildMessage({ type: 'buildDone' });

  expect(removeStickyNotification).toBeCalledWith(expect.any(Object), 'build');
});
