import { createPlugin, PluginContext } from 'react-plugin';
import { Message } from 'react-cosmos-shared2/util';
import { BuildMessage } from 'react-cosmos-shared2/build';
import { MessageHandlerSpec } from './../MessageHandler/public';
import { NotificationsSpec } from './../Notifications/public';
import { BuildNotificationsSpec } from './public';

type Context = PluginContext<BuildNotificationsSpec>;

const { on, register } = createPlugin<BuildNotificationsSpec>({
  name: 'buildNotifications'
});

on<MessageHandlerSpec>('messageHandler', {
  buildMessage: onBuildMessage
});

export { register };

function onBuildMessage(context: Context, msg: Message) {
  const { getMethodsOf } = context;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');

  const buildMsg = msg as BuildMessage;
  switch (buildMsg.type) {
    case 'buildStart':
      return notifications.pushStickyNotification({
        id: 'build',
        type: 'loading',
        title: 'Rebuilding...',
        info: 'Your code is updating.'
      });

    case 'buildError':
      return notifications.pushStickyNotification({
        id: 'build',
        type: 'error',
        title: 'Build failed',
        info: 'Check your terminal for more information.'
      });

    case 'buildDone':
      return notifications.removeStickyNotification('build');

    default:
    // Nada
  }
}
