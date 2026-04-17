import type { MessageType, ServerMessage } from 'react-cosmos-core';
import type { PluginContext } from 'react-plugin';
import { createPlugin } from 'react-plugin';
import type { MessageHandlerSpec } from '../MessageHandler/spec.js';
import type { NotificationsSpec } from '../Notifications/spec.js';
import type { BuildNotificationsSpec } from './spec.js';

type BuildNotificationsContext = PluginContext<BuildNotificationsSpec>;

const { on, register } = createPlugin<BuildNotificationsSpec>({
  name: 'buildNotifications',
});

on<MessageHandlerSpec>('messageHandler', {
  serverMessage: onServerMessage,
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function onServerMessage(context: BuildNotificationsContext, msg: MessageType) {
  const { getMethodsOf } = context;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');

  const serverMessage = msg as ServerMessage;
  switch (serverMessage.type) {
    case 'buildStart':
      return notifications.pushStickyNotification({
        id: 'build',
        type: 'loading',
        title: 'Rebuilding...',
        info: 'Your code is updating.',
      });

    case 'buildError':
      return notifications.pushStickyNotification({
        id: 'build',
        type: 'error',
        title: 'Build failed',
        info: 'Check your terminal for more information.',
      });

    case 'buildDone':
      return notifications.removeStickyNotification('build');

    default:
    // Nada
  }
}
