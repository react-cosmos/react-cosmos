import { createPlugin, PluginContext } from 'react-plugin';
import { WebpackRendererResponse } from 'react-cosmos-shared2/webpack';
import { RendererCoreSpec } from './../RendererCore/public';
import { NotificationsSpec } from './../Notifications/public';
import { WebpackHmrNotificationSpec } from './public';

type Context = PluginContext<WebpackHmrNotificationSpec>;

const { on, register } = createPlugin<WebpackHmrNotificationSpec>({
  name: 'webpackHmrNotification'
});

on<RendererCoreSpec>('rendererCore', {
  response: onRendererResponse
});

export { register };

function onRendererResponse(context: Context, msg: WebpackRendererResponse) {
  const { getMethodsOf } = context;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');

  // TODO: Test
  switch (msg.type) {
    case 'rendererHmrFail':
      const { rendererId } = msg.payload;
      notifications.pushTimedNotification({
        id: `renderer-hmr-fail-${rendererId}`,
        type: 'error',
        title: 'Hot reload failed',
        info:
          'Check the browser console to see which module failed to hot reload.'
      });

    default:
    // Nada
  }
}
