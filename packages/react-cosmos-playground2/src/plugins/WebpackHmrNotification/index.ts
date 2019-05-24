import { createPlugin, PluginContext } from 'react-plugin';
import { Message } from 'react-cosmos-shared2/util';
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

function onRendererResponse(context: Context, msg: Message) {
  const { getMethodsOf } = context;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');

  const rendererResponse = msg as WebpackRendererResponse;
  switch (rendererResponse.type) {
    case 'rendererHmrFail':
      notifications.pushTimedNotification({
        // This event could potentially be triggered by multiple renderers at
        // once, but it only makes sense that hot reloading should fail the same
        // in all of them. To prevent duplicating this error in such cases the
        // notification ID is _not_ unique per renderer.
        id: 'renderer-hmr-fail',
        type: 'error',
        title: 'Hot reload failed',
        info:
          'Check the browser console to see which module failed to hot reload.'
      });

    default:
    // Nada
  }
}
