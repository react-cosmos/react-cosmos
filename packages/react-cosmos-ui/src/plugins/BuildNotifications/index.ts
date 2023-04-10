import { MessageType, ServerMessage } from 'react-cosmos-core';
import { createPlugin, PluginContext } from 'react-plugin';
import { MessageHandlerSpec } from '../MessageHandler/spec.js';
import { NotificationsSpec } from '../Notifications/spec.js';
import { BuildNotificationsSpec } from './spec.js';

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
